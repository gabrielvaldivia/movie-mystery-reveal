
import React from 'react';
import { Button } from './ui/button';
import { FilmIcon } from 'lucide-react';
import GameSelection from './GameSelection';

interface StartScreenProps {
  onStartGame: () => void;
  onSelectGame: (gameType: 'movie' | 'flicktionary') => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStartGame, onSelectGame }) => {
  return (
    <GameSelection onSelectGame={onSelectGame} />
  );
};

export default StartScreen;
