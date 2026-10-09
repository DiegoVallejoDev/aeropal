import type { Lang, Recipe, Step } from "../types";
import { dict } from "../i18n";

/**
 * Steps a recipe actually brews with: its own custom steps when present,
 * otherwise the standard AeroPress method built from its parameters.
 */
export function buildSteps(recipe: Recipe, lang: Lang): Step[] {
  if (recipe.customSteps?.length) return recipe.customSteps;

  const s = dict[lang].steps;
  const bloomWater = recipe.bloomWater ?? 50;
  const remaining = Math.max(0, recipe.water - bloomWater);
  const steepTime = recipe.steepTime ?? 90;
  const pressTime = recipe.pressTime ?? 30;
  const temperature = recipe.temperature ?? 93;

  return [
    {
      id: "heat-water",
      type: "instruction",
      text: s.heatWater(temperature),
      tip: s.heatWaterTip,
      button: s.waterReady,
    },
    {
      id: "add-coffee",
      type: "instruction",
      text: s.addCoffee(recipe.coffee),
      tip: s.addCoffeeTip,
      button: s.coffeeAdded,
    },
    {
      id: "position",
      type: "instruction",
      text: s.position,
      tip: s.positionTip,
      button: s.positionButton,
    },
    {
      id: "bloom",
      type: "timer",
      text: s.bloom(bloomWater),
      tip: s.bloomTip,
      duration: recipe.bloomTime ?? 30,
    },
    {
      id: "add-water",
      type: "instruction",
      text: s.addWater(remaining),
      tip: s.addWaterTip,
      button: s.waterAdded,
    },
    {
      id: "flip",
      type: "instruction",
      text: s.flip,
      tip: s.flipTip,
      button: s.flipped,
    },
    {
      id: "steep",
      type: "timer",
      text: s.steep,
      tip: s.steepTip,
      duration: steepTime,
    },
    {
      id: "press",
      type: "timer",
      text: s.press,
      tip: s.pressTip(pressTime),
      duration: pressTime,
    },
    {
      id: "done",
      type: "completion",
      text: s.complete,
      subtitle: s.completeSub,
      button: dict[lang].newBrew,
      icon: "",
    },
  ];
}
