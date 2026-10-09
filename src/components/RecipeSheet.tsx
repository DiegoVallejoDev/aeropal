import React, { useState } from "react";
import type { Dict } from "../i18n";
import type {
  AutomaticStep,
  CompletionStep,
  InstructionStep,
  Recipe,
  Step,
  StepType,
  TimerStep,
} from "../types";
import { Icon } from "./Icon";

interface RecipeSheetProps {
  recipe: Recipe;
  isNew: boolean;
  t: Dict;
  onSave: (recipe: Recipe) => void;
  onCancel: () => void;
}

const STEP_TYPE_LABEL: Record<StepType, keyof Dict["editor"]> = {
  instruction: "addInstruction",
  timer: "addTimer",
  automatic: "addAutomatic",
  completion: "addCompletion",
};

export const RecipeSheet: React.FC<RecipeSheetProps> = ({
  recipe,
  isNew,
  t,
  onSave,
  onCancel,
}) => {
  const e = t.editor;
  const [draft, setDraft] = useState<Recipe>({ ...recipe });
  const [nameError, setNameError] = useState(false);

  const update = (patch: Partial<Recipe>) =>
    setDraft((prev) => ({ ...prev, ...patch }));

  const updateStep = (index: number, patch: Partial<Step>) => {
    const steps = [...(draft.customSteps ?? [])];
    steps[index] = { ...steps[index], ...patch } as Step;
    update({ customSteps: steps });
  };

  const addStep = (type: StepType) => {
    const id = `step_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const base = { id, text: "", tip: "" };
    const step: Step =
      type === "instruction"
        ? ({ ...base, type, button: "Continue" } as InstructionStep)
        : type === "timer"
          ? ({ ...base, type, duration: 30, autoAdvance: true } as TimerStep)
          : type === "automatic"
            ? ({ ...base, type, delay: 2000 } as AutomaticStep)
            : ({
                ...base,
                type,
                text: "Enjoy.",
                subtitle: "",
                button: t.newBrew,
                icon: "",
              } as CompletionStep);

    update({ customSteps: [...(draft.customSteps ?? []), step] });
  };

  const moveStep = (from: number, to: number) => {
    const steps = [...(draft.customSteps ?? [])];
    const [moved] = steps.splice(from, 1);
    steps.splice(to, 0, moved);
    update({ customSteps: steps });
  };

  const removeStep = (index: number) => {
    const steps = [...(draft.customSteps ?? [])];
    steps.splice(index, 1);
    update({ customSteps: steps });
  };

  const handleSave = () => {
    if (!draft.name.trim()) {
      setNameError(true);
      return;
    }
    onSave(draft);
  };

  const steps = draft.customSteps ?? [];

  return (
    <div className="sheet-overlay" onClick={onCancel} role="presentation">
      <div
        className="sheet"
        role="dialog"
        aria-modal="true"
        aria-label={isNew ? e.createTitle : e.editTitle}
        onClick={(ev) => ev.stopPropagation()}
      >
        <header className="sheet-head">
          <h2 className="sheet-title">
            {isNew ? e.createTitle : e.editTitle}
          </h2>
          <button
            type="button"
            className="icon-btn"
            onClick={onCancel}
            aria-label={e.cancel}
          >
            <Icon name="close" size={18} />
          </button>
        </header>

        <div className="sheet-body">
          <div className="field">
            <label className="field-label" htmlFor="r-name">{e.name}</label>
            <input
              id="r-name"
              className={`field-input serif ${nameError && !draft.name.trim() ? "error" : ""}`}
              type="text"
              value={draft.name}
              placeholder={e.namePlaceholder}
              onChange={(ev) => {
                setNameError(false);
                update({ name: ev.target.value });
              }}
            />
            {nameError && !draft.name.trim() && (
              <p className="field-error">{e.nameRequired}</p>
            )}
          </div>

          <div className="field">
            <label className="field-label" htmlFor="r-desc">{e.description}</label>
            <input
              id="r-desc"
              className="field-input"
              type="text"
              value={draft.description}
              placeholder={e.descriptionPlaceholder}
              onChange={(ev) => update({ description: ev.target.value })}
            />
          </div>

          <div className="field-row">
            <div className="field">
              <label className="field-label" htmlFor="r-coffee">{e.coffee}</label>
              <input
                id="r-coffee"
                className="field-input num"
                type="number"
                inputMode="numeric"
                min={1}
                max={60}
                value={draft.coffee}
                onChange={(ev) => update({ coffee: Number(ev.target.value) })}
              />
            </div>
            <div className="field">
              <label className="field-label" htmlFor="r-water">{e.water}</label>
              <input
                id="r-water"
                className="field-input num"
                type="number"
                inputMode="numeric"
                min={50}
                max={600}
                value={draft.water}
                onChange={(ev) => update({ water: Number(ev.target.value) })}
              />
            </div>
            <div className="field">
              <label className="field-label" htmlFor="r-temp">{e.temperature}</label>
              <input
                id="r-temp"
                className="field-input num"
                type="number"
                inputMode="numeric"
                min={60}
                max={100}
                value={draft.temperature ?? 93}
                onChange={(ev) =>
                  update({ temperature: Number(ev.target.value) })
                }
              />
            </div>
          </div>

          <div className="sheet-steps">
            <p className="section-label">{e.steps}</p>
            <p className="steps-note">{e.defaultStepsNote}</p>

            <div className="add-steps">
              {(Object.keys(STEP_TYPE_LABEL) as StepType[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  className="chip-btn"
                  onClick={() => addStep(type)}
                >
                  <Icon name="plus" size={13} />
                  <span>{e[STEP_TYPE_LABEL[type]]}</span>
                </button>
              ))}
            </div>

            {steps.length === 0 && (
              <p className="steps-empty">{e.stepsEmpty}</p>
            )}

            <ol className="step-list">
              {steps.map((step, index) => (
                <li key={step.id} className="step-card">
                  <header className="step-card-head">
                    <span className="step-num">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="step-kind">{e[STEP_TYPE_LABEL[step.type]]}</span>
                    <span className="step-tools">
                      <button
                        type="button"
                        className="row-icon-btn"
                        disabled={index === 0}
                        onClick={() => moveStep(index, index - 1)}
                        aria-label={e.moveUp}
                      >
                        <Icon name="chevronUp" size={14} />
                      </button>
                      <button
                        type="button"
                        className="row-icon-btn"
                        disabled={index === steps.length - 1}
                        onClick={() => moveStep(index, index + 1)}
                        aria-label={e.moveDown}
                      >
                        <Icon name="chevronDown" size={14} />
                      </button>
                      <button
                        type="button"
                        className="row-icon-btn danger"
                        onClick={() => removeStep(index)}
                        aria-label={e.removeStep}
                      >
                        <Icon name="trash" size={14} />
                      </button>
                    </span>
                  </header>

                  <div className="field">
                    <label className="field-label">{e.stepText}</label>
                    <input
                      className="field-input"
                      type="text"
                      value={step.text}
                      onChange={(ev) =>
                        updateStep(index, { text: ev.target.value })
                      }
                    />
                  </div>

                  <div className="field">
                    <label className="field-label">{e.stepTip}</label>
                    <input
                      className="field-input"
                      type="text"
                      value={step.tip ?? ""}
                      placeholder={e.stepTipPlaceholder}
                      onChange={(ev) =>
                        updateStep(index, { tip: ev.target.value })
                      }
                    />
                  </div>

                  {step.type === "instruction" && (
                    <div className="field">
                      <label className="field-label">{e.buttonText}</label>
                      <input
                        className="field-input"
                        type="text"
                        value={(step as InstructionStep).button}
                        onChange={(ev) =>
                          updateStep(index, { button: ev.target.value })
                        }
                      />
                    </div>
                  )}

                  {step.type === "timer" && (
                    <>
                      <div className="field">
                        <label className="field-label">{e.duration}</label>
                        <input
                          className="field-input num"
                          type="number"
                          inputMode="numeric"
                          min={1}
                          max={900}
                          value={(step as TimerStep).duration}
                          onChange={(ev) =>
                            updateStep(index, {
                              duration: Number(ev.target.value),
                            })
                          }
                        />
                      </div>
                      <label className="check-field">
                        <input
                          type="checkbox"
                          checked={(step as TimerStep).autoAdvance !== false}
                          onChange={(ev) =>
                            updateStep(index, {
                              autoAdvance: ev.target.checked,
                            })
                          }
                        />
                        <span>{e.autoAdvance}</span>
                      </label>
                    </>
                  )}

                  {step.type === "automatic" && (
                    <div className="field">
                      <label className="field-label">{e.delay}</label>
                      <input
                        className="field-input num"
                        type="number"
                        inputMode="numeric"
                        min={300}
                        max={30000}
                        step={100}
                        value={(step as AutomaticStep).delay}
                        onChange={(ev) =>
                          updateStep(index, { delay: Number(ev.target.value) })
                        }
                      />
                    </div>
                  )}

                  {step.type === "completion" && (
                    <>
                      <div className="field">
                        <label className="field-label">{e.subtitle}</label>
                        <input
                          className="field-input"
                          type="text"
                          value={(step as CompletionStep).subtitle ?? ""}
                          onChange={(ev) =>
                            updateStep(index, { subtitle: ev.target.value })
                          }
                        />
                      </div>
                      <div className="field-row two">
                        <div className="field">
                          <label className="field-label">{e.buttonText}</label>
                          <input
                            className="field-input"
                            type="text"
                            value={(step as CompletionStep).button}
                            onChange={(ev) =>
                              updateStep(index, { button: ev.target.value })
                            }
                          />
                        </div>
                        <div className="field narrow">
                          <label className="field-label">{e.icon}</label>
                          <input
                            className="field-input"
                            type="text"
                            value={(step as CompletionStep).icon ?? ""}
                            placeholder={e.iconPlaceholder}
                            onChange={(ev) =>
                              updateStep(index, { icon: ev.target.value })
                            }
                          />
                        </div>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ol>
          </div>
        </div>

        <footer className="sheet-foot">
          <button type="button" className="ghost-btn" onClick={onCancel}>
            {e.cancel}
          </button>
          <button type="button" className="solid-btn" onClick={handleSave}>
            {e.save}
          </button>
        </footer>
      </div>
    </div>
  );
};
