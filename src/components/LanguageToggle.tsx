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
    const nextLanguage = currentLanguage === "en" ? "Spanish" : "English";
    
    return (
        <button 
            className="control-btn" 
            onClick={onToggle}
            aria-label={`Change language to ${nextLanguage}`}
            title={`Switch to ${nextLanguage}`}
        >
            {currentLanguage === "en" ? "ES" : "EN"}
        </button>
    );
};