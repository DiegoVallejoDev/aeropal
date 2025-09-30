import React, { useEffect } from 'react';
import type { Step, Translation } from '../types';
import { Timer } from './Timer';

interface BrewingStepsProps {
    steps: Step[];
    currentStep: number;
    timeLeft: number;
    isTimerActive: boolean;
    hasStartedTimerForStep: boolean;
    translation: Translation;
    onNextStep: () => void;
    onResetApp: () => void;
    onStartTimer: (duration: number) => void;
}

export const BrewingSteps: React.FC<BrewingStepsProps> = ({
    steps,
    currentStep,
    timeLeft,
    isTimerActive,
    hasStartedTimerForStep,
    translation,
    onNextStep,
    onResetApp,
    onStartTimer,
}) => {
    const currentStepData = steps[currentStep];
    const progress = ((currentStep + 1) / steps.length) * 100;

    // Auto-start timer for timer steps
    useEffect(() => {
        if (
            currentStepData?.type === 'timer' &&
            !isTimerActive &&
            !hasStartedTimerForStep
        ) {
            onStartTimer(currentStepData.duration);
        }
    }, [currentStep, currentStepData, isTimerActive, hasStartedTimerForStep, onStartTimer]);

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

    return (
        <div className="brewing-content">
            <div className="step-counter">
                {translation.stepOf
                    .replace("{current}", (currentStep + 1).toString())
                    .replace("{total}", steps.length.toString())}
            </div>

            <div className="step-text">{currentStepData.text}</div>
            {currentStepData.tip && (
                <div className="step-tip">{currentStepData.tip}</div>
            )}

            {currentStepData.type === 'timer' ? (
                <Timer duration={currentStepData.duration} timeLeft={timeLeft} />
            ) : currentStepData.type === 'completion' ? (
                <div className="completion-content">
                    <div className="completion-icon">{currentStepData.icon}</div>
                    <div className="completion-title">{currentStepData.text}</div>
                    <div className="completion-subtitle">{currentStepData.subtitle}</div>
                    <button className="action-btn" onClick={onResetApp}>
                        {currentStepData.button}
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
                <button className="action-btn" onClick={onNextStep}>
                    {currentStepData.button}
                </button>
            )}

            <div className="progress-bar">
                <div
                    className="progress-fill"
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );
};