
import React from 'react';
import { HelpCircle, Lightbulb } from 'lucide-react';
import { Button } from './ui/button';
import { Popover, PopoverTrigger, PopoverContent } from './ui/popover';

interface HintPopoverProps {
  hint: string;
}

const HintPopover: React.FC<HintPopoverProps> = ({ hint }) => {
  if (!hint) return null;
  
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          type="button" 
          variant="outline" 
          size="icon" 
          className="flex-shrink-0 bg-white/90 hover:bg-white"
          aria-label="Show hint"
        >
          <Lightbulb className="h-4 w-4 text-amber-500" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-fit min-w-[220px] p-4 bg-card/95 backdrop-blur-sm border border-amber-200">
        <div className="flex items-start gap-2">
          <Lightbulb className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium mb-1">Movie Hint</p>
            <p className="text-sm text-muted-foreground">{hint}</p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default HintPopover;
