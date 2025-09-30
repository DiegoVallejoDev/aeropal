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
        >
            {soundEnabled ? (
                <i className="fa-solid fa-volume-high"></i>
            ) : (
                <i className="fa-solid fa-volume-off"></i>
            )}
        </button>
    );
};