import { useCallback, useRef, useEffect, useState } from "react";

interface UseTimerReturn {
  timeLeft: number;
  isActive: boolean;
  hasStarted: boolean;
  isPaused: boolean;
  startTimer: (duration: number, onComplete?: () => void) => void;
  stopTimer: () => void;
  resetTimer: () => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
}

export function useTimer(
  soundEnabled: boolean = false,
  playBeep?: (frequency?: number, duration?: number) => void
): UseTimerReturn {
  const timerRef = useRef<number | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const onCompleteRef = useRef<(() => void) | undefined>(undefined);
  const [timeLeft, setTimeLeft] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const clearAllTimers = useCallback(() => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  // Starts (or resumes) the countdown interval from the current timeLeft value.
  const runInterval = useCallback(() => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
    }

    setIsActive(true);
    timerRef.current = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(timerRef.current!);
          timerRef.current = null;
          setIsActive(false);

          if (playBeep && soundEnabled) {
            playBeep(900, 600);
          }

          // Call completion callback after a small delay
          timeoutRef.current = window.setTimeout(() => {
            onCompleteRef.current?.();
            setHasStarted(false);
          }, 1000);
          return 0;
        }

        // Beep for last 3 seconds
        if (prev <= 3 && playBeep && soundEnabled) {
          playBeep(1100, 200);
        }

        return prev - 1;
      });
    }, 1000);
  }, [playBeep, soundEnabled]);

  const startTimer = useCallback(
    (duration: number, onComplete?: () => void) => {
      clearAllTimers();
      onCompleteRef.current = onComplete;
      setTimeLeft(duration);
      setHasStarted(true);
      setIsPaused(false);
      runInterval();
    },
    [clearAllTimers, runInterval]
  );

  const pauseTimer = useCallback(() => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
      setIsActive(false);
      setIsPaused(true);
    }
  }, []);

  const resumeTimer = useCallback(() => {
    if (!timerRef.current && hasStarted && timeLeft > 0) {
      setIsPaused(false);
      runInterval();
    }
  }, [hasStarted, timeLeft, runInterval]);

  const stopTimer = useCallback(() => {
    clearAllTimers();
    setTimeLeft(0);
    setHasStarted(false);
    setIsActive(false);
    setIsPaused(false);
  }, [clearAllTimers]);

  const resetTimer = useCallback(() => {
    clearAllTimers();
    setTimeLeft(0);
    setHasStarted(false);
    setIsActive(false);
    setIsPaused(false);
  }, [clearAllTimers]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearAllTimers();
    };
  }, [clearAllTimers]);

  return {
    timeLeft,
    isActive,
    hasStarted,
    isPaused,
    startTimer,
    stopTimer,
    resetTimer,
    pauseTimer,
    resumeTimer,
  };
}
