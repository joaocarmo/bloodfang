import { useRef, useState, useCallback, type KeyboardEvent } from 'react';
import { t } from '@lingui/core/macro';
import { useGameStore } from '../../store/game-store.ts';
import { HandCard } from './hand-card.tsx';

export function Hand() {
  const gameState = useGameStore((s) => s.gameState);
  const definitions = useGameStore((s) => s.definitions);
  const selectedCardId = useGameStore((s) => s.selectedCardId);
  const selectCard = useGameStore((s) => s.selectCard);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);

  const currentPlayer = gameState?.currentPlayerIndex ?? 0;
  const hand = gameState?.players[currentPlayer]?.hand ?? [];

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (hand.length === 0) return;

      let nextIndex = focusedIndex;

      switch (e.key) {
        case 'ArrowLeft':
          nextIndex = Math.max(0, focusedIndex - 1);
          break;
        case 'ArrowRight':
          nextIndex = Math.min(hand.length - 1, focusedIndex + 1);
          break;
        case 'Escape':
          selectCard(null);
          return;
        default:
          return;
      }

      e.preventDefault();
      setFocusedIndex(nextIndex);

      // Programmatically focus the next option
      const options = listRef.current?.querySelectorAll('[role="option"]');
      (options?.[nextIndex] as HTMLElement)?.focus();
    },
    [focusedIndex, hand.length, selectCard],
  );

  if (hand.length === 0) {
    return <div className="text-center text-text-muted py-4">{t`No cards in hand`}</div>;
  }

  return (
    <div>
      <h2 className="sr-only">{t`Your Hand`}</h2>
      {/* eslint-disable-next-line jsx-a11y/interactive-supports-focus -- focus managed via roving tabindex on child options */}
      <div
        ref={listRef}
        role="listbox"
        aria-label={t`Player ${currentPlayer + 1}'s hand`}
        onKeyDown={handleKeyDown}
        className="flex gap-2 justify-center items-end flex-wrap py-2"
      >
        {hand.map((cardId, index) => {
          // cardId is the definitionId in the hand
          const def = definitions[cardId];
          if (!def) return null;

          return (
            <HandCard
              key={`${cardId}-${index}`}
              cardId={cardId}
              definition={def}
              isSelected={selectedCardId === cardId}
              onSelect={(id) => selectCard(id || null)}
              isFocused={focusedIndex === index}
              onFocus={() => setFocusedIndex(index)}
            />
          );
        })}
      </div>
    </div>
  );
}
