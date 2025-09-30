import React from 'react';
import type { Recipe, Translation } from '../types';

interface RecipeSelectorProps {
    recipes: Recipe[];
    selectedRecipe: string;
    onSelectRecipe: (recipeId: string) => void;
    onStartBrewing: () => void;
    onCreateRecipe: () => void;
    translation: Translation;
}

export const RecipeSelector: React.FC<RecipeSelectorProps> = ({
    recipes,
    selectedRecipe,
    onSelectRecipe,
    onStartBrewing,
    onCreateRecipe,
    translation,
}) => {
    const builtInRecipes = recipes.filter(r => !r.isCustom);
    const customRecipes = recipes.filter(r => r.isCustom);

    return (
        <div className="recipe-selection">
            <div className="recipe-title">{translation.recipeTitle}</div>

            {/* Built-in Recipes */}
            <div className="recipe-grid">
                {builtInRecipes.map((recipe) => (
                    <button
                        key={recipe.id}
                        className={`recipe-card interactive-element ripple focus-enhanced ${selectedRecipe === recipe.id ? "selected" : ""}`}
                        onClick={() => onSelectRecipe(recipe.id)}
                    >
                        <div className="recipe-name">{recipe.name}</div>
                        <div className="recipe-details">{recipe.description}</div>
                    </button>
                ))}
            </div>

            {/* Custom Recipes Section */}
            {customRecipes.length > 0 && (
                <>
                    <div className="custom-recipes-section">
                        <div className="custom-recipes-title">{translation.customRecipes}</div>
                        <div className="recipe-grid">
                            {customRecipes.map((recipe) => (
                                <button
                                    key={recipe.id}
                                    className={`recipe-card custom interactive-element ripple focus-enhanced ${selectedRecipe === recipe.id ? "selected" : ""}`}
                                    onClick={() => onSelectRecipe(recipe.id)}
                                >
                                    <div className="recipe-name">{recipe.name}</div>
                                    <div className="recipe-details">{recipe.description}</div>
                                    <div className="recipe-params">
                                        {recipe.coffee}g coffee • {recipe.water}ml water
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </>
            )}

            {/* Action Buttons */}
            <div className="recipe-actions">
                <button className="create-recipe-btn interactive-element ripple focus-enhanced" onClick={onCreateRecipe}>
                    {translation.createRecipe}
                </button>
                <button className="start-btn magnetic-btn interactive-element ripple focus-enhanced glow-effect" onClick={onStartBrewing}>
                    <span>{translation.startBrewing}</span>
                </button>
            </div>
        </div>
    );
};