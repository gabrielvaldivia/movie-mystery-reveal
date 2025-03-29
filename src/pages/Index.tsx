
import React from 'react';
import GameContainer from '@/components/GameContainer';
import { useIsMobile } from '@/hooks/use-mobile';

const Index = () => {
  const isMobile = useIsMobile();

  return (
    <div className="fixed inset-0 w-full h-full bg-black flex flex-col items-center justify-center p-0 m-0 overflow-hidden">
      <div className="w-full h-full max-w-4xl mx-auto relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#33ff00]/10 to-transparent pointer-events-none"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBmaWxsPSIjMDAwIiBkPSJNMCAwaDQwdjQwSDB6Ii8+PHBhdGggZD0iTTAgMGg0MHY0MEgwVjB6bTIgMmgzNnYzNkgyVjJ6IiBmaWxsPSIjMzNmZjAwIiBmaWxsLXJ1bGU9Im5vbnplcm8iIG9wYWNpdHk9Ii4wNSIvPjwvZz48L3N2Zz4=')] opacity-50 pointer-events-none"></div>
        <GameContainer />
      </div>
    </div>
  );
};

export default Index;
