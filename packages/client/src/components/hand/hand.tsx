import { t } from '@lingui/core/macro';
import { type KeyboardEvent, useCallback, useRef, useState } from 'react';
import { useGame } from '../../context/game-context.tsx';
import { HandCard } from './hand-card.tsx';

export function Hand() {
  const { definitions, selectedCardId, selectCard, myHand, isOnline, myPlayerIndex, isMyTurn } =
    useGame();
  const [focusedIndex, setFocusedIndex] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);

  // Clamp focusedIndex when hand shrinks (e.g. after playing a card)
  const clampedFocusedIndex = myHand.length === 0 ? 0 : Math.min(focusedIndex, myHand.length - 1);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (myHand.length === 0) return;

      let nextIndex = clampedFocusedIndex;

      switch (e.key) {
        case 'ArrowLeft':
          nextIndex = Math.max(0, clampedFocusedIndex - 1);
          break;
        case 'ArrowRight':
          nextIndex = Math.min(myHand.length - 1, clampedFocusedIndex + 1);
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
    [clampedFocusedIndex, myHand.length, selectCard],
  );

  if (myHand.length === 0) {
    return <div className="text-center text-text-muted py-4">{t`No cards in hand`}</div>;
  }

  const label = isOnline ? t`Your hand` : t`Player ${String(myPlayerIndex + 1)}'s hand`;

  return (
    <div>
      <h2 className="text-xs text-text-muted text-center mb-1">
        {t`Your Hand (${String(myHand.length)})`}
      </h2>
      {!isMyTurn && <span className="sr-only">{t`Waiting for opponent`}</span>}
      <div
        ref={listRef}
        role="listbox"
        aria-label={label}
        tabIndex={-1}
        onKeyDown={handleKeyDown}
        className={`flex gap-1 sm:gap-2 justify-center items-end flex-wrap py-1 sm:py-2 ${!isMyTurn ? 'opacity-50 pointer-events-none' : ''}`}
      >
        {myHand.map((cardId, index) => {
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
              isMyTurn={isMyTurn}
            />
          );
        })}
      </div>
    </div>
  );
}
