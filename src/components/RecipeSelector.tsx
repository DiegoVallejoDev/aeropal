import React from 'react';
import type { Recipe, Translation } from '../types';
import { getRecipeStats } from '../utils/recipeManager';

interface RecipeSelectorProps {
    recipes: Recipe[];
    selectedRecipe: string;
    onSelectRecipe: (recipeId: string) => void;
    onStartBrewing: () => void;
    onCreateRecipe: () => void;
    onDeleteRecipe: (recipeId: string) => void;
    translation: Translation;
}

const recipeIcons: Record<string, string> = {
    classic: '☕',
    strong: '💪',
    light: '✨',
    iced: '🧊',
};

interface RecipeStatsRowProps {
    recipe: Recipe;
    translation: Translation;
}

const RecipeStatsRow: React.FC<RecipeStatsRowProps> = ({ recipe, translation }) => {
    const stats = getRecipeStats(recipe);
    return (
        <div className="recipe-stats" aria-hidden="true">
            <span className="recipe-stat">
                <span className="recipe-stat-value">{stats.coffee}g</span>
                <span className="recipe-stat-label">coffee</span>
            </span>
            <span className="recipe-stat">
                <span className="recipe-stat-value">{stats.water}ml</span>
                <span className="recipe-stat-label">water</span>
            </span>
            <span className="recipe-stat">
                <span className="recipe-stat-value">{stats.ratio}</span>
                <span className="recipe-stat-label">{translation.ratio}</span>
            </span>
            <span className="recipe-stat">
                <span className="recipe-stat-value">{stats.brewTimeLabel}</span>
                <span className="recipe-stat-label">{translation.brewTime}</span>
            </span>
        </div>
    );
};

export const RecipeSelector: React.FC<RecipeSelectorProps> = ({
    recipes,
    selectedRecipe,
    onSelectRecipe,
    onStartBrewing,
    onCreateRecipe,
    onDeleteRecipe,
    translation,
}) => {
    const builtInRecipes = recipes.filter(r => !r.isCustom);
    const customRecipes = recipes.filter(r => r.isCustom);

    return (
        <div className="recipe-selection">
            <div className="recipe-title">{translation.recipeTitle}</div>

            {/* Built-in Recipes */}
            <div className="recipe-grid">
                {builtInRecipes.map((recipe) => {
                    const icon = recipeIcons[recipe.id] || '☕';

                    return (
                        <button
                            key={recipe.id}
                            className={`recipe-card interactive-element ripple focus-enhanced ${selectedRecipe === recipe.id ? "selected" : ""}`}
                            onClick={() => onSelectRecipe(recipe.id)}
                            aria-pressed={selectedRecipe === recipe.id}
                            aria-label={`${recipe.name}: ${recipe.description}`}
                        >
                            <div className="recipe-icon">{icon}</div>
                            <div className="recipe-name">{recipe.name}</div>
                            <div className="recipe-details">{recipe.description}</div>
                            <RecipeStatsRow recipe={recipe} translation={translation} />
                        </button>
                    );
                })}
            </div>

            {/* Custom Recipes Section */}
            {customRecipes.length > 0 && (
                <>
                    <div className="custom-recipes-section">
                        <div className="custom-recipes-title">{translation.customRecipes}</div>
                        <div className="recipe-grid">
                            {customRecipes.map((recipe) => (
                                <div
                                    key={recipe.id}
                                    className={`recipe-card custom interactive-element ripple focus-enhanced ${selectedRecipe === recipe.id ? "selected" : ""}`}
                                    onClick={() => onSelectRecipe(recipe.id)}
                                    role="button"
                                    tabIndex={0}
                                    aria-pressed={selectedRecipe === recipe.id}
                                    aria-label={`${recipe.name}: ${recipe.description}`}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            e.preventDefault();
                                            onSelectRecipe(recipe.id);
                                        }
                                    }}
                                >
                                    <div className="recipe-icon">🔧</div>
                                    <div className="recipe-name">{recipe.name}</div>
                                    {recipe.description && (
                                        <div className="recipe-details">{recipe.description}</div>
                                    )}
                                    <RecipeStatsRow recipe={recipe} translation={translation} />
                                    <button
                                        className="delete-recipe-btn"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onDeleteRecipe(recipe.id);
                                        }}
                                        title={translation.delete}
                                        aria-label={`Delete ${recipe.name}`}
                                    >
                                        🗑️
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}

            {/* Action Buttons */}
            <div className="recipe-actions">
                <button className="start-btn magnetic-btn interactive-element ripple focus-enhanced glow-effect" onClick={onStartBrewing}>
                    <span>{translation.startBrewing}</span>
                </button>
                <button className="create-recipe-btn interactive-element ripple focus-enhanced" onClick={onCreateRecipe}>
                    <span>{translation.createRecipe}</span>
                </button>
            </div>
        </div>
    );
};
