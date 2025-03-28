
import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { X, SkipForward } from 'lucide-react';
import WordGuessInput from './WordGuessInput';
import FlicktionarySuccessDialog from './FlicktionarySuccessDialog';

const GAME_DURATION = 30000; // 30 seconds

interface FlicktionaryGameProps {
  onClose: () => void;
}

const FlicktionaryGame: React.FC<FlicktionaryGameProps> = ({ onClose }) => {
  const [timeRemaining, setTimeRemaining] = useState(GAME_DURATION);
  const [isGameActive, setIsGameActive] = useState(true);
  const [currentWord, setCurrentWord] = useState<{ word: string; definition: string } | null>(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [hasIncorrectGuess, setHasIncorrectGuess] = useState(false);
  const [timeExpired, setTimeExpired] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Dictionary of words and definitions
  const wordDictionary = [
    { word: "ephemeral", definition: "Lasting for a very short time" },
    { word: "serendipity", definition: "The occurrence of events by chance in a happy or beneficial way" },
    { word: "eloquent", definition: "Fluent or persuasive in speaking or writing" },
    { word: "ubiquitous", definition: "Present, appearing, or found everywhere" },
    { word: "mellifluous", definition: "Sweet or musical; pleasant to hear" },
    { word: "quintessential", definition: "Representing the most perfect example of a quality or class" },
    { word: "pernicious", definition: "Having a harmful effect, especially in a gradual or subtle way" },
    { word: "euphoria", definition: "A feeling or state of intense excitement and happiness" },
    { word: "dilettante", definition: "A person who cultivates an area of interest without real commitment" },
    { word: "esoteric", definition: "Intended for or likely to be understood by only a small number of people" },
  ];

  // Timer effect
  useEffect(() => {
    if (!isGameActive || !currentWord) return;
    
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        const newTime = Math.max(0, prev - 100);
        if (newTime <= 0) {
          clearInterval(timer);
          handleTimeUp();
          return 0;
        }
        return newTime;
      });
    }, 100);
    
    return () => clearInterval(timer);
  }, [isGameActive, currentWord]);
  
  // Initialize game
  useEffect(() => {
    startNewRound();
  }, []);
  
  const startNewRound = () => {
    setIsLoading(true);
    setTimeRemaining(GAME_DURATION);
    setIsGameActive(true);
    setIsCorrect(false);
    setShowSuccessDialog(false);
    setHasIncorrectGuess(false);
    setTimeExpired(false);
    
    // Select a random word
    const randomIndex = Math.floor(Math.random() * wordDictionary.length);
    setCurrentWord(wordDictionary[randomIndex]);
    
    setIsLoading(false);
  };
  
  const handleGuess = (guess: string) => {
    if (!currentWord || !isGameActive) return;
    
    const normalizedGuess = guess.toLowerCase().trim();
    const normalizedWord = currentWord.word.toLowerCase().trim();
    
    if (normalizedGuess === normalizedWord) {
      setIsGameActive(false);
      setIsCorrect(true);
      setShowSuccessDialog(true);
    } else {
      setHasIncorrectGuess(true);
      setTimeout(() => {
        setHasIncorrectGuess(false);
      }, 1000);
    }
  };
  
  const handleTimeUp = () => {
    if (isGameActive) {
      setIsGameActive(false);
      setTimeExpired(true);
      setShowSuccessDialog(true);
    }
  };
  
  const handleSkip = () => {
    if (isGameActive) {
      setIsGameActive(false);
      startNewRound();
    }
  };
  
  const handleNextRound = () => {
    startNewRound();
  };
  
  // Calculate progress (left to right)
  const progress = 100 - Math.max(0, (timeRemaining / GAME_DURATION) * 100);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      {/* Timer and header */}
      <div className="absolute top-0 left-0 right-0 z-10 flex flex-col">
        <Progress 
          value={progress} 
          className="h-1 w-full rounded-none bg-gray-700" 
          indicatorClassName="bg-white"
        />
        
        <div className="bg-gradient-to-b from-black/40 to-transparent h-12 flex justify-between items-center px-4 py-4 pt-6">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="text-white rounded-full p-0 flex items-center justify-center hover:bg-transparent hover:text-white"
            aria-label="Close game"
            style={{ width: '40px', height: '40px', minWidth: '40px', minHeight: '40px' }}
          >
            <X className="h-5 w-5" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleSkip}
            className="text-white rounded-full p-0 flex items-center justify-center hover:bg-transparent hover:text-white"
            aria-label="Skip this word"
            style={{ width: '40px', height: '40px', minWidth: '40px', minHeight: '40px' }}
          >
            <SkipForward className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 pt-24">
        {currentWord && (
          <div className="w-full max-w-md flex flex-col items-center">
            <div className="bg-black/20 backdrop-blur-sm p-8 rounded-lg w-full mb-8">
              <h2 className="text-xl font-semibold mb-4 text-white">Definition:</h2>
              <p className="text-white text-lg">{currentWord.definition}</p>
            </div>
            
            <WordGuessInput 
              onGuess={handleGuess}
              disabled={!isGameActive}
              hasIncorrectGuess={hasIncorrectGuess}
              correctAnswer={!isGameActive ? currentWord.word : undefined}
              onNextRound={handleNextRound}
            />
          </div>
        )}
      </div>
      
      {/* Success dialog */}
      <FlicktionarySuccessDialog 
        isOpen={showSuccessDialog}
        word={currentWord}
        onNextRound={handleNextRound}
        timeExpired={timeExpired}
      />
    </div>
  );
};

export default FlicktionaryGame;
