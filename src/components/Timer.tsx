
import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface TimerProps {
  duration: number; // in milliseconds
  onTimeUp?: () => void;
  isRunning: boolean;
}

const Timer: React.FC<TimerProps> = ({ duration, onTimeUp, isRunning }) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  
  useEffect(() => {
    if (isRunning) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev - 1000;
          if (newTime <= 0) {
            clearInterval(timer);
            if (onTimeUp) onTimeUp();
            return 0;
          }
          return newTime;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [isRunning, onTimeUp]);
  
  useEffect(() => {
    setTimeLeft(duration);
  }, [duration]);
  
  // Format time as MM:SS
  const formatTime = (ms: number) => {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / 1000 / 60) % 60);
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  // Calculate percentage of time left
  const percentLeft = (timeLeft / duration) * 100;
  const isLowTime = percentLeft < 20;
  
  return (
    <div className="flex items-center gap-2">
      <div className="relative h-9 w-24 overflow-hidden rounded-full bg-secondary">
        <div 
          className={`absolute left-0 top-0 h-full transition-all duration-1000 ease-linear ${
            isLowTime ? 'bg-red-500' : 'bg-primary'
          }`}
          style={{ width: `${percentLeft}%` }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-sm font-medium ${isLowTime ? 'text-white' : 'text-primary'}`}>
            {formatTime(timeLeft)}
          </span>
        </div>
      </div>
      <Clock className="h-5 w-5 text-muted-foreground" />
    </div>
  );
};

export default Timer;
