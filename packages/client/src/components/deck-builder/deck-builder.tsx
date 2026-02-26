import { useRef, useEffect } from 'react';
import { DECK_SIZE } from '@bloodfang/engine';
import { useDeckStore } from '../../store/deck-store.ts';
import { FilterBar } from './filter-bar.tsx';
import { CardCatalog } from './card-catalog.tsx';
import { DeckSlots } from './deck-slots.tsx';

interface DeckBuilderProps {
  playerNumber: 1 | 2;
  onConfirm: (deck: string[]) => void;
}

export function DeckBuilder({ playerNumber, onConfirm }: DeckBuilderProps) {
  const selectedCards = useDeckStore((s) => s.selectedCards);
  const clear = useDeckStore((s) => s.clear);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    clear();
    headingRef.current?.focus();
  }, [playerNumber, clear]);

  const isReady = selectedCards.length === DECK_SIZE;

  return (
    <div className="flex flex-col gap-4 p-4 max-w-6xl mx-auto">
      <h1
        ref={headingRef}
        tabIndex={-1}
        className={`text-2xl font-bold outline-none ${playerNumber === 1 ? 'text-p0' : 'text-p1'}`}
      >
        Player {playerNumber} — Build Your Deck
      </h1>

      <FilterBar />

      <div className="flex gap-4 flex-col lg:flex-row">
        <div className="flex-1 min-w-0">
          <CardCatalog />
        </div>
        <div className="w-full lg:w-56 shrink-0">
          <DeckSlots />
          <div className="mt-3 flex gap-2">
            <button
              onClick={clear}
              className="px-4 py-2 bg-surface-raised border border-border rounded-lg text-sm
                hover:bg-border focus:outline-3 focus:outline-focus-ring focus:outline-offset-2
                min-h-[36px] transition-colors"
            >
              Clear
            </button>
            <button
              onClick={() => onConfirm([...selectedCards])}
              aria-disabled={!isReady}
              className={`px-4 py-2 rounded-lg text-sm font-medium min-h-[36px] transition-colors
                focus:outline-3 focus:outline-focus-ring focus:outline-offset-2
                ${
                  isReady
                    ? 'bg-p0/20 border border-p0 text-p0-light hover:bg-p0/30'
                    : 'bg-surface-raised border border-border text-text-muted cursor-not-allowed'
                }
              `}
            >
              Confirm ({selectedCards.length}/{DECK_SIZE})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
