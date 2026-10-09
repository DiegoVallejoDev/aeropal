import React from "react";

type GlyphKind = "pour" | "swirl" | "press";

const GLYPH_KIND: Record<string, GlyphKind> = {
  bloom: "pour",
  "add-water": "pour",
  steep: "swirl",
  press: "press",
};

export const StepGlyph: React.FC<{ stepId: string }> = ({ stepId }) => {
  const kind = GLYPH_KIND[stepId];
  if (!kind) return null;

  return (
    <div className={`step-glyph g-${kind}`} aria-hidden="true">
      {kind === "pour" && (
        <svg viewBox="0 0 44 44" fill="none">
          <path
            d="M15 7h14l-3.4 7h-7.2L15 7Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <circle className="d1" cx="22" cy="19" r="1.7" fill="currentColor" />
          <circle className="d2" cx="22" cy="19" r="1.4" fill="currentColor" />
          <path
            className="pool"
            d="M14 35q4-3 8 0t8 0"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      )}
      {kind === "swirl" && (
        <svg viewBox="0 0 44 44" fill="none">
          <g className="swirl-arc">
            <path
              d="M22 11a11 11 0 1 1-11 11"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </g>
          <circle cx="22" cy="22" r="2.2" fill="currentColor" />
          <circle className="swirl-dot" cx="22" cy="14" r="1.3" fill="currentColor" />
        </svg>
      )}
      {kind === "press" && (
        <svg viewBox="0 0 44 44" fill="none">
          <path
            d="M16 14v18a6 6 0 0 0 12 0V14"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <g className="plunger">
            <path
              d="M15 9h14M22 9v9"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
            <path
              d="M17.5 18h9"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </g>
          <path
            className="coffee-line"
            d="M17.5 29.5h9"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      )}
    </div>
  );
};
