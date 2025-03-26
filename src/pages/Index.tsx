
import React from 'react';
import GameContainer from '@/components/GameContainer';

const Index = () => {
  return (
    <div className="min-h-screen h-screen w-screen bg-gradient-to-b from-background to-secondary/50 flex flex-col items-center justify-center overflow-hidden">
      <div className="w-full h-full">
        <GameContainer />
      </div>
    </div>
  );
};

export default Index;
