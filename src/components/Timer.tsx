import React, { useEffect, useRef, useState } from "react";
import { Progress } from "./ui/progress";

interface TimerProps {
  duration: number;
  onTimeUp: () => void;
  isRunning: boolean;
  onTimeUpdate?: (timeMs: number) => void;
}

const Timer: React.FC<TimerProps> = ({
  duration,
  onTimeUp,
  isRunning,
  onTimeUpdate,
}) => {
  const [progress, setProgress] = useState(100);
  const startTimeRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number>();
  const lastUpdateTimeRef = useRef<number>(Date.now());
  const hasCalledTimeUpRef = useRef(false);
  const isRunningRef = useRef(isRunning);

  // Keep isRunningRef in sync with isRunning prop
  useEffect(() => {
    isRunningRef.current = isRunning;

    // Reset state when isRunning changes to true
    if (isRunning) {
      hasCalledTimeUpRef.current = false;
      setProgress(100);
      startTimeRef.current = Date.now();
      lastUpdateTimeRef.current = Date.now();
    } else {
      // Reset progress when timer stops
      setProgress(100);
      startTimeRef.current = null;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = undefined;
      }
    }
  }, [isRunning]);

  useEffect(() => {
    if (isRunning) {
      const animate = () => {
        const currentTime = Date.now();
        const elapsedTime = currentTime - (startTimeRef.current || currentTime);
        const remainingTime = Math.max(0, duration - elapsedTime);
        const newProgress = (remainingTime / duration) * 100;

        // Only update if enough time has passed (e.g., every 16ms for ~60fps)
        if (currentTime - lastUpdateTimeRef.current >= 16) {
          setProgress(newProgress);
          if (onTimeUpdate) {
            onTimeUpdate(remainingTime);
          }
          lastUpdateTimeRef.current = currentTime;
        }

        // Use isRunningRef.current to get the latest running state
        if (isRunningRef.current) {
          if (remainingTime > 0) {
            animationFrameRef.current = requestAnimationFrame(animate);
          } else if (!hasCalledTimeUpRef.current) {
            hasCalledTimeUpRef.current = true;
            onTimeUp();
          }
        }
      };

      animationFrameRef.current = requestAnimationFrame(animate);

      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }
  }, [isRunning, duration, onTimeUp, onTimeUpdate]);

  return (
    <div className="w-full">
      <Progress
        value={progress}
        className="h-1 w-full rounded-none bg-gray-700"
        indicatorClassName="bg-white"
      />
    </div>
  );
};

export default Timer;
