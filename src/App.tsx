import React, { useState, useEffect, useCallback, useMemo } from 'react';
import './App.css';
import './animations.css';
import type { Recipe, Step } from './types';
import {
  LanguageToggle,
  SoundToggle,
  RecipeSelector,
  BrewingSteps,
  RecipeEditor
} from './components';
import { useLanguage, useSound, useRecipes, useTimer } from './hooks';
import { translations } from './utils/translations';
import { StepGenerator } from './utils/recipeManager';


const App: React.FC = () => {
  const { currentLanguage, toggleLanguage } = useLanguage();
  const { soundEnabled, toggleSound, playBeep } = useSound();
  const { allRecipes, getRecipeById, saveRecipe, deleteRecipe, createNewRecipe } = useRecipes(currentLanguage);

  // App state
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedRecipe, setSelectedRecipe] = useState('classic');
  const [isBrewingStarted, setIsBrewingStarted] = useState(false);
  const [showRecipeEditor, setShowRecipeEditor] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);

  // Timer functionality
  const { timeLeft, isActive: isTimerActive, hasStarted: hasStartedTimerForStep, startTimer: startTimerHook, stopTimer, resetTimer } = useTimer(soundEnabled, playBeep);

  // Wake lock functionality
  // Define a type for the wakeLock property
  type WakeLockType = {
    request(type: 'screen'): Promise<unknown>;
    release?(): void;
  };

  const wakeLock = useCallback(async () => {
    const nav = navigator as Navigator & { wakeLock?: WakeLockType };
    if (nav.wakeLock) {
      try {
        await nav.wakeLock.request('screen');
      } catch (err) {
        console.error('Wake Lock error:', err);
      }
    }
  }, []);

  const wakeRelease = useCallback(() => {
    const nav = navigator as Navigator & { wakeLock?: WakeLockType };
    if (nav.wakeLock && typeof nav.wakeLock.release === 'function') {
      nav.wakeLock.release();
    }
  }, []);

  // Timer management
  const startTimer = useCallback((duration: number) => {
    startTimerHook(duration, () => {
      // Auto-advance to next step after timer completes
      setCurrentStep((s) => s + 1);
    });
    wakeLock();
  }, [startTimerHook, wakeLock]);

  const nextStep = () => {
    stopTimer();
    setCurrentStep((prev) => prev + 1);
  };

  const resetApp = () => {
    resetTimer();
    setCurrentStep(0);
    setIsBrewingStarted(false);
    wakeRelease();
  };

  // Get current recipe and steps
  const currentRecipe = getRecipeById(selectedRecipe);
  const steps: Step[] = useMemo(() => currentRecipe ?
    StepGenerator.generateDefaultSteps(currentRecipe, currentLanguage) : [],
    [currentRecipe, currentLanguage]);

  // Reset timer state when step changes (but only if not a timer step)
  useEffect(() => {
    const currentStepData = steps[currentStep];
    if (currentStepData?.type !== 'timer') {
      resetTimer();
    }
  }, [currentStep, resetTimer, steps]);

  // Translation
  const t = translations[currentLanguage];

  // Recipe management handlers
  const handleCreateRecipe = () => {
    const newRecipe = createNewRecipe();
    setEditingRecipe(newRecipe);
    setShowRecipeEditor(true);
  };

  const handleSaveRecipe = (recipe: Recipe) => {
    const savedRecipe = saveRecipe(recipe);
    setShowRecipeEditor(false);
    setEditingRecipe(null);
    // Select the saved recipe
    setSelectedRecipe(savedRecipe.id);
  };

  const handleDeleteRecipe = (recipeId: string) => {
    if (window.confirm(t.confirmDeleteRecipe)) {
      deleteRecipe(recipeId);
      setShowRecipeEditor(false);
      setEditingRecipe(null);
      // If we were viewing the deleted recipe, switch to classic
      if (selectedRecipe === recipeId) {
        setSelectedRecipe('classic');
      }
    }
  };

  const handleCancelEdit = () => {
    setShowRecipeEditor(false);
    setEditingRecipe(null);
  };

  return (
    <div className="app-container">
      <div className="header-controls">
        <LanguageToggle
          currentLanguage={currentLanguage}
          onToggle={toggleLanguage}
        />
        <SoundToggle
          soundEnabled={soundEnabled}
          onToggle={toggleSound}
          title={t.soundToggle}
        />
      </div>

      <div className="header">
        <div className="logo">aeroPal</div>
        <div className="subtitle">{t.subtitle}</div>
      </div>

      {!isBrewingStarted ? (
        <RecipeSelector
          recipes={allRecipes}
          selectedRecipe={selectedRecipe}
          onSelectRecipe={setSelectedRecipe}
          onStartBrewing={() => setIsBrewingStarted(true)}
          onCreateRecipe={handleCreateRecipe}
          onDeleteRecipe={handleDeleteRecipe}
          translation={t}
        />
      ) : (
        <BrewingSteps
          steps={steps}
          currentStep={currentStep}
          timeLeft={timeLeft}
          isTimerActive={isTimerActive}
          hasStartedTimerForStep={hasStartedTimerForStep}
          translation={t}
          onNextStep={nextStep}
          onResetApp={resetApp}
          onStartTimer={startTimer}
        />
      )}

      {/* Recipe Editor Modal */}
      {showRecipeEditor && editingRecipe && (
        <RecipeEditor
          recipe={editingRecipe}
          translation={t}
          onSave={handleSaveRecipe}
          onCancel={handleCancelEdit}
          onDelete={editingRecipe.isCustom ? handleDeleteRecipe : undefined}
        />
      )}

      {/* Progress bar (only show when brewing) */}
      {isBrewingStarted && (
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
      )}
    </div>
  );
};

export default App;