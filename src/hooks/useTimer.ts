import { useCallback, useRef, useEffect, useState } from "react";

interface UseTimerReturn {
  timeLeft: number;
  isActive: boolean;
  hasStarted: boolean;
  startTimer: (duration: number, onComplete?: () => void) => void;
  stopTimer: () => void;
  resetTimer: () => void;
}

export function useTimer(
  soundEnabled: boolean = false,
  playBeep?: (frequency?: number, duration?: number) => void
): UseTimerReturn {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const onCompleteRef = useRef<(() => void) | undefined>(undefined);
  const [timeLeft, setTimeLeft] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  const clearAllTimers = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const startTimer = useCallback(
    (duration: number, onComplete?: () => void) => {
      clearAllTimers();
      onCompleteRef.current = onComplete;
      setTimeLeft(duration);
      setHasStarted(true);

      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            timerRef.current = null;

            if (playBeep && soundEnabled) {
              playBeep(900, 600);
            }

            // Call completion callback after a small delay
            timeoutRef.current = setTimeout(() => {
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
    },
    [clearAllTimers, playBeep, soundEnabled]
  );

  const stopTimer = useCallback(() => {
    clearAllTimers();
    setTimeLeft(0);
    setHasStarted(false);
  }, [clearAllTimers]);

  const resetTimer = useCallback(() => {
    clearAllTimers();
    setTimeLeft(0);
    setHasStarted(false);
  }, [clearAllTimers]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearAllTimers();
    };
  }, [clearAllTimers]);

  return {
    timeLeft,
    isActive: timerRef.current !== null,
    hasStarted,
    startTimer,
    stopTimer,
    resetTimer,
  };
}
