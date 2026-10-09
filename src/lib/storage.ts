import type { Recipe, Step, StepType } from "../types";

const RECIPES_KEY = "aeropal_custom_recipes";
export const LANG_KEY = "aeropal_language";
export const SOUND_KEY = "aeropal_sound_enabled";

const VALID_STEP_TYPES: StepType[] = [
  "instruction",
  "timer",
  "automatic",
  "completion",
];

function isValidStep(step: unknown): step is Step {
  if (typeof step !== "object" || step === null) return false;
  const s = step as Record<string, unknown>;
  return (
    typeof s.id === "string" &&
    typeof s.text === "string" &&
    VALID_STEP_TYPES.includes(s.type as StepType)
  );
}

function isValidRecipe(recipe: unknown): recipe is Recipe {
  if (typeof recipe !== "object" || recipe === null) return false;
  const r = recipe as Record<string, unknown>;
  const stepsOk =
    r.customSteps === undefined ||
    (Array.isArray(r.customSteps) && r.customSteps.every(isValidStep));
  return (
    typeof r.id === "string" &&
    typeof r.name === "string" &&
    typeof r.coffee === "number" &&
    typeof r.water === "number" &&
    stepsOk
  );
}

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage unavailable (private mode, quota) — fail silently
  }
}

export function loadCustomRecipes(): Recipe[] {
  const parsed = readJson<unknown>(RECIPES_KEY, []);
  if (!Array.isArray(parsed)) return [];
  return parsed.filter(isValidRecipe).map((r) => ({ ...r, isCustom: true }));
}

export function persistCustomRecipes(recipes: Recipe[]): void {
  writeJson(RECIPES_KEY, recipes);
}

export function newRecipeId(): string {
  return `custom_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
}

export function readPref(key: string, fallback: string): string {
  try {
    return localStorage.getItem(key) ?? fallback;
  } catch {
    return fallback;
  }
}

export function writePref(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    // ignore
  }
}
