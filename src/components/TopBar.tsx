import React from "react";
import type { Dict } from "../i18n";
import type { Lang } from "../types";
import { Icon } from "./Icon";

interface TopBarProps {
  lang: Lang;
  soundEnabled: boolean;
  t: Dict;
  onToggleLanguage: () => void;
  onToggleSound: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  lang,
  soundEnabled,
  t,
  onToggleLanguage,
  onToggleSound,
}) => (
  <header className="topbar">
    <div className="wordmark">
      Aero<span>Pal</span>
    </div>

    <div className="topbar-controls">
      <div
        className="lang-switch"
        role="group"
        aria-label="Language"
      >
        {(["en", "es"] as Lang[]).map((code) => (
          <button
            key={code}
            type="button"
            className={`lang-option ${lang === code ? "active" : ""}`}
            onClick={onToggleLanguage}
            disabled={lang === code}
            aria-pressed={lang === code}
          >
            {code.toUpperCase()}
          </button>
        ))}
      </div>

      <button
        type="button"
        className="icon-btn"
        onClick={onToggleSound}
        aria-label={soundEnabled ? t.soundOn : t.soundOff}
        aria-pressed={soundEnabled}
        title={soundEnabled ? t.soundOn : t.soundOff}
      >
        <Icon name={soundEnabled ? "sound" : "soundOff"} size={19} />
      </button>
    </div>
  </header>
);
