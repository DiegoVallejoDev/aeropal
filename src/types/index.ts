export type StepType = "instruction" | "timer" | "automatic" | "completion";

export interface BaseStep {
  id: string;
  type: StepType;
  text: string;
  tip?: string;
}

export interface InstructionStep extends BaseStep {
  type: "instruction";
  button: string;
}

export interface TimerStep extends BaseStep {
  type: "timer";
  duration: number;
  autoAdvance?: boolean;
}

export interface AutomaticStep extends BaseStep {
  type: "automatic";
  delay: number; // milliseconds to auto-advance
}

export interface CompletionStep extends BaseStep {
  type: "completion";
  subtitle?: string;
  button: string;
  icon?: string;
}

export type Step = InstructionStep | TimerStep | AutomaticStep | CompletionStep;

export interface Recipe {
  id: string;
  name: string;
  description: string;
  isCustom: boolean;
  author?: string;
  createdAt?: string;

  // Recipe parameters
  coffee: number; // grams
  water: number; // ml total
  bloomWater?: number; // ml for bloom
  bloomTime?: number; // seconds
  steepTime?: number; // seconds
  pressTime?: number; // seconds
  temperature?: number; // celsius

  // Custom steps (overrides default step generation)
  customSteps?: Step[];
}

export interface BuiltInRecipeParams {
  coffee: number;
  bloom: number;
  totalWater: number;
  steepTime: number;
  pressTime: number;
}

export type Language = "en" | "es";

export interface Translation {
  subtitle: string;
  stepOf: string;
  recipeTitle: string;
  startBrewing: string;
  soundToggle: string;
  customRecipes: string;
  createRecipe: string;
  editRecipe: string;
  deleteRecipe: string;
  saveRecipe: string;
  cancelEdit: string;
  recipeName: string;
  recipeDescription: string;
  coffeeAmount: string;
  waterAmount: string;
  addStep: string;
  stepType: string;
  stepText: string;
  stepTip: string;
  buttonText: string;
  timerDuration: string;
  autoAdvanceDelay: string;
  moveUp: string;
  moveDown: string;
  deleteStep: string;
  confirmDeleteRecipe: string;
  enterRecipeName: string;
  delete: string;
  recipes: {
    classic: { name: string; details: string };
    strong: { name: string; details: string };
    light: { name: string; details: string };
    iced: { name: string; details: string };
  };
}

export interface AppState {
  currentLanguage: Language;
  currentStep: number;
  selectedRecipe: string;
  soundEnabled: boolean;
  isBrewingStarted: boolean;
  timeLeft: number;
  isTimerActive: boolean;
  hasStartedTimerForStep: boolean;
  showRecipeEditor: boolean;
  editingRecipe: Recipe | null;
}

export interface TimerState {
  timeLeft: number;
  isActive: boolean;
  hasStarted: boolean;
}

export interface SoundSettings {
  enabled: boolean;
  frequency: number;
  duration: number;
}
