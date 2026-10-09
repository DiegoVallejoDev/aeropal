import { useEffect, useRef } from "react";

/** Holds a screen wake lock while `active` is true; re-acquires on tab focus. */
export function useWakeLock(active: boolean): void {
  const sentinelRef = useRef<WakeLockSentinel | null>(null);

  useEffect(() => {
    if (!active || !("wakeLock" in navigator)) return;

    const acquire = async () => {
      try {
        sentinelRef.current = await navigator.wakeLock.request("screen");
      } catch {
        // denied or unsupported — brewing still works, screen may sleep
      }
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") void acquire();
    };

    void acquire();
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      sentinelRef.current?.release().catch(() => undefined);
      sentinelRef.current = null;
    };
  }, [active]);
}
