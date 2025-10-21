import React from 'react';

interface SoundToggleProps {
    soundEnabled: boolean;
    onToggle: () => void;
    title: string;
}

export const SoundToggle: React.FC<SoundToggleProps> = ({
    soundEnabled,
    onToggle,
    title
}) => {
    return (
        <button
            className="control-btn"
            onClick={onToggle}
            title={title}
            aria-label={soundEnabled ? 'Sound enabled. Click to disable' : 'Sound disabled. Click to enable'}
            aria-pressed={soundEnabled}
        >
            {soundEnabled ? (
                <i className="fa-solid fa-volume-high" aria-hidden="true"></i>
            ) : (
                <i className="fa-solid fa-volume-off" aria-hidden="true"></i>
            )}
        </button>
    );
};