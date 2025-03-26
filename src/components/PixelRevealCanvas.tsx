
import React, { forwardRef } from 'react';

interface PixelRevealCanvasProps {
  className?: string;
}

const PixelRevealCanvas = forwardRef<HTMLCanvasElement, PixelRevealCanvasProps>(
  ({ className = "w-full h-full object-cover" }, ref) => {
    return (
      <canvas 
        ref={ref}
        className={className}
      />
    );
  }
);

PixelRevealCanvas.displayName = "PixelRevealCanvas";

export default PixelRevealCanvas;
