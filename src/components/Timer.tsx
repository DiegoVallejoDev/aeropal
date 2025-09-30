import React from 'react';
import { LottieAnimation } from '../LottieAnimation';

interface TimerProps {
    duration: number;
    timeLeft: number;
}

export const Timer: React.FC<TimerProps> = ({ duration, timeLeft }) => {
    const progressPercent = timeLeft > 0 ? ((duration - timeLeft) / duration) * 100 : 0;
    const circumference = 2 * Math.PI * 100;
    const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

    return (
        <div className="timer-wrapper">
            <div className="lottie-animation-space">
                <div className="lottie">
                    <LottieAnimation />
                </div>
            </div>

            <div className="timer-circle-container">
                <svg className="timer-svg" width="240" height="240">
                    <circle
                        cx="120"
                        cy="120"
                        r="100"
                        fill="none"
                        stroke="var(--light-brown)"
                        strokeWidth="8"
                    />
                    <circle
                        cx="120"
                        cy="120"
                        r="100"
                        fill="none"
                        stroke="var(--soft-red)"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        transform="rotate(-90 120 120)"
                        className="timer-progress-circle"
                    />
                </svg>
                <div className="timer-display">
                    <span className="timer-number">{timeLeft}</span>
                    <span className="timer-label">sec</span>
                </div>
            </div>
        </div>
    );
};