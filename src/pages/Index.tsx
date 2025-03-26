
import React from 'react';
import GameContainer from '@/components/GameContainer';
import { useIsMobile } from '@/hooks/use-mobile';

const Index = () => {
  const isMobile = useIsMobile();

  return (
    <div className={`${isMobile ? 'fixed inset-0 w-full h-full overflow-hidden' : 'min-h-screen h-screen'} bg-gradient-to-b from-background to-secondary/50 flex flex-col items-center justify-center p-0`}>
      <GameContainer />
    </div>
  );
};

export default Index;
