import type { BuiltInRecipe, Recipe, Lang } from "../types";
import { dict } from "../i18n";

export const BUILT_IN_RECIPES: BuiltInRecipe[] = [
  {
    id: "classic",
    coffee: 14,
    water: 230,
    bloomWater: 30,
    bloomTime: 30,
    steepTime: 90,
    pressTime: 30,
    temperature: 93,
  },
  {
    id: "strong",
    coffee: 20,
    water: 250,
    bloomWater: 30,
    bloomTime: 30,
    steepTime: 120,
    pressTime: 30,
    temperature: 93,
  },
  {
    id: "light",
    coffee: 11,
    water: 250,
    bloomWater: 45,
    bloomTime: 30,
    steepTime: 45,
    pressTime: 20,
    temperature: 90,
  },
  {
    id: "iced",
    coffee: 22,
    water: 200,
    bloomWater: 70,
    bloomTime: 30,
    steepTime: 75,
    pressTime: 25,
    temperature: 93,
  },
];

export function builtInToRecipe(builtIn: BuiltInRecipe, lang: Lang): Recipe {
  const copy = dict[lang].recipes[builtIn.id] ?? {
    name: builtIn.id,
    tagline: "",
  };
  return {
    id: builtIn.id,
    name: copy.name,
    description: copy.tagline,
    isCustom: false,
    coffee: builtIn.coffee,
    water: builtIn.water,
    bloomWater: builtIn.bloomWater,
    bloomTime: builtIn.bloomTime,
    steepTime: builtIn.steepTime,
    pressTime: builtIn.pressTime,
    temperature: builtIn.temperature,
  };
}
