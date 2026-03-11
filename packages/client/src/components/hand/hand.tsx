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
  const hand = gameState?.players[currentPlayer].hand ?? [];

  // Clamp focusedIndex when hand shrinks (e.g. after playing a card)
  const clampedFocusedIndex = hand.length === 0 ? 0 : Math.min(focusedIndex, hand.length - 1);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (hand.length === 0) return;

      let nextIndex = clampedFocusedIndex;

      switch (e.key) {
        case 'ArrowLeft':
          nextIndex = Math.max(0, clampedFocusedIndex - 1);
          break;
        case 'ArrowRight':
          nextIndex = Math.min(hand.length - 1, clampedFocusedIndex + 1);
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
      const target = options?.[nextIndex];
      if (target instanceof HTMLElement) target.focus();
    },
    [clampedFocusedIndex, hand.length, selectCard],
  );

  if (hand.length === 0) {
    return <div className="text-center text-text-muted py-4">{t`No cards in hand`}</div>;
  }

  return (
    <div>
      <h2 className="sr-only">{t`Your Hand`}</h2>
      <div
        ref={listRef}
        role="listbox"
        aria-label={t`Player ${String(currentPlayer + 1)}'s hand`}
        tabIndex={-1}
        onKeyDown={handleKeyDown}
        className="flex gap-1 sm:gap-2 justify-center items-end flex-wrap py-1 sm:py-2"
      >
        {hand.map((cardId, index) => {
          // cardId is the definitionId in the hand
          const def = definitions[cardId];
          if (!def) return null;

          return (
            <HandCard
              key={`${cardId}-${String(index)}`}
              cardId={cardId}
              definition={def}
              isSelected={selectedCardId === cardId}
              onSelect={selectCard}
              isFocused={clampedFocusedIndex === index}
              onFocus={() => {
                setFocusedIndex(index);
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
