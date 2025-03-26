
import React from 'react';
import { HelpCircle } from 'lucide-react';
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
          <HelpCircle className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-fit min-w-[200px] p-3">
        <p className="text-sm font-medium">Hint: {hint}</p>
      </PopoverContent>
    </Popover>
  );
};

export default HintPopover;
