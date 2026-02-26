import { useRef, useEffect } from 'react';
import type { GameAction } from '@bloodfang/engine';
import { useGameStore } from '../../store/game-store.ts';
import { getCardName } from '../../lib/card-identity.ts';

export function ActionLog() {
  const log = useGameStore((s) => s.gameState?.log ?? []);
  const definitions = useGameStore((s) => s.definitions);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [log.length]);

  // Show last 20 actions
  const recentLog = log.slice(-20);

  return (
    <aside aria-label="Action log">
      <h2 className="text-sm font-medium text-text-secondary mb-1">Log</h2>
      <div
        ref={scrollRef}
        role="log"
        aria-live="polite"
        className="h-40 overflow-y-auto bg-surface-raised rounded-lg p-2 text-xs text-text-muted space-y-0.5"
      >
        {recentLog.map((action, i) => (
          <div key={log.length - 20 + i}>{formatAction(action, definitions)}</div>
        ))}
        {recentLog.length === 0 && <div>No actions yet.</div>}
      </div>
    </aside>
  );
}

function formatAction(action: GameAction, definitions: Record<string, { id: string }>): string {
  switch (action.type) {
    case 'placeCard': {
      const defId = action.cardId;
      const name = definitions[defId] ? getCardName(defId) : action.cardId;
      return `P${action.player + 1} played ${name} at (${action.position.row + 1},${action.position.col + 1})`;
    }
    case 'pass':
      return `P${action.player + 1} passed`;
    case 'drawCard':
      return `P${action.player + 1} drew a card`;
    case 'placePawn':
      return `P${action.player + 1} placed pawn at (${action.position.row + 1},${action.position.col + 1})`;
    case 'capturePawn':
      return `P${action.player + 1} captured pawn at (${action.position.row + 1},${action.position.col + 1})`;
    case 'destroyCard':
      return `Card destroyed at (${action.position.row + 1},${action.position.col + 1})`;
    case 'enhance':
      return `Enhanced card +${action.value} power`;
    case 'enfeeble':
      return `Enfeebled card -${action.value} power`;
    case 'mulligan':
      return `P${action.player + 1} mulliganed ${action.returnedCount} cards`;
    case 'gameEnd':
      return `Game ended: ${action.scores[0]} - ${action.scores[1]}`;
    case 'spawnCard': {
      const name = getCardName(action.definitionId);
      return `Spawned ${name} at (${action.position.row + 1},${action.position.col + 1})`;
    }
    case 'addCardToHand':
      return `P${action.player + 1} received a card`;
    case 'abilityTrigger':
      return `Ability triggered: ${action.abilityTrigger}`;
    case 'pawnBonus':
      return `P${action.player + 1} gained ${action.bonusPawns} bonus pawns at (${action.position.row + 1},${action.position.col + 1})`;
  }
}
