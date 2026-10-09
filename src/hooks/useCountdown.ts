import { useCallback, useEffect, useRef, useState } from "react";

export interface Countdown {
  /** ms remaining; updates every animation frame while running. */
  remainingMs: number;
  durationMs: number;
  running: boolean;
  paused: boolean;
  /** true from start() until the done callback fires. */
  engaged: boolean;
  start: (seconds: number, onDone?: () => void) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
}

/** Drift-free countdown driven by performance.now() + requestAnimationFrame. */
export function useCountdown(): Countdown {
  const [remainingMs, setRemainingMs] = useState(0);
  const [durationMs, setDurationMs] = useState(0);
  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const [engaged, setEngaged] = useState(false);

  const endAtRef = useRef(0);
  const leftRef = useRef(0);
  const onDoneRef = useRef<(() => void) | undefined>(undefined);
  const doneTimeoutRef = useRef<number | null>(null);

  const clearDoneTimeout = useCallback(() => {
    if (doneTimeoutRef.current !== null) {
      window.clearTimeout(doneTimeoutRef.current);
      doneTimeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!running) return;
    let raf = 0;
    const tick = () => {
      const left = endAtRef.current - performance.now();
      if (left <= 0) {
        setRemainingMs(0);
        setRunning(false);
        // a short beat at zero before handing back control
        doneTimeoutRef.current = window.setTimeout(() => {
          doneTimeoutRef.current = null;
          setEngaged(false);
          onDoneRef.current?.();
        }, 900);
        return;
      }
      setRemainingMs(left);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [running]);

  const start = useCallback(
    (seconds: number, onDone?: () => void) => {
      clearDoneTimeout();
      const ms = Math.max(0, seconds * 1000);
      onDoneRef.current = onDone;
      endAtRef.current = performance.now() + ms;
      leftRef.current = ms;
      setDurationMs(ms);
      setRemainingMs(ms);
      setPaused(false);
      setEngaged(true);
      setRunning(ms > 0);
    },
    [clearDoneTimeout]
  );

  const pause = useCallback(() => {
    if (!running) return;
    leftRef.current = Math.max(0, endAtRef.current - performance.now());
    setRunning(false);
    setPaused(true);
  }, [running]);

  const resume = useCallback(() => {
    if (!paused || !engaged || leftRef.current <= 0) return;
    endAtRef.current = performance.now() + leftRef.current;
    setPaused(false);
    setRunning(true);
  }, [paused, engaged]);

  const stop = useCallback(() => {
    clearDoneTimeout();
    onDoneRef.current = undefined;
    setRunning(false);
    setPaused(false);
    setEngaged(false);
    setRemainingMs(0);
    setDurationMs(0);
  }, [clearDoneTimeout]);

  useEffect(() => clearDoneTimeout, [clearDoneTimeout]);

  return {
    remainingMs,
    durationMs,
    running,
    paused,
    engaged,
    start,
    pause,
    resume,
    stop,
  };
}
