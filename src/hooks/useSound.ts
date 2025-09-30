import { useState, useCallback } from "react";

export function useSound(initialEnabled: boolean = true) {
  const [soundEnabled, setSoundEnabled] = useState(() => {
    const stored = localStorage.getItem("aeropal_sound_enabled");
    return stored !== null ? JSON.parse(stored) : initialEnabled;
  });

  const toggleSound = useCallback(() => {
    setSoundEnabled((prev: boolean) => {
      const newValue = !prev;
      localStorage.setItem("aeropal_sound_enabled", JSON.stringify(newValue));
      return newValue;
    });
  }, []);

  const playBeep = useCallback(
    (frequency = 800, duration = 200) => {
      if (!soundEnabled) return;

      try {
        const audioContext = new (window.AudioContext ||
          (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = frequency;
        oscillator.type = "sine";

        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(
          0.01,
          audioContext.currentTime + duration / 1000
        );

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration / 1000);
      } catch {
        console.log("Audio not supported");
      }
    },
    [soundEnabled]
  );

  return {
    soundEnabled,
    toggleSound,
    playBeep,
  };
}
