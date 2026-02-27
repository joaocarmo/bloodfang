import { useState, useEffect, useRef, useCallback } from 'react';
import type { PlayerId } from '@bloodfang/engine';
import { useGameStore } from '../../store/game-store.ts';
import { Card } from '../card/card.tsx';
import { playerTextColor } from '../../lib/player-color.ts';
import { Button } from '../ui/button.tsx';

function getMulliganPlayer(gameState: {
  currentPlayerIndex: PlayerId;
  players: readonly { mulliganUsed: boolean }[];
}): PlayerId {
  const first = gameState.currentPlayerIndex;
  if (gameState.players[first]?.mulliganUsed === false) return first;
  const second: PlayerId = first === 0 ? 1 : 0;
  if (gameState.players[second]?.mulliganUsed === false) return second;
  return first;
}

export function MulliganScreen() {
  const gameState = useGameStore((s) => s.gameState);
  const definitions = useGameStore((s) => s.definitions);
  const doMulligan = useGameStore((s) => s.doMulligan);

  const [selectedToReturn, setSelectedToReturn] = useState<string[]>([]);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const currentPlayer = gameState ? getMulliganPlayer(gameState) : 0;
  const hand = gameState?.players[currentPlayer]?.hand ?? [];

  useEffect(() => {
    headingRef.current?.focus();
  }, [currentPlayer]);

  const toggleCard = useCallback((cardId: string) => {
    setSelectedToReturn((prev) =>
      prev.includes(cardId) ? prev.filter((id) => id !== cardId) : [...prev, cardId],
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
        className={`text-2xl font-bold ${playerTextColor(currentPlayer)} outline-none`}
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
              className="outline-0 focus:outline-3 focus:outline-focus-ring focus:outline-offset-2 rounded-lg"
            >
              <Card definition={def} selected={isSelected} />
            </button>
          );
        })}
      </div>

      <div className="flex gap-3">
        <Button onClick={handleKeep}>Keep All</Button>
        {selectedToReturn.length > 0 && (
          <Button onClick={handleConfirm} variant="primary">
            Return {selectedToReturn.length} Card{selectedToReturn.length > 1 ? 's' : ''}
          </Button>
        )}
      </div>
    </div>
  );
}
