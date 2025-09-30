import type { Recipe, Step, BuiltInRecipeParams, Language } from "../types";

export class RecipeStorage {
  private static readonly STORAGE_KEY = "aeropal_custom_recipes";

  static saveRecipes(recipes: Recipe[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(recipes));
    } catch (error) {
      console.error("Failed to save recipes:", error);
    }
  }

  static loadRecipes(): Recipe[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Failed to load recipes:", error);
      return [];
    }
  }

  static saveRecipe(recipe: Recipe): void {
    const recipes = this.loadRecipes();
    const existingIndex = recipes.findIndex((r) => r.id === recipe.id);

    if (existingIndex >= 0) {
      recipes[existingIndex] = recipe;
    } else {
      recipes.push(recipe);
    }

    this.saveRecipes(recipes);
  }

  static deleteRecipe(recipeId: string): void {
    const recipes = this.loadRecipes();
    const filtered = recipes.filter((r) => r.id !== recipeId);
    this.saveRecipes(filtered);
  }

  static generateId(): string {
    return `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export class StepGenerator {
  static generateDefaultSteps(recipe: Recipe, language: Language): Step[] {
    if (recipe.customSteps) {
      return recipe.customSteps;
    }

    const bloomWater = recipe.bloomWater || 50;
    const remainingWater = recipe.water - bloomWater;
    const steepTime = recipe.steepTime || 90;
    const pressTime = recipe.pressTime || 30;
    const temperature = recipe.temperature || 93;

    const steps: Step[] = [];

    if (language === "en") {
      steps.push(
        {
          id: "heat-water",
          type: "instruction",
          text: `Heat water to ${temperature}°C and rinse your AeroPress filter`,
          button: "Water Ready",
          tip: "Optimal brewing temperature for best extraction",
        },
        {
          id: "add-coffee",
          type: "instruction",
          text: `Add ${recipe.coffee}g of medium-fine ground coffee to the AeroPress`,
          button: "Coffee Added",
          tip: "Grind should feel like coarse sea salt",
        },
        {
          id: "position-aeropress",
          type: "instruction",
          text: "Place AeroPress on your mug in the inverted position",
          button: "Ready to Bloom",
          tip: "Inverted method prevents early dripping",
        },
        {
          id: "bloom",
          type: "timer",
          text: `Pour ${bloomWater}ml hot water, stir gently 3 times`,
          duration: recipe.bloomTime || 30,
          tip: "Bloom releases CO₂ for better extraction",
        },
        {
          id: "add-water",
          type: "instruction",
          text: `Add remaining ${remainingWater}ml of water`,
          button: "Water Added",
          tip: "Pour in slow, circular motions",
        },
        {
          id: "flip",
          type: "instruction",
          text: "Attach filter cap and flip onto your mug",
          button: "Flipped & Ready",
          tip: "Work quickly to minimize dripping",
        },
        {
          id: "steep",
          type: "timer",
          text: "Let the coffee steep and develop full flavor",
          duration: steepTime,
          tip: "Patience creates perfect extraction",
        },
        {
          id: "press",
          type: "timer",
          text: "Press down slowly with steady, even pressure",
          duration: pressTime,
          tip: `Press should take ${pressTime} seconds`,
        },
        {
          id: "completion",
          type: "completion",
          text: "Perfect brew complete!",
          subtitle: "Enjoy your expertly crafted AeroPress coffee",
          button: "New Brew",
          icon: "☕",
        }
      );
    } else {
      steps.push(
        {
          id: "heat-water",
          type: "instruction",
          text: `Calienta agua a ${temperature}°C y enjuaga el filtro AeroPress`,
          button: "Agua Lista",
          tip: "Temperatura óptima para mejor extracción",
        },
        {
          id: "add-coffee",
          type: "instruction",
          text: `Añade ${recipe.coffee}g de café molido medio-fino al AeroPress`,
          button: "Café Añadido",
          tip: "El molido debe sentirse como sal marina gruesa",
        },
        {
          id: "position-aeropress",
          type: "instruction",
          text: "Coloca AeroPress en tu taza en posición invertida",
          button: "Listo para Floración",
          tip: "Método invertido previene goteo temprano",
        },
        {
          id: "bloom",
          type: "timer",
          text: `Vierte ${bloomWater}ml de agua caliente, revuelve 3 veces suavemente`,
          duration: recipe.bloomTime || 30,
          tip: "La floración libera CO₂ para mejor extracción",
        },
        {
          id: "add-water",
          type: "instruction",
          text: `Añade los ${remainingWater}ml restantes de agua`,
          button: "Agua Añadida",
          tip: "Vierte en movimientos circulares lentos",
        },
        {
          id: "flip",
          type: "instruction",
          text: "Conecta la tapa del filtro y voltea sobre tu taza",
          button: "Volteado y Listo",
          tip: "Trabaja rápido para minimizar goteo",
        },
        {
          id: "steep",
          type: "timer",
          text: "Deja que el café repose y desarrolle sabor completo",
          duration: steepTime,
          tip: "La paciencia crea extracción perfecta",
        },
        {
          id: "press",
          type: "timer",
          text: "Presiona lenta y uniformemente",
          duration: pressTime,
          tip: `La presión debe tomar ${pressTime} segundos`,
        },
        {
          id: "completion",
          type: "completion",
          text: "¡Preparación perfecta completa!",
          subtitle: "Disfruta tu café AeroPress expertamente preparado",
          button: "Nueva Preparación",
          icon: "☕",
        }
      );
    }

    return steps;
  }
}

export const BUILT_IN_RECIPES: Record<string, BuiltInRecipeParams> = {
  classic: {
    coffee: 14,
    bloom: 30,
    totalWater: 230,
    steepTime: 90,
    pressTime: 30,
  },
  strong: {
    coffee: 20,
    bloom: 30,
    totalWater: 250,
    steepTime: 120,
    pressTime: 30,
  },
  light: {
    coffee: 11,
    bloom: 45,
    totalWater: 250,
    steepTime: 45,
    pressTime: 20,
  },
  iced: {
    coffee: 22,
    bloom: 70,
    totalWater: 200,
    steepTime: 75,
    pressTime: 25,
  },
};

export function convertBuiltInToRecipe(
  key: string,
  params: BuiltInRecipeParams,
  language: Language
): Recipe {
  const translations = {
    en: {
      classic: {
        name: "Classic",
        description: "Balanced & smooth, 1:15 ratio",
      },
      strong: { name: "Strong", description: "Bold & rich, extended steep" },
      light: { name: "Light", description: "Bright & clean, quick brew" },
      iced: { name: "Iced", description: "Concentrated, over ice" },
    },
    es: {
      classic: {
        name: "Clásico",
        description: "Balanceado y suave, ratio 1:15",
      },
      strong: { name: "Fuerte", description: "Audaz y rico, reposo extendido" },
      light: {
        name: "Ligero",
        description: "Brillante y limpio, preparación rápida",
      },
      iced: { name: "Helado", description: "Concentrado, sobre hielo" },
    },
  };

  const translation =
    translations[language][key as keyof (typeof translations)[typeof language]];

  return {
    id: key,
    name: translation.name,
    description: translation.description,
    isCustom: false,
    coffee: params.coffee,
    water: params.totalWater,
    bloomWater: params.bloom,
    bloomTime: 30,
    steepTime: params.steepTime,
    pressTime: params.pressTime,
    temperature: 93,
  };
}
