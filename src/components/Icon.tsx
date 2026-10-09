import React from "react";

export type IconName =
  | "sound"
  | "soundOff"
  | "close"
  | "chevronLeft"
  | "chevronUp"
  | "chevronDown"
  | "play"
  | "pause"
  | "plus"
  | "pencil"
  | "trash"
  | "arrowRight"
  | "check"
  | "skip";

const PATHS: Record<IconName, React.ReactNode> = {
  sound: (
    <>
      <path d="M11 5 6.5 9H3v6h3.5L11 19V5z" />
      <path d="M14.5 9.2a4 4 0 0 1 0 5.6" />
      <path d="M17 6.8a7.4 7.4 0 0 1 0 10.4" />
    </>
  ),
  soundOff: (
    <>
      <path d="M11 5 6.5 9H3v6h3.5L11 19V5z" />
      <line x1="15" y1="9.5" x2="20" y2="14.5" />
      <line x1="20" y1="9.5" x2="15" y2="14.5" />
    </>
  ),
  close: (
    <>
      <line x1="6" y1="6" x2="18" y2="18" />
      <line x1="18" y1="6" x2="6" y2="18" />
    </>
  ),
  chevronLeft: <polyline points="14.5 5 7.5 12 14.5 19" />,
  chevronUp: <polyline points="5 14.5 12 7.5 19 14.5" />,
  chevronDown: <polyline points="5 9.5 12 16.5 19 9.5" />,
  play: <polygon points="8 5 19 12 8 19" />,
  pause: (
    <>
      <line x1="9" y1="5" x2="9" y2="19" />
      <line x1="15" y1="5" x2="15" y2="19" />
    </>
  ),
  plus: (
    <>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </>
  ),
  pencil: (
    <>
      <path d="M12 20h9" />
      <path d="M16.4 3.6a2.1 2.1 0 0 1 3 3L7.5 18.5 3.5 19.5l1-4L16.4 3.6z" />
    </>
  ),
  trash: (
    <>
      <path d="M3.5 6h17" />
      <path d="M8.5 6V4h7v2" />
      <path d="M18.5 6l-1 14h-11l-1-14" />
      <line x1="10" y1="10.5" x2="10" y2="16.5" />
      <line x1="14" y1="10.5" x2="14" y2="16.5" />
    </>
  ),
  arrowRight: (
    <>
      <line x1="4" y1="12" x2="20" y2="12" />
      <polyline points="13.5 5.5 20 12 13.5 18.5" />
    </>
  ),
  check: <polyline points="4.5 12.5 9.5 17.5 19.5 6.5" />,
  skip: (
    <>
      <polygon points="5 6 13 12 5 18" />
      <line x1="17" y1="5" x2="17" y2="19" />
    </>
  ),
};

interface IconProps {
  name: IconName;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export const Icon: React.FC<IconProps> = ({
  name,
  size = 20,
  strokeWidth = 1.6,
  className,
}) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {PATHS[name]}
  </svg>
);
