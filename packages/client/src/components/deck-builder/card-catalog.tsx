import { useCallback, useMemo } from 'react';
import { t } from '@lingui/core/macro';
import type { CardDefinition } from '@bloodfang/engine';
import { useGameStore } from '../../store/game-store.ts';
import { useDeckStore } from '../../store/deck-store.ts';
import { Card } from '../card/card.tsx';
import { CardPreviewTrigger } from '../card/card-preview-trigger.tsx';
import { useIsSmallScreen } from '../../hooks/use-small-screen.ts';
import { getCardName } from '../../lib/card-identity.ts';

export function CardCatalog() {
  const definitions = useGameStore((s) => s.definitions);
  const searchQuery = useDeckStore((s) => s.searchQuery);
  const rankFilter = useDeckStore((s) => s.rankFilter);
  const selectedCards = useDeckStore((s) => s.selectedCards);
  const addCard = useDeckStore((s) => s.addCard);
  const isDeckFull = useDeckStore((s) => s.isDeckFull);

  const filteredCards = useMemo(() => {
    const allCards = Object.values(definitions).filter((d) => !d.isToken);

    return allCards.filter((card) => {
      if (rankFilter !== null && card.rank !== rankFilter) return false;
      if (searchQuery) {
        const name = getCardName(card.id).toLowerCase();
        if (!name.includes(searchQuery.toLowerCase())) return false;
      }
      return true;
    });
  }, [definitions, searchQuery, rankFilter]);

  const isSmall = useIsSmallScreen();
  const addLabel = t`Add to Deck`;

  const makeAddAction = useCallback(
    (card: CardDefinition) => {
      const isInDeck = selectedCards.includes(card.id);
      const canAdd = !isInDeck && !isDeckFull();
      if (!canAdd) return undefined;
      return () => {
        addCard(card.id);
      };
    },
    [selectedCards, isDeckFull, addCard],
  );

  return (
    <section
      aria-label={t`Card catalog`}
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 overflow-y-auto max-h-[50vh] sm:max-h-[60vh] p-1"
    >
      {filteredCards.map((card) => {
        const isInDeck = selectedCards.includes(card.id);
        const canAdd = !isInDeck && !isDeckFull();

        return (
          <CardPreviewTrigger
            key={card.id}
            definition={card}
            touchAction={makeAddAction(card)}
            touchActionLabel={addLabel}
          >
            <div className={isInDeck ? 'opacity-40' : ''}>
              <Card
                definition={card}
                disabled={!canAdd}
                selected={isInDeck}
                {...(isSmall
                  ? {}
                  : {
                      onClick: () => {
                        if (canAdd) addCard(card.id);
                      },
                    })}
                compact
              />
            </div>
          </CardPreviewTrigger>
        );
      })}
      {filteredCards.length === 0 && (
        <div className="col-span-full text-center text-text-muted py-8">
          {t`No cards match your filters.`}
        </div>
      )}
    </section>
  );
}
