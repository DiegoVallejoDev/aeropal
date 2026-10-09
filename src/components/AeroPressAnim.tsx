import React from "react";
import Lottie from "lottie-react";
import lightData from "../animation.json";
import darkData from "../animation-dark.json";

interface AeroPressAnimProps {
  dark?: boolean;
  className?: string;
}

export const AeroPressAnim: React.FC<AeroPressAnimProps> = ({
  dark = false,
  className,
}) => (
  <div className={className} aria-hidden="true">
    <Lottie
      animationData={dark ? darkData : lightData}
      loop
      autoplay
      style={{ width: "100%", height: "100%" }}
    />
  </div>
);
