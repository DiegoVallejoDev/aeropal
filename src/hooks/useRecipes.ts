import { useState, useCallback, useEffect } from "react";
import type { Recipe, Language } from "../types";
import {
  RecipeStorage,
  BUILT_IN_RECIPES,
  convertBuiltInToRecipe,
} from "../utils/recipeManager";

export function useRecipes(language: Language) {
  const [customRecipes, setCustomRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load custom recipes on mount and language change
  useEffect(() => {
    setIsLoading(true);
    const recipes = RecipeStorage.loadRecipes();
    setCustomRecipes(recipes);
    setIsLoading(false);
  }, []);

  // Get all recipes (built-in + custom)
  const getAllRecipes = useCallback((): Recipe[] => {
    const builtInRecipes = Object.entries(BUILT_IN_RECIPES).map(
      ([key, params]) => convertBuiltInToRecipe(key, params, language)
    );

    return [...builtInRecipes, ...customRecipes];
  }, [customRecipes, language]);

  // Get recipe by ID
  const getRecipeById = useCallback(
    (id: string): Recipe | undefined => {
      return getAllRecipes().find((recipe) => recipe.id === id);
    },
    [getAllRecipes]
  );

  // Save a custom recipe
  const saveRecipe = useCallback((recipe: Recipe) => {
    const updatedRecipe = {
      ...recipe,
      isCustom: true,
      createdAt: recipe.createdAt || new Date().toISOString(),
    };

    RecipeStorage.saveRecipe(updatedRecipe);

    // Update local state
    setCustomRecipes((prev) => {
      const existingIndex = prev.findIndex((r) => r.id === recipe.id);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = updatedRecipe;
        return updated;
      } else {
        return [...prev, updatedRecipe];
      }
    });

    return updatedRecipe;
  }, []);

  // Delete a custom recipe
  const deleteRecipe = useCallback((recipeId: string) => {
    RecipeStorage.deleteRecipe(recipeId);
    setCustomRecipes((prev) => prev.filter((r) => r.id !== recipeId));
  }, []);

  // Create a new recipe template
  const createNewRecipe = useCallback((): Recipe => {
    return {
      id: RecipeStorage.generateId(),
      name: "",
      description: "",
      isCustom: true,
      author: "User",
      createdAt: new Date().toISOString(),
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
    customRecipes,
    allRecipes: getAllRecipes(),
    getRecipeById,
    saveRecipe,
    deleteRecipe,
    createNewRecipe,
    isLoading,
  };
}
