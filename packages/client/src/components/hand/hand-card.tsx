import { t } from '@lingui/core/macro';
import type { CardDefinition, CardId } from '@bloodfang/engine';
import { motion, useReducedMotion } from 'motion/react';
import { Card } from '../card/card.tsx';
import { CardPreviewTrigger } from '../card/card-preview-trigger.tsx';
import { useHasValidMoves } from '../../hooks/use-valid-moves.ts';
import { getCardName } from '../../lib/card-identity.ts';

interface HandCardProps {
  cardId: CardId;
  definition: CardDefinition;
  isSelected: boolean;
  onSelect: (cardId: CardId | null) => void;
  isFocused: boolean;
  onFocus: () => void;
  isMyTurn: boolean;
}

export function HandCard({
  cardId,
  definition,
  isSelected,
  onSelect,
  isFocused,
  onFocus,
  isMyTurn,
}: HandCardProps) {
  const hasValidMoves = useHasValidMoves(cardId);
  const reduceMotion = useReducedMotion();

  const name = getCardName(definition.id);
  const rank = definition.rank;
  const power = definition.power;
  const canInteract = isMyTurn && hasValidMoves;
  const label = !hasValidMoves
    ? t`${name}, Rank ${String(rank)}, Power ${String(power)}, no valid moves`
    : t`${name}, Rank ${String(rank)}, Power ${String(power)}`;

  return (
    <CardPreviewTrigger definition={definition} disabled={isSelected}>
      <motion.div
        role="option"
        aria-selected={isSelected}
        aria-disabled={!canInteract}
        aria-label={label}
        tabIndex={isFocused ? 0 : -1}
        onFocus={onFocus}
        onClick={() => {
          if (canInteract) {
            onSelect(isSelected ? null : cardId);
          }
        }}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && canInteract) {
            e.preventDefault();
            onSelect(isSelected ? null : cardId);
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
          outline-0
          ${!hasValidMoves ? 'opacity-50' : ''}
          focus:outline-3 focus:outline-focus-ring focus:outline-offset-2 focus:rounded-lg
        `}
      >
        <Card definition={definition} selected={isSelected} disabled={!hasValidMoves} compact />
      </motion.div>
    </CardPreviewTrigger>
  );
}
