import { useRef, useEffect } from 'react';
import { t } from '@lingui/core/macro';
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
    <aside aria-label={t`Action log`}>
      <h2 className="text-sm font-medium text-text-secondary mb-1">{t`Log`}</h2>
      <div
        ref={scrollRef}
        role="log"
        aria-live="polite"
        className="h-40 overflow-y-auto bg-surface-raised rounded-lg p-2 text-xs text-text-muted space-y-0.5"
      >
        {recentLog.map((action, i) => (
          <div key={log.length - 20 + i}>{formatAction(action, definitions)}</div>
        ))}
        {recentLog.length === 0 && <div>{t`No actions yet.`}</div>}
      </div>
    </aside>
  );
}

function formatAction(action: GameAction, definitions: Record<string, { id: string }>): string {
  switch (action.type) {
    case 'placeCard': {
      const defId = action.cardId;
      const name = definitions[defId] ? getCardName(defId) : action.cardId;
      const p = action.player + 1;
      const row = action.position.row + 1;
      const col = action.position.col + 1;
      return t`P${p} played ${name} at (${row},${col})`;
    }
    case 'pass': {
      const p = action.player + 1;
      return t`P${p} passed`;
    }
    case 'drawCard': {
      const p = action.player + 1;
      return t`P${p} drew a card`;
    }
    case 'placePawn': {
      const p = action.player + 1;
      const row = action.position.row + 1;
      const col = action.position.col + 1;
      return t`P${p} placed pawn at (${row},${col})`;
    }
    case 'capturePawn': {
      const p = action.player + 1;
      const row = action.position.row + 1;
      const col = action.position.col + 1;
      return t`P${p} captured pawn at (${row},${col})`;
    }
    case 'destroyCard': {
      const row = action.position.row + 1;
      const col = action.position.col + 1;
      return t`Card destroyed at (${row},${col})`;
    }
    case 'enhance':
      return t`Enhanced card +${action.value} power`;
    case 'enfeeble':
      return t`Enfeebled card -${action.value} power`;
    case 'mulligan': {
      const p = action.player + 1;
      const count = action.returnedCount;
      return t`P${p} mulliganed ${count} cards`;
    }
    case 'gameEnd':
      return t`Game ended: ${action.scores[0]} - ${action.scores[1]}`;
    case 'spawnCard': {
      const name = getCardName(action.definitionId);
      const row = action.position.row + 1;
      const col = action.position.col + 1;
      return t`Spawned ${name} at (${row},${col})`;
    }
    case 'addCardToHand': {
      const p = action.player + 1;
      return t`P${p} received a card`;
    }
    case 'abilityTrigger':
      return t`Ability triggered: ${action.abilityTrigger}`;
    case 'pawnBonus': {
      const p = action.player + 1;
      const bonus = action.bonusPawns;
      const row = action.position.row + 1;
      const col = action.position.col + 1;
      return t`P${p} gained ${bonus} bonus pawns at (${row},${col})`;
    }
  }
}
