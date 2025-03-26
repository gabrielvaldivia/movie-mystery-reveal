
import React from 'react';
import GameContainer from '@/components/GameContainer';
import { useIsMobile } from '@/hooks/use-mobile';

const Index = () => {
  const isMobile = useIsMobile();

  return (
    <div className={`min-h-screen ${isMobile ? 'h-screen w-screen overflow-hidden fixed inset-0' : 'h-screen'} bg-gradient-to-b from-background to-secondary/50 flex flex-col items-center justify-center overflow-hidden p-0`}>
      <GameContainer />
    </div>
  );
};

export default Index;
