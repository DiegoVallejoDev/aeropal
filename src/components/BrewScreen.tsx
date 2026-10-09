import React, { useEffect, useRef } from "react";
import type { Dict } from "../i18n";
import type { Countdown } from "../hooks/useCountdown";
import type { Recipe, Step } from "../types";
import { brewSeconds, formatClock, formatRatio } from "../lib/format";
import { Icon } from "./Icon";
import { TimerRing } from "./TimerRing";

interface BrewScreenProps {
  recipe: Recipe;
  steps: Step[];
  index: number;
  countdown: Countdown;
  t: Dict;
  elapsedLabel: string;
  sounds: { tick: () => void; chime: () => void };
  onNext: () => void;
  onPrev: () => void;
  onExit: () => void;
  onFinish: () => void;
}

export const BrewScreen: React.FC<BrewScreenProps> = ({
  recipe,
  steps,
  index,
  countdown,
  t,
  elapsedLabel,
  sounds,
  onNext,
  onPrev,
  onExit,
  onFinish,
}) => {
  const step = steps[index];
  const { running, remainingMs, start } = countdown;

  // auto-start each timed step exactly once per entry
  const startedForRef = useRef(-1);
  useEffect(() => {
    if (step?.type === "timer" && startedForRef.current !== index) {
      startedForRef.current = index;
      start(step.duration, () => {
        sounds.chime();
        if (step.autoAdvance !== false) onNext();
      });
    }
  }, [step, index, start, sounds, onNext]);

  // tick the final three seconds
  const secondsLeft = Math.ceil(remainingMs / 1000);
  const lastSecondRef = useRef(secondsLeft);
  useEffect(() => {
    if (
      running &&
      secondsLeft <= 3 &&
      secondsLeft > 0 &&
      secondsLeft !== lastSecondRef.current
    ) {
      sounds.tick();
    }
    lastSecondRef.current = secondsLeft;
  }, [secondsLeft, running, sounds]);

  // automatic steps advance on their own clock
  useEffect(() => {
    if (step?.type !== "automatic") return;
    const id = window.setTimeout(onNext, step.delay);
    return () => window.clearTimeout(id);
  }, [step, index, onNext]);

  if (!step) return null;

  return (
    <div className="brew">
      <header className="brew-top">
        <button
          type="button"
          className="brew-nav"
          onClick={onPrev}
          disabled={index === 0}
          aria-label={t.back}
        >
          <Icon name="chevronLeft" size={18} />
          <span>{t.back}</span>
        </button>
        <span className="brew-counter">
          {t.stepOf(Math.min(index + 1, steps.length), steps.length)}
        </span>
        <button
          type="button"
          className="brew-nav"
          onClick={onExit}
          aria-label={t.exit}
        >
          <span>{t.exit}</span>
          <Icon name="close" size={16} />
        </button>
      </header>

      <main className="brew-main" key={step.id + index}>
        {step.type !== "completion" && (
          <>
            <p className="brew-text">{step.text}</p>
            {step.tip && <p className="brew-tip">{step.tip}</p>}
          </>
        )}

        {step.type === "timer" && (
          <div className="brew-timer">
            <TimerRing
              remainingMs={remainingMs}
              durationMs={countdown.durationMs}
              paused={countdown.paused}
              pausedLabel={t.pausedLabel}
            />
            <div className="timer-actions">
              <button
                type="button"
                className="ghost-btn"
                onClick={countdown.paused ? countdown.resume : countdown.pause}
              >
                <Icon name={countdown.paused ? "play" : "pause"} size={15} />
                <span>{countdown.paused ? t.resume : t.pause}</span>
              </button>
              <span className="timer-sep" aria-hidden="true" />
              <button type="button" className="ghost-btn" onClick={onNext}>
                <Icon name="skip" size={15} />
                <span>{t.skip}</span>
              </button>
            </div>
          </div>
        )}

        {step.type === "instruction" && (
          <button type="button" className="go-btn" onClick={onNext}>
            <span>{step.button}</span>
            <Icon name="arrowRight" size={20} />
          </button>
        )}

        {step.type === "automatic" && (
          <div className="auto-step">
            <div className="auto-line">
              <div className="auto-line-fill" style={{ animationDuration: `${step.delay}ms` }} />
            </div>
            <p className="auto-label">{t.autoAdvancing}…</p>
          </div>
        )}

        {step.type === "completion" && (
          <div className="done">
            {step.icon && <p className="done-icon">{step.icon}</p>}
            <p className="done-title">{step.text}</p>
            <p className="done-sub">{step.subtitle ?? t.doneSub}</p>
            <p className="done-stats">
              {recipe.coffee}g · {recipe.water}ml · {formatRatio(recipe)} ·{" "}
              {formatClock(brewSeconds(recipe))} — {t.brewedIn} {elapsedLabel}
            </p>
            <button type="button" className="go-btn" onClick={onFinish}>
              <span>{step.button || t.newBrew}</span>
              <Icon name="arrowRight" size={20} />
            </button>
          </div>
        )}
      </main>

      <footer className="brew-foot">
        <div
          className="brew-ticks"
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={steps.length}
          aria-valuenow={index + 1}
        >
          {steps.map((s, i) => (
            <i
              key={s.id + i}
              className={`tick ${i < index ? "past" : ""} ${i === index ? "now" : ""}`}
            />
          ))}
        </div>
        <p className="brew-meta">
          {recipe.name} · {recipe.coffee}g / {recipe.water}ml
        </p>
      </footer>
    </div>
  );
};
