import { useCallback, useRef, useState } from "react";
import { SOUND_KEY, readPref, writePref } from "../lib/storage";

type AudioContextCtor = typeof AudioContext;

function createContext(): AudioContext | null {
  const Ctor: AudioContextCtor | undefined =
    window.AudioContext ??
    (window as Window & { webkitAudioContext?: AudioContextCtor })
      .webkitAudioContext;
  if (!Ctor) return null;
  try {
    return new Ctor();
  } catch {
    return null;
  }
}

export function useSound() {
  const [soundEnabled, setSoundEnabled] = useState<boolean>(
    () => !["0", "false"].includes(readPref(SOUND_KEY, "1"))
  );
  const ctxRef = useRef<AudioContext | null>(null);

  const getContext = useCallback((): AudioContext | null => {
    if (!ctxRef.current) ctxRef.current = createContext();
    if (ctxRef.current?.state === "suspended") {
      void ctxRef.current.resume();
    }
    return ctxRef.current;
  }, []);

  const tone = useCallback(
    (frequency: number, offset: number, duration: number, volume = 0.07) => {
      const ctx = getContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const startAt = ctx.currentTime + offset;

      osc.type = "sine";
      osc.frequency.value = frequency;
      gain.gain.setValueAtTime(0, startAt);
      gain.gain.linearRampToValueAtTime(volume, startAt + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, startAt + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startAt);
      osc.stop(startAt + duration + 0.05);
    },
    [getContext]
  );

  /** short tick for the final countdown seconds */
  const tick = useCallback(() => {
    if (!soundEnabled) return;
    tone(1180, 0, 0.12, 0.05);
  }, [soundEnabled, tone]);

  /** warm two-note chime when a timed step completes */
  const chime = useCallback(() => {
    if (!soundEnabled) return;
    tone(659.25, 0, 0.5, 0.08); // E5
    tone(987.77, 0.14, 0.7, 0.07); // B5
  }, [soundEnabled, tone]);

  const toggleSound = useCallback(() => {
    setSoundEnabled((prev) => {
      const next = !prev;
      writePref(SOUND_KEY, next ? "1" : "0");
      return next;
    });
  }, []);

  return { soundEnabled, toggleSound, tick, chime };
}
