import React from "react";
import { formatClock } from "../lib/format";

interface TimerRingProps {
  remainingMs: number;
  durationMs: number;
  paused: boolean;
  pausedLabel: string;
}

const R = 86;
const CIRCUMFERENCE = 2 * Math.PI * R;

/** Thin progress ring sweeping smoothly with the countdown's ms precision. */
export const TimerRing: React.FC<TimerRingProps> = ({
  remainingMs,
  durationMs,
  paused,
  pausedLabel,
}) => {
  const progress = durationMs > 0 ? 1 - remainingMs / durationMs : 0;
  const secondsLeft = Math.ceil(remainingMs / 1000);

  return (
    <div className={`timer-ring ${paused ? "paused" : ""}`}>
      <svg viewBox="0 0 200 200" role="img" aria-label={formatClock(secondsLeft)}>
        {/* quarter tick marks */}
        {[0, 90, 180, 270].map((deg) => (
          <line
            key={deg}
            x1="100"
            y1="6"
            x2="100"
            y2="12"
            className="ring-tick"
            transform={`rotate(${deg} 100 100)`}
          />
        ))}
        <circle cx="100" cy="100" r={R} className="ring-track" />
        <circle
          cx="100"
          cy="100"
          r={R}
          className="ring-progress"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE * (1 - progress)}
          transform="rotate(-90 100 100)"
        />
      </svg>
      <div className="ring-center">
        <span className="ring-time">{formatClock(secondsLeft)}</span>
        {paused && <span className="ring-paused">{pausedLabel}</span>}
      </div>
    </div>
  );
};
