import React from 'react';
import type { Language } from '../types';

interface LanguageToggleProps {
    currentLanguage: Language;
    onToggle: () => void;
}

export const LanguageToggle: React.FC<LanguageToggleProps> = ({
    currentLanguage,
    onToggle
}) => {
    return (
        <button className="control-btn" onClick={onToggle}>
            {currentLanguage === "en" ? "ES" : "EN"}
        </button>
    );
};