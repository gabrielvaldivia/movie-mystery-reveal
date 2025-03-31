import React from "react";

interface FloatingScoreProps {
  score: number;
  position: { x: number; y: number };
}

const FloatingScore: React.FC<FloatingScoreProps> = ({ score, position }) => {
  return (
    <div
      className="fixed pointer-events-none animate-float-up z-50"
      style={{
        left: position.x,
        top: position.y,
        transform: "translate(-50%, -50%)",
      }}
    >
      <span className="font-arcade text-4xl text-[#ECAF31] font-bold animate-fade-out drop-shadow-glow">
        +{score}
      </span>
    </div>
  );
};

export default FloatingScore;
