import React, { useEffect, useRef, useState } from "react";
import type { Dict } from "../i18n";
import type { Recipe } from "../types";
import { brewSeconds, formatClock, formatRatio } from "../lib/format";
import { AeroPressAnim } from "./AeroPressAnim";
import { Icon } from "./Icon";

interface RecipeMenuProps {
  recipes: Recipe[];
  selectedId: string;
  t: Dict;
  onSelect: (id: string) => void;
  onBegin: () => void;
  onCreate: () => void;
  onEdit: (recipe: Recipe) => void;
  onDelete: (id: string) => void;
}

function metaLine(recipe: Recipe): string {
  return `${recipe.coffee}g · ${recipe.water}ml · ${formatRatio(recipe)}`;
}

const CustomRow: React.FC<{
  recipe: Recipe;
  index: number;
  selected: boolean;
  t: Dict;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
  revealIndex: number;
}> = ({ recipe, index, selected, t, onSelect, onEdit, onDelete, revealIndex }) => {
  const [confirming, setConfirming] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
    },
    []
  );

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirming) {
      onDelete();
      return;
    }
    setConfirming(true);
    timeoutRef.current = window.setTimeout(() => setConfirming(false), 2600);
  };

  return (
    <div
      className={`menu-row custom reveal ${selected ? "selected" : ""}`}
      style={{ "--i": revealIndex } as React.CSSProperties}
      role="button"
      tabIndex={0}
      aria-pressed={selected}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
    >
      <span className="menu-idx">{String(index).padStart(2, "0")}</span>
      <span className="menu-main">
        <span className="menu-name">{recipe.name}</span>
        <span className="menu-tag">{recipe.description || "—"}</span>
        <span className="menu-stats">{metaLine(recipe)}</span>
      </span>
      <span className="menu-right">
        <span className="menu-time">{formatClock(brewSeconds(recipe))}</span>
        <span className="menu-actions">
          <button
            type="button"
            className="row-icon-btn"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            aria-label={`${t.edit} ${recipe.name}`}
            title={t.edit}
          >
            <Icon name="pencil" size={15} />
          </button>
          <button
            type="button"
            className={`row-icon-btn danger ${confirming ? "confirming" : ""}`}
            onClick={handleDelete}
            aria-label={`${t.delete} ${recipe.name}`}
            title={confirming ? t.confirmDelete : t.delete}
          >
            {confirming ? <span className="confirm-text">?</span> : <Icon name="trash" size={15} />}
          </button>
        </span>
      </span>
    </div>
  );
};

export const RecipeMenu: React.FC<RecipeMenuProps> = ({
  recipes,
  selectedId,
  t,
  onSelect,
  onBegin,
  onCreate,
  onEdit,
  onDelete,
}) => {
  const builtIns = recipes.filter((r) => !r.isCustom);
  const customs = recipes.filter((r) => r.isCustom);
  const selected = recipes.find((r) => r.id === selectedId);

  return (
    <div className="menu">
      <section className="menu-hero">
        <div className="hero-copy">
          <p className="eyebrow reveal">{t.tagline}</p>
          <h1 className="hero-title reveal" style={{ "--i": 1 } as React.CSSProperties}>
            {t.heroTitle}
          </h1>
          <p className="hero-sub reveal" style={{ "--i": 2 } as React.CSSProperties}>
            {t.heroSub}
          </p>
        </div>
        <AeroPressAnim
          className="hero-anim reveal"
        />
      </section>

      <section className="menu-section reveal" style={{ "--i": 3 } as React.CSSProperties}>
        <p className="section-label">{t.menuLabel}</p>
        <div className="menu-list">
          {builtIns.map((recipe, i) => {
            const isSelected = recipe.id === selectedId;
            return (
              <button
                key={recipe.id}
                type="button"
                className={`menu-row reveal ${isSelected ? "selected" : ""}`}
                style={{ "--i": i + 4 } as React.CSSProperties}
                onClick={() => onSelect(recipe.id)}
                aria-pressed={isSelected}
              >
                <span className="menu-idx">{String(i + 1).padStart(2, "0")}</span>
                <span className="menu-main">
                  <span className="menu-name">{recipe.name}</span>
                  <span className="menu-tag">{recipe.description}</span>
                  <span className="menu-stats">{metaLine(recipe)}</span>
                </span>
                <span className="menu-right">
                  <span className="menu-time">
                    {formatClock(brewSeconds(recipe))}
                  </span>
                  <span className="menu-check" aria-hidden="true">
                    <Icon name="check" size={16} />
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section
        className="menu-section reveal"
        style={{ "--i": builtIns.length + 5 } as React.CSSProperties}
      >
        <p className="section-label">{t.yourRecipes}</p>
        <div className="menu-list">
          {customs.map((recipe, i) => (
            <CustomRow
              key={recipe.id}
              recipe={recipe}
              index={builtIns.length + i + 1}
              revealIndex={builtIns.length + 6 + i}
              selected={recipe.id === selectedId}
              t={t}
              onSelect={() => onSelect(recipe.id)}
              onEdit={() => onEdit(recipe)}
              onDelete={() => onDelete(recipe.id)}
            />
          ))}
          <button
            type="button"
            className="menu-row ghost reveal"
            style={{ "--i": builtIns.length + customs.length + 7 } as React.CSSProperties}
            onClick={onCreate}
          >
            <span className="menu-idx">
              <Icon name="plus" size={14} />
            </span>
            <span className="menu-main">
              <span className="menu-name">{t.newRecipe}</span>
            </span>
          </button>
        </div>
      </section>

      <footer
        className="menu-cta reveal"
        style={{ "--i": builtIns.length + customs.length + 9 } as React.CSSProperties}
      >
        <button type="button" className="begin-btn" onClick={onBegin}>
          <span className="begin-label">
            {t.begin}
            {selected ? ` — ${selected.name}` : ""}
          </span>
          <Icon name="arrowRight" size={18} />
        </button>
      </footer>
    </div>
  );
};
