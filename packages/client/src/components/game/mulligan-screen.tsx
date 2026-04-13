import type { CardId } from '@bloodfang/engine';
import { plural, t } from '@lingui/core/macro';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useGame } from '../../context/game-context.tsx';
import { playerTextColor } from '../../lib/player-color.ts';
import { Card } from '../card/card.tsx';
import { CardPreviewTrigger } from '../card/card-preview-trigger.tsx';
import { Button } from '../ui/button.tsx';

export function MulliganScreen() {
  const { gameState, definitions, doMulligan, myPlayerIndex, myHand, isOnline } = useGame();

  const [selectedToReturn, setSelectedToReturn] = useState<CardId[]>([]);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  const toggleCard = useCallback((cardId: CardId) => {
    setSelectedToReturn((prev) =>
      prev.includes(cardId) ? prev.filter((id) => id !== cardId) : [...prev, cardId],
    );
  }, []);

  const handleConfirm = useCallback(() => {
    doMulligan(selectedToReturn);
    setSelectedToReturn([]);
  }, [selectedToReturn, doMulligan]);

  const handleKeep = useCallback(() => {
    doMulligan([]);
    setSelectedToReturn([]);
  }, [doMulligan]);

  if (!gameState) return null;

  const heading = isOnline ? t`Mulligan` : t`Player ${String(myPlayerIndex + 1)} — Mulligan`;

  return (
    <div className="flex flex-col items-center gap-4 p-3 sm:gap-6 sm:p-6">
      <h1
        ref={headingRef}
        tabIndex={-1}
        className={`text-xl sm:text-2xl font-bold ${playerTextColor(myPlayerIndex)} outline-none`}
      >
        {heading}
      </h1>
      <p className="text-text-secondary text-center max-w-md">
        {t`Select cards to return to your deck. You'll draw the same number of replacements.`}
      </p>

      <fieldset
        aria-label={t`Cards to mulligan`}
        className="flex gap-2 sm:gap-3 flex-wrap justify-center border-0 p-0 m-0"
      >
        {myHand.map((cardId) => {
          const def = definitions[cardId];
          if (!def) return null;
          const isSelected = selectedToReturn.includes(cardId);

          return (
            <CardPreviewTrigger key={cardId} definition={def}>
              <button
                type="button"
                onClick={() => {
                  toggleCard(cardId);
                }}
                aria-pressed={isSelected}
                className="rounded-lg outline-0 focus:outline-3 focus:outline-focus-ring focus:outline-offset-2"
              >
                <Card definition={def} selected={isSelected} />
              </button>
            </CardPreviewTrigger>
          );
        })}
      </fieldset>

      <div className="flex gap-3">
        <Button onClick={handleKeep}>{t`Keep All`}</Button>
        {selectedToReturn.length > 0 && (
          <Button onClick={handleConfirm} variant="primary">
            {plural(selectedToReturn.length, { one: 'Return # Card', other: 'Return # Cards' })}
          </Button>
        )}
      </div>
    </div>
  );
}
