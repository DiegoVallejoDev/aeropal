import React, { useState } from 'react';
import type { Recipe, Step, StepType, Translation, InstructionStep, TimerStep, AutomaticStep, CompletionStep } from '../types';

interface RecipeEditorProps {
    recipe: Recipe;
    translation: Translation;
    onSave: (recipe: Recipe) => void;
    onCancel: () => void;
    onDelete?: (recipeId: string) => void;
}

export const RecipeEditor: React.FC<RecipeEditorProps> = ({
    recipe,
    translation,
    onSave,
    onCancel,
}) => {
    const [editedRecipe, setEditedRecipe] = useState<Recipe>({ ...recipe });

    const updateRecipe = (updates: Partial<Recipe>) => {
        setEditedRecipe(prev => ({ ...prev, ...updates }));
    };

    const updateStep = (stepIndex: number, updates: Partial<Step>) => {
        const newSteps = [...(editedRecipe.customSteps || [])];
        newSteps[stepIndex] = { ...newSteps[stepIndex], ...updates } as Step;
        updateRecipe({ customSteps: newSteps });
    };

    const addStep = (type: StepType) => {
        const newSteps = [...(editedRecipe.customSteps || [])];
        const stepId = `step_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;

        let newStep: Step;

        switch (type) {
            case 'instruction':
                newStep = {
                    id: stepId,
                    type: 'instruction',
                    text: 'New instruction step',
                    button: 'Continue',
                    tip: '',
                } as InstructionStep;
                break;
            case 'timer':
                newStep = {
                    id: stepId,
                    type: 'timer',
                    text: 'Timer step',
                    duration: 30,
                    tip: '',
                    autoAdvance: true,
                } as TimerStep;
                break;
            case 'automatic':
                newStep = {
                    id: stepId,
                    type: 'automatic',
                    text: 'Automatic step',
                    delay: 2000,
                    tip: '',
                } as AutomaticStep;
                break;
            case 'completion':
                newStep = {
                    id: stepId,
                    type: 'completion',
                    text: 'Brewing complete!',
                    subtitle: 'Enjoy your coffee',
                    button: 'New Brew',
                    icon: '☕',
                    tip: '',
                } as CompletionStep;
                break;
        }

        newSteps.push(newStep);
        updateRecipe({ customSteps: newSteps });
    };

    const moveStep = (fromIndex: number, toIndex: number) => {
        const newSteps = [...(editedRecipe.customSteps || [])];
        const [movedStep] = newSteps.splice(fromIndex, 1);
        newSteps.splice(toIndex, 0, movedStep);
        updateRecipe({ customSteps: newSteps });
    };

    const removeStep = (stepIndex: number) => {
        const newSteps = [...(editedRecipe.customSteps || [])];
        newSteps.splice(stepIndex, 1);
        updateRecipe({ customSteps: newSteps });
    };

    const handleSave = () => {
        if (!editedRecipe.name.trim()) {
            alert(translation.enterRecipeName);
            return;
        }
        onSave(editedRecipe);
    };

    return (
        <div className="recipe-editor-overlay">
            <div className="recipe-editor">
                <div className="editor-header">
                    <h2>{recipe.id ? translation.editRecipe : translation.createRecipe}</h2>
                    <button className="close-btn" onClick={onCancel}>×</button>
                </div>

                <div className="editor-content">
                    {/* Basic Recipe Info */}
                    <div className="recipe-basic-info">
                        <div className="form-group">
                            <label>{translation.recipeName}</label>
                            <input
                                type="text"
                                value={editedRecipe.name}
                                onChange={(e) => updateRecipe({ name: e.target.value })}
                                placeholder="Enter recipe name"
                            />
                        </div>

                        <div className="form-group">
                            <label>{translation.recipeDescription}</label>
                            <textarea
                                value={editedRecipe.description}
                                onChange={(e) => updateRecipe({ description: e.target.value })}
                                placeholder="Describe this recipe"
                                rows={2}
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>{translation.coffeeAmount}</label>
                                <input
                                    type="number"
                                    value={editedRecipe.coffee}
                                    onChange={(e) => updateRecipe({ coffee: Number(e.target.value) })}
                                    min="1"
                                    max="50"
                                />
                            </div>

                            <div className="form-group">
                                <label>{translation.waterAmount}</label>
                                <input
                                    type="number"
                                    value={editedRecipe.water}
                                    onChange={(e) => updateRecipe({ water: Number(e.target.value) })}
                                    min="50"
                                    max="500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Custom Steps */}
                    <div className="custom-steps-section">
                        <h3>Custom Steps</h3>

                        <div className="add-step-buttons">
                            <button onClick={() => addStep('instruction')} className="add-step-btn">
                                + Instruction
                            </button>
                            <button onClick={() => addStep('timer')} className="add-step-btn">
                                + Timer
                            </button>
                            <button onClick={() => addStep('automatic')} className="add-step-btn">
                                + Automatic
                            </button>
                            <button onClick={() => addStep('completion')} className="add-step-btn">
                                + Completion
                            </button>
                        </div>

                        <div className="steps-list">
                            {(editedRecipe.customSteps || []).map((step, index) => (
                                <div key={step.id} className="step-editor">
                                    <div className="step-header">
                                        <span className="step-number">{index + 1}</span>
                                        <span className="step-type">{step.type}</span>
                                        <div className="step-controls">
                                            <button
                                                onClick={() => moveStep(index, Math.max(0, index - 1))}
                                                disabled={index === 0}
                                                className="move-btn"
                                            >
                                                ↑
                                            </button>
                                            <button
                                                onClick={() => moveStep(index, Math.min((editedRecipe.customSteps || []).length - 1, index + 1))}
                                                disabled={index === (editedRecipe.customSteps || []).length - 1}
                                                className="move-btn"
                                            >
                                                ↓
                                            </button>
                                            <button
                                                onClick={() => removeStep(index)}
                                                className="delete-btn"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </div>

                                    <div className="step-fields">
                                        <div className="form-group">
                                            <label>{translation.stepText}</label>
                                            <textarea
                                                value={step.text}
                                                onChange={(e) => updateStep(index, { text: e.target.value })}
                                                rows={2}
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>{translation.stepTip}</label>
                                            <input
                                                type="text"
                                                value={step.tip || ''}
                                                onChange={(e) => updateStep(index, { tip: e.target.value })}
                                                placeholder="Optional tip"
                                            />
                                        </div>

                                        {/* Step-specific fields */}
                                        {step.type === 'instruction' && (
                                            <div className="form-group">
                                                <label>{translation.buttonText}</label>
                                                <input
                                                    type="text"
                                                    value={(step as InstructionStep).button}
                                                    onChange={(e) => updateStep(index, { button: e.target.value })}
                                                />
                                            </div>
                                        )}

                                        {step.type === 'timer' && (
                                            <>
                                                <div className="form-group">
                                                    <label>{translation.timerDuration}</label>
                                                    <input
                                                        type="number"
                                                        value={(step as TimerStep).duration}
                                                        onChange={(e) => updateStep(index, { duration: Number(e.target.value) })}
                                                        min="1"
                                                        max="600"
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label>
                                                        <input
                                                            type="checkbox"
                                                            checked={(step as TimerStep).autoAdvance !== false}
                                                            onChange={(e) => updateStep(index, { autoAdvance: e.target.checked })}
                                                        />
                                                        Auto-advance when timer completes
                                                    </label>
                                                </div>
                                            </>
                                        )}

                                        {step.type === 'automatic' && (
                                            <div className="form-group">
                                                <label>{translation.autoAdvanceDelay}</label>
                                                <input
                                                    type="number"
                                                    value={(step as AutomaticStep).delay}
                                                    onChange={(e) => updateStep(index, { delay: Number(e.target.value) })}
                                                    min="500"
                                                    max="10000"
                                                    step="500"
                                                />
                                            </div>
                                        )}

                                        {step.type === 'completion' && (
                                            <>
                                                <div className="form-group">
                                                    <label>Subtitle</label>
                                                    <input
                                                        type="text"
                                                        value={(step as CompletionStep).subtitle || ''}
                                                        onChange={(e) => updateStep(index, { subtitle: e.target.value })}
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label>{translation.buttonText}</label>
                                                    <input
                                                        type="text"
                                                        value={(step as CompletionStep).button}
                                                        onChange={(e) => updateStep(index, { button: e.target.value })}
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label>Icon</label>
                                                    <input
                                                        type="text"
                                                        value={(step as CompletionStep).icon || ''}
                                                        onChange={(e) => updateStep(index, { icon: e.target.value })}
                                                        placeholder="e.g., ☕, ✓, 🎉"
                                                    />
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="editor-actions">
                    <div className="editor-actions-left">
                        {/* nothing yet here */}
                    </div>
                    <div className="editor-actions-right">
                        <button className="cancel-btn" onClick={onCancel}>
                            {translation.cancelEdit}
                        </button>
                        <button className="save-btn" onClick={handleSave}>
                            {translation.saveRecipe}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};