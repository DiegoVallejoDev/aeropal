import type { Recipe, TimerStep } from "../types";

/** 75 → "1:15", 30 → "0:30". */
export function formatClock(seconds: number): string {
  const safe = Math.max(0, Math.round(seconds));
  const m = Math.floor(safe / 60);
  const s = safe % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function formatRatio(recipe: Recipe): string {
  if (recipe.coffee <= 0) return "—";
  return `1:${Math.round(recipe.water / recipe.coffee)}`;
}

/** Total timed seconds across the recipe's steps. */
export function brewSeconds(recipe: Recipe): number {
  if (recipe.customSteps?.length) {
    return recipe.customSteps.reduce(
      (sum, step) => sum + (step.type === "timer" ? (step as TimerStep).duration : 0),
      0
    );
  }
  return (recipe.bloomTime ?? 30) + (recipe.steepTime ?? 90) + (recipe.pressTime ?? 30);
}
