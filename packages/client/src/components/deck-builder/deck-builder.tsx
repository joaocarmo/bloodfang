import type { CardId } from '@bloodfang/engine';
import { DECK_SIZE } from '@bloodfang/engine';
import { t } from '@lingui/core/macro';
import { useEffect, useRef } from 'react';
import { playerTextColor } from '../../lib/player-color.ts';
import { useDeckStore } from '../../store/deck-store.ts';
import { Button } from '../ui/button.tsx';
import { CardCatalog } from './card-catalog.tsx';
import { DeckSlots } from './deck-slots.tsx';
import { FilterBar } from './filter-bar.tsx';

interface DeckBuilderProps {
  playerNumber: 1 | 2;
  onConfirm: (deck: CardId[]) => void;
}

export function DeckBuilder({ playerNumber, onConfirm }: DeckBuilderProps) {
  const selectedCards = useDeckStore((s) => s.selectedCards);
  const clear = useDeckStore((s) => s.clear);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    clear();
    headingRef.current?.focus();
  }, [clear]);

  const isReady = selectedCards.length === DECK_SIZE;

  return (
    <section className="flex flex-col gap-3 p-2 sm:gap-4 sm:p-4 max-w-6xl mx-auto">
      <h1
        ref={headingRef}
        tabIndex={-1}
        className={`text-xl sm:text-2xl font-bold outline-none ${playerTextColor(playerNumber === 1 ? 0 : 1)}`}
      >
        {t`Player ${String(playerNumber)} — Build Your Deck`}
      </h1>

      <FilterBar />

      <div className="flex gap-4 flex-col lg:flex-row">
        <div className="flex-1 min-w-0">
          <CardCatalog />
        </div>
        <div className="w-full lg:w-56 shrink-0">
          <DeckSlots />
          <div className="mt-3 flex gap-2">
            <Button onClick={clear} size="sm">
              {t`Clear`}
            </Button>
            <Button
              onClick={() => {
                if (isReady) onConfirm([...selectedCards]);
              }}
              aria-disabled={!isReady}
              variant={isReady ? 'primary' : 'secondary'}
              size="sm"
              className={isReady ? '' : 'opacity-50 cursor-not-allowed'}
            >
              {t`Confirm (${String(selectedCards.length)}/${String(DECK_SIZE)})`}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
