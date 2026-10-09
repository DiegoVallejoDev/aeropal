export type Lang = "en" | "es";

export type StepType = "instruction" | "timer" | "automatic" | "completion";

interface StepBase {
  id: string;
  type: StepType;
  text: string;
  tip?: string;
}

export interface InstructionStep extends StepBase {
  type: "instruction";
  button: string;
}

export interface TimerStep extends StepBase {
  type: "timer";
  duration: number; // seconds
  autoAdvance?: boolean;
}

export interface AutomaticStep extends StepBase {
  type: "automatic";
  delay: number; // milliseconds
}

export interface CompletionStep extends StepBase {
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
  createdAt?: string;

  coffee: number; // grams
  water: number; // ml, total
  bloomWater?: number; // ml
  bloomTime?: number; // seconds
  steepTime?: number; // seconds
  pressTime?: number; // seconds
  temperature?: number; // celsius

  customSteps?: Step[];
}

export interface BuiltInRecipe {
  id: string;
  coffee: number;
  water: number;
  bloomWater: number;
  bloomTime: number;
  steepTime: number;
  pressTime: number;
  temperature: number;
}
