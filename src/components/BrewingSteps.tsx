import React, { useEffect } from 'react';
import type { Step, Translation } from '../types';
import { Timer } from './Timer';

interface BrewingStepsProps {
    steps: Step[];
    currentStep: number;
    timeLeft: number;
    isTimerActive: boolean;
    hasStartedTimerForStep: boolean;
    isTimerPaused: boolean;
    translation: Translation;
    onNextStep: () => void;
    onPrevStep: () => void;
    onResetApp: () => void;
    onExit: () => void;
    onStartTimer: (duration: number) => void;
    onPauseTimer: () => void;
    onResumeTimer: () => void;
}

export const BrewingSteps: React.FC<BrewingStepsProps> = ({
    steps,
    currentStep,
    timeLeft,
    isTimerActive,
    hasStartedTimerForStep,
    isTimerPaused,
    translation,
    onNextStep,
    onPrevStep,
    onResetApp,
    onExit,
    onStartTimer,
    onPauseTimer,
    onResumeTimer,
}) => {
    const currentStepData = steps[currentStep];

    // Auto-start timer for timer steps
    useEffect(() => {
        if (
            currentStepData?.type === 'timer' &&
            !isTimerActive &&
            !isTimerPaused &&
            !hasStartedTimerForStep
        ) {
            onStartTimer(currentStepData.duration);
        }
    }, [currentStep, currentStepData, isTimerActive, isTimerPaused, hasStartedTimerForStep, onStartTimer]);

    // Auto-advance for automatic steps
    useEffect(() => {
        if (currentStepData?.type === 'automatic') {
            const timer = setTimeout(() => {
                onNextStep();
            }, currentStepData.delay);

            return () => clearTimeout(timer);
        }
    }, [currentStep, currentStepData, onNextStep]);

    if (!currentStepData) {
        return null;
    }

    const isCompletion = currentStepData.type === 'completion';
    const progressPercent = ((currentStep + 1) / steps.length) * 100;

    return (
        <div className="brewing-screen">
            <div className="brew-topbar">
                <button
                    type="button"
                    className="brew-nav-btn"
                    onClick={onPrevStep}
                    disabled={currentStep === 0}
                    aria-label={translation.back}
                >
                    <i className="fas fa-arrow-left" aria-hidden="true" />
                    <span>{translation.back}</span>
                </button>

                <div
                    className="brew-progress"
                    role="progressbar"
                    aria-valuemin={1}
                    aria-valuemax={steps.length}
                    aria-valuenow={currentStep + 1}
                >
                    <div className="brew-progress-track">
                        <div
                            className="brew-progress-fill"
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                </div>

                <button
                    type="button"
                    className="brew-nav-btn"
                    onClick={onExit}
                    aria-label={translation.exit}
                >
                    <span>{translation.exit}</span>
                    <i className="fas fa-xmark" aria-hidden="true" />
                </button>
            </div>

            <div className="brewing-content" key={currentStep}>
                <div className="step-counter text-reveal">
                    <div className="text-content">
                        {translation.stepOf
                            .replace("{current}", (currentStep + 1).toString())
                            .replace("{total}", steps.length.toString())}
                    </div>
                </div>

                <div className="step-text text-reveal">
                    <div className="text-content">{currentStepData.text}</div>
                </div>
                {currentStepData.tip && (
                    <div className="step-tip text-reveal">
                        <div className="text-content">{currentStepData.tip}</div>
                    </div>
                )}

                {currentStepData.type === 'timer' ? (
                    <>
                        <Timer
                            duration={currentStepData.duration}
                            timeLeft={timeLeft}
                            isPaused={isTimerPaused}
                        />
                        <div className="timer-controls">
                            <button
                                type="button"
                                className="timer-control-btn"
                                onClick={isTimerPaused ? onResumeTimer : onPauseTimer}
                                aria-label={isTimerPaused ? translation.resume : translation.pause}
                            >
                                <i
                                    className={`fas ${isTimerPaused ? 'fa-play' : 'fa-pause'}`}
                                    aria-hidden="true"
                                />
                                <span>{isTimerPaused ? translation.resume : translation.pause}</span>
                            </button>
                            <button
                                type="button"
                                className="timer-control-btn"
                                onClick={onNextStep}
                                aria-label={translation.skip}
                            >
                                <i className="fas fa-forward-step" aria-hidden="true" />
                                <span>{translation.skip}</span>
                            </button>
                        </div>
                    </>
                ) : isCompletion ? (
                    <div className="completion-content">
                        <div className="completion-icon">{currentStepData.icon}</div>
                        <div className="completion-title">{currentStepData.text}</div>
                        <div className="completion-subtitle">{currentStepData.subtitle}</div>
                        <button className="action-btn magnetic-btn interactive-element ripple focus-enhanced success-bounce" onClick={onResetApp}>
                            <span>{currentStepData.button}</span>
                        </button>
                    </div>
                ) : currentStepData.type === 'automatic' ? (
                    <div className="automatic-step">
                        <div className="auto-progress">
                            <div className="loading-spinner" />
                            <div>Auto-advancing...</div>
                        </div>
                    </div>
                ) : (
                    <button className="action-btn magnetic-btn interactive-element ripple focus-enhanced" onClick={onNextStep}>
                        <span>{currentStepData.button}</span>
                    </button>
                )}
            </div>
        </div>
    );
};
