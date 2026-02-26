import { DECK_SIZE } from '@bloodfang/engine';
import { useDeckStore } from '../../store/deck-store.ts';
import { useGameStore } from '../../store/game-store.ts';
import { getCardName } from '../../lib/card-identity.ts';

export function DeckSlots() {
  const selectedCards = useDeckStore((s) => s.selectedCards);
  const removeCard = useDeckStore((s) => s.removeCard);
  const definitions = useGameStore((s) => s.definitions);

  return (
    <div>
      <h2 className="text-sm font-medium text-text-secondary mb-2">
        Deck ({selectedCards.length}/{DECK_SIZE})
      </h2>
      <ul aria-label="Selected deck cards" className="space-y-1">
        {Array.from({ length: DECK_SIZE }, (_, i) => {
          const cardId = selectedCards[i];
          const def = cardId ? definitions[cardId] : undefined;

          if (!cardId || !def) {
            return (
              <li
                key={i}
                className="h-8 bg-surface-raised border border-border border-dashed rounded flex items-center justify-center text-text-muted text-xs"
              >
                Empty
              </li>
            );
          }

          return (
            <li key={i}>
              <button
                onClick={() => removeCard(cardId)}
                className="w-full h-8 bg-surface-raised border border-border rounded flex items-center justify-between px-2 text-xs
                  hover:bg-border focus:outline-3 focus:outline-focus-ring focus:outline-offset-2 transition-colors"
                aria-label={`Remove ${getCardName(cardId)} from deck`}
              >
                <span className="truncate">{getCardName(cardId)}</span>
                <span className="text-text-muted ml-1 tabular-nums">P{def.power}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
