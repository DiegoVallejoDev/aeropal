import React, { useCallback, useMemo, useRef, useState } from "react";
import type { Recipe } from "./types";
import { dict } from "./i18n";
import { buildSteps } from "./lib/steps";
import { formatClock } from "./lib/format";
import {
  useCountdown,
  useLanguage,
  useRecipes,
  useSound,
  useWakeLock,
} from "./hooks";
import { BrewScreen, RecipeMenu, RecipeSheet, TopBar } from "./components";

const App: React.FC = () => {
  const { lang, toggleLanguage } = useLanguage();
  const t = dict[lang];
  const { soundEnabled, toggleSound, tick, chime } = useSound();
  const { allRecipes, getRecipeById, saveRecipe, deleteRecipe, draftRecipe } =
    useRecipes(lang);
  const countdown = useCountdown();

  const [view, setView] = useState<"menu" | "brew">("menu");
  const [recipeId, setRecipeId] = useState("classic");
  const [stepIndex, setStepIndex] = useState(0);
  const [editing, setEditing] = useState<{ recipe: Recipe; isNew: boolean } | null>(
    null
  );
  const brewStartRef = useRef(0);

  useWakeLock(view === "brew");

  const recipe = getRecipeById(recipeId) ?? allRecipes[0];
  const steps = useMemo<ReturnType<typeof buildSteps>>(
    () => (recipe ? buildSteps(recipe, lang) : []),
    [recipe, lang]
  );

  const nextStep = useCallback(() => {
    countdown.stop();
    setStepIndex((i) => Math.min(i + 1, Math.max(steps.length - 1, 0)));
  }, [countdown, steps.length]);

  const prevStep = useCallback(() => {
    countdown.stop();
    setStepIndex((i) => Math.max(0, i - 1));
  }, [countdown]);

  const beginBrew = useCallback(() => {
    brewStartRef.current = Date.now();
    countdown.stop();
    setStepIndex(0);
    setView("brew");
  }, [countdown]);

  const exitBrew = useCallback(() => {
    if (stepIndex > 0 && !window.confirm(t.confirmExit)) return;
    countdown.stop();
    setStepIndex(0);
    setView("menu");
  }, [countdown, stepIndex, t.confirmExit]);

  const finishBrew = useCallback(() => {
    countdown.stop();
    setStepIndex(0);
    setView("menu");
  }, [countdown]);

  const elapsedLabel = formatClock(
    brewStartRef.current ? (Date.now() - brewStartRef.current) / 1000 : 0
  );

  const handleCreate = useCallback(() => {
    setEditing({ recipe: draftRecipe(), isNew: true });
  }, [draftRecipe]);

  const handleEdit = useCallback((r: Recipe) => {
    setEditing({ recipe: r, isNew: false });
  }, []);

  const handleSave = useCallback(
    (r: Recipe) => {
      const saved = saveRecipe(r);
      setEditing(null);
      setRecipeId(saved.id);
    },
    [saveRecipe]
  );

  const handleDelete = useCallback(
    (id: string) => {
      deleteRecipe(id);
      if (recipeId === id) setRecipeId("classic");
    },
    [deleteRecipe, recipeId]
  );

  const sounds = useMemo(() => ({ tick, chime }), [tick, chime]);

  return (
    <div className={`app ${view === "brew" ? "is-brewing" : ""}`}>
      {view === "menu" && (
        <TopBar
          lang={lang}
          soundEnabled={soundEnabled}
          t={t}
          onToggleLanguage={toggleLanguage}
          onToggleSound={toggleSound}
        />
      )}

      {view === "menu" ? (
        <RecipeMenu
          recipes={allRecipes}
          selectedId={recipe?.id ?? "classic"}
          t={t}
          onSelect={setRecipeId}
          onBegin={beginBrew}
          onCreate={handleCreate}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ) : (
        recipe && (
          <BrewScreen
            recipe={recipe}
            steps={steps}
            index={Math.min(stepIndex, steps.length - 1)}
            countdown={countdown}
            t={t}
            elapsedLabel={elapsedLabel}
            sounds={sounds}
            onNext={nextStep}
            onPrev={prevStep}
            onExit={exitBrew}
            onFinish={finishBrew}
          />
        )
      )}

      {editing && (
        <RecipeSheet
          recipe={editing.recipe}
          isNew={editing.isNew}
          t={t}
          onSave={handleSave}
          onCancel={() => setEditing(null)}
        />
      )}
    </div>
  );
};

export default App;
