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
                <Timer duration={currentStepData.duration} timeLeft={timeLeft} />
            ) : currentStepData.type === 'completion' ? (
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

            <div className="progress-bar">
                <div
                    className="progress-fill progress-enhanced"
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );
};