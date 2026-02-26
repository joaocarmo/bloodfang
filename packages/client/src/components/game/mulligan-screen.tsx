import { useState, useEffect, useRef, useCallback } from 'react';
import { useGameStore } from '../../store/game-store.ts';
import { Card } from '../card/card.tsx';

export function MulliganScreen() {
  const gameState = useGameStore((s) => s.gameState);
  const definitions = useGameStore((s) => s.definitions);
  const doMulligan = useGameStore((s) => s.doMulligan);

  const [selectedToReturn, setSelectedToReturn] = useState<string[]>([]);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const currentPlayer = gameState?.currentPlayerIndex ?? 0;
  const hand = gameState?.players[currentPlayer]?.hand ?? [];

  useEffect(() => {
    headingRef.current?.focus();
  }, [currentPlayer]);

  const toggleCard = useCallback((cardId: string) => {
    setSelectedToReturn((prev) =>
      prev.includes(cardId)
        ? prev.filter((id) => id !== cardId)
        : [...prev, cardId],
    );
  }, []);

  const handleConfirm = useCallback(() => {
    doMulligan(currentPlayer, selectedToReturn);
    setSelectedToReturn([]);
  }, [currentPlayer, selectedToReturn, doMulligan]);

  const handleKeep = useCallback(() => {
    doMulligan(currentPlayer, []);
    setSelectedToReturn([]);
  }, [currentPlayer, doMulligan]);

  return (
    <div className="flex flex-col items-center gap-6 p-6">
      <h1
        ref={headingRef}
        tabIndex={-1}
        className={`text-2xl font-bold ${currentPlayer === 0 ? 'text-p0' : 'text-p1'} outline-none`}
      >
        Player {currentPlayer + 1} — Mulligan
      </h1>
      <p className="text-text-secondary text-center max-w-md">
        Select cards to return to your deck. You&apos;ll draw the same number of replacements.
      </p>

      <div
        role="group"
        aria-label="Cards to mulligan"
        className="flex gap-3 flex-wrap justify-center"
      >
        {hand.map((cardId) => {
          const def = definitions[cardId];
          if (!def) return null;
          const isSelected = selectedToReturn.includes(cardId);

          return (
            <button
              key={cardId}
              onClick={() => toggleCard(cardId)}
              aria-pressed={isSelected}
              className="outline-none focus:outline-3 focus:outline-focus-ring focus:outline-offset-2 rounded-lg"
            >
              <Card definition={def} selected={isSelected} />
            </button>
          );
        })}
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleKeep}
          className="px-6 py-2 bg-surface-raised border border-border rounded-lg font-medium
            hover:bg-border focus:outline-3 focus:outline-focus-ring focus:outline-offset-2
            min-h-[44px] transition-colors"
        >
          Keep All
        </button>
        {selectedToReturn.length > 0 && (
          <button
            onClick={handleConfirm}
            className="px-6 py-2 bg-p0/20 border border-p0 rounded-lg font-medium text-p0-light
              hover:bg-p0/30 focus:outline-3 focus:outline-focus-ring focus:outline-offset-2
              min-h-[44px] transition-colors"
          >
            Return {selectedToReturn.length} Card{selectedToReturn.length > 1 ? 's' : ''}
          </button>
        )}
      </div>
    </div>
  );
}
