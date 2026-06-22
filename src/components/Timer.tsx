import React from 'react';
import { LottieAnimation } from '../LottieAnimation';

interface TimerProps {
    duration: number;
    timeLeft: number;
    isPaused?: boolean;
}

export const Timer: React.FC<TimerProps> = ({ duration, timeLeft, isPaused = false }) => {
    const progressPercent = timeLeft > 0 ? ((duration - timeLeft) / duration) * 100 : 0;
    const circumference = 2 * Math.PI * 100;
    const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

    // Determine if timer is in urgent state (last 10 seconds or 25% of duration, whichever is smaller)
    const urgentThreshold = Math.min(10, Math.floor(duration * 0.25));
    const isUrgent = !isPaused && timeLeft <= urgentThreshold && timeLeft > 0;

    // Show mm:ss for durations of a minute or more, plain seconds otherwise.
    const showMinutes = timeLeft >= 60;
    const displayValue = showMinutes
        ? `${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, '0')}`
        : `${timeLeft}`;
    const displayLabel = showMinutes ? 'min' : 'sec';

    return (
        <div className="timer-wrapper">
            <div className="lottie-animation-space float-gentle">
                <div className="lottie">
                    <LottieAnimation />
                </div>
            </div>

            <div className={`timer-circle-container ${isUrgent ? 'urgent' : ''} ${isPaused ? 'paused' : ''}`}>
                <svg className="timer-svg" viewBox="0 0 240 240" width="100%" height="100%">
                    {/* Background circle */}
                    <circle
                        cx="120"
                        cy="120"
                        r="100"
                        fill="none"
                        stroke="var(--light-brown)"
                        strokeWidth="8"
                    />
                    {/* Progress circle */}
                    <circle
                        cx="120"
                        cy="120"
                        r="100"
                        fill="none"
                        stroke={isUrgent ? "var(--muted-red)" : "var(--soft-red)"}
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        transform="rotate(-90 120 120)"
                        className="timer-progress-circle"

                    />
                    {/* Pulse circle for urgent state */}
                    {isUrgent && (
                        <circle
                            cx="120"
                            cy="120"
                            r="100"
                            fill="none"
                            stroke="var(--muted-red)"
                            strokeWidth="2"
                            opacity="0.3"
                            className="timer-pulse-circle"
                        />
                    )}
                </svg>
                <div className="timer-display">
                    <span className={`timer-number count-up ${isUrgent ? 'urgent' : ''}`}>
                        {displayValue}
                    </span>
                    <span className={`timer-label ${isUrgent ? 'urgent' : ''}`}>
                        {isPaused ? 'paused' : displayLabel}
                    </span>
                </div>
            </div>
        </div>
    );
};
