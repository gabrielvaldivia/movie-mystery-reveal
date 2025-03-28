
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { BookText, Clock, CheckCircle2, XCircle } from 'lucide-react';

interface FlicktionarySuccessDialogProps {
  isOpen: boolean;
  word: { word: string; definition: string } | null;
  onNextRound: () => void;
  timeExpired: boolean;
}

const FlicktionarySuccessDialog: React.FC<FlicktionarySuccessDialogProps> = ({
  isOpen,
  word,
  onNextRound,
  timeExpired
}) => {
  if (!word) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            {timeExpired ? (
              <>
                <Clock className="text-yellow-500" />
                <span>Time's Up!</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="text-green-500" />
                <span>Correct!</span>
              </>
            )}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-primary/10 p-3">
              <BookText className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{word.word}</h3>
              <p className="text-muted-foreground">{word.definition}</p>
            </div>
          </div>
          
          {timeExpired && (
            <div className="rounded-md bg-yellow-500/10 p-4 text-yellow-700 dark:text-yellow-300">
              <div className="flex items-start gap-2">
                <XCircle className="h-5 w-5 mt-0.5" />
                <div>
                  <p className="font-medium">You ran out of time!</p>
                  <p className="text-sm">The word was "{word.word}"</p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex flex-col gap-2">
          <Button onClick={onNextRound} className="w-full">
            Next Word
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FlicktionarySuccessDialog;
