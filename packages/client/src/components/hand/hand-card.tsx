import type { CardDefinition } from '@bloodfang/engine';
import { motion, useReducedMotion } from 'motion/react';
import { Card } from '../card/card.tsx';
import { useHasValidMoves } from '../../hooks/use-valid-moves.ts';

interface HandCardProps {
  cardId: string;
  definition: CardDefinition;
  isSelected: boolean;
  onSelect: (cardId: string) => void;
  isFocused: boolean;
  onFocus: () => void;
}

export function HandCard({
  cardId,
  definition,
  isSelected,
  onSelect,
  isFocused,
  onFocus,
}: HandCardProps) {
  const hasValidMoves = useHasValidMoves(cardId);
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      role="option"
      aria-selected={isSelected}
      aria-disabled={!hasValidMoves}
      tabIndex={isFocused ? 0 : -1}
      onFocus={onFocus}
      onClick={() => {
        if (hasValidMoves) {
          onSelect(isSelected ? '' : cardId);
        }
      }}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && hasValidMoves) {
          e.preventDefault();
          onSelect(isSelected ? '' : cardId);
        }
      }}
      animate={
        reduceMotion
          ? {}
          : {
              scale: isSelected ? 1.1 : 1,
              y: isSelected ? -8 : 0,
            }
      }
      transition={{ type: 'spring', duration: 0.2, bounce: 0.3 }}
      layoutId={`hand-${cardId}`}
      className={`
        outline-none
        ${!hasValidMoves ? 'opacity-50' : ''}
        focus:outline-3 focus:outline-focus-ring focus:outline-offset-2 focus:rounded-lg
      `}
    >
      <Card
        definition={definition}
        selected={isSelected}
        disabled={!hasValidMoves}
        compact
      />
    </motion.div>
  );
}
