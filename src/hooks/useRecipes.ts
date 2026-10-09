import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Lang, Recipe } from "../types";
import { BUILT_IN_RECIPES, builtInToRecipe } from "../data/recipes";
import {
  loadCustomRecipes,
  newRecipeId,
  persistCustomRecipes,
} from "../lib/storage";

export function useRecipes(lang: Lang) {
  const [customRecipes, setCustomRecipes] = useState<Recipe[]>(() =>
    loadCustomRecipes()
  );

  // persist every change after the initial load
  const hydrated = useRef(false);
  useEffect(() => {
    if (!hydrated.current) {
      hydrated.current = true;
      return;
    }
    persistCustomRecipes(customRecipes);
  }, [customRecipes]);

  const allRecipes = useMemo<Recipe[]>(() => {
    const builtIns = BUILT_IN_RECIPES.map((r) => builtInToRecipe(r, lang));
    return [...builtIns, ...customRecipes];
  }, [customRecipes, lang]);

  const getRecipeById = useCallback(
    (id: string) => allRecipes.find((r) => r.id === id),
    [allRecipes]
  );

  const saveRecipe = useCallback((recipe: Recipe): Recipe => {
    const stamped: Recipe = {
      ...recipe,
      isCustom: true,
      createdAt: recipe.createdAt ?? new Date().toISOString(),
    };
    setCustomRecipes((prev) => {
      const index = prev.findIndex((r) => r.id === stamped.id);
      return index >= 0
        ? prev.map((r, i) => (i === index ? stamped : r))
        : [...prev, stamped];
    });
    return stamped;
  }, []);

  const deleteRecipe = useCallback((recipeId: string) => {
    setCustomRecipes((prev) => prev.filter((r) => r.id !== recipeId));
  }, []);

  const draftRecipe = useCallback((): Recipe => {
    return {
      id: newRecipeId(),
      name: "",
      description: "",
      isCustom: true,
      coffee: 15,
      water: 250,
      bloomWater: 50,
      bloomTime: 30,
      steepTime: 90,
      pressTime: 30,
      temperature: 93,
    };
  }, []);

  return {
    allRecipes,
    getRecipeById,
    saveRecipe,
    deleteRecipe,
    draftRecipe,
  };
}
