import { useCallback } from 'react';
import { AnimatePresence } from 'motion/react';
import { useGameStore } from '../../store/game-store.ts';
import { useValidMovesForCard } from '../../hooks/use-valid-moves.ts';
import { PawnDots } from './pawn-dots.tsx';
import { PlacedCard } from './placed-card.tsx';
import { getCardName } from '../../lib/card-identity.ts';
import { getEffectivePower } from '@bloodfang/engine';

interface TileProps {
  row: number;
  col: number;
  isFocused: boolean;
  onFocus: () => void;
}

export function Tile({ row, col, isFocused, onFocus }: TileProps) {
  const gameState = useGameStore((s) => s.gameState);
  const selectedCardId = useGameStore((s) => s.selectedCardId);
  const placeCard = useGameStore((s) => s.placeCard);
  const hoverTile = useGameStore((s) => s.hoverTile);
  const definitions = useGameStore((s) => s.definitions);

  const validPositions = useValidMovesForCard(selectedCardId);

  const handleClick = useCallback(() => {
    const tile = gameState?.board[row]?.[col];
    if (!tile || !gameState || !selectedCardId) return;
    const isValid = validPositions.some((p) => p.row === row && p.col === col);
    if (isValid) {
      placeCard({ row, col });
    }
  }, [gameState, validPositions, selectedCardId, placeCard, row, col]);

  const handleMouseEnter = useCallback(() => {
    hoverTile({ row, col });
  }, [hoverTile, row, col]);

  const handleMouseLeave = useCallback(() => {
    hoverTile(null);
  }, [hoverTile]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleClick();
      }
    },
    [handleClick],
  );

  const tile = gameState?.board[row]?.[col];
  if (!tile || !gameState) return null;

  const isValidTarget = validPositions.some((p) => p.row === row && p.col === col);

  const instance =
    tile.cardInstanceId !== null ? gameState.cardInstances[tile.cardInstanceId] : undefined;
  const definition = instance ? definitions[instance.definitionId] : undefined;

  const ownerBg =
    tile.owner === 0
      ? 'bg-tile-p0'
      : tile.owner === 1
        ? 'bg-tile-p1'
        : 'bg-tile-empty';

  const ownerBadge =
    tile.owner !== null ? (
      <span className="absolute top-0.5 left-0.5 text-[9px] text-text-muted font-medium">
        P{tile.owner + 1}
      </span>
    ) : null;

  // Build aria label
  const parts: string[] = [`Row ${row + 1}, Column ${col + 1}`];
  if (tile.owner !== null) parts.push(`Owned by Player ${tile.owner + 1}`);
  if (tile.pawnCount > 0) parts.push(`${tile.pawnCount} pawns`);
  if (instance && definition) {
    const power = getEffectivePower(gameState, instance.instanceId);
    parts.push(`${getCardName(definition.id)} (power ${power})`);
  }
  if (isValidTarget) parts.push('Valid target');

  return (
    <div
      role="gridcell"
      aria-label={parts.join(', ')}
      tabIndex={isFocused ? 0 : -1}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={onFocus}
      className={`
        relative flex flex-col items-center justify-center
        ${ownerBg} rounded-md min-h-16 min-w-14 p-1
        ${isValidTarget ? 'ring-2 ring-power-buff cursor-pointer' : ''}
        focus:outline-3 focus:outline-focus-ring focus:outline-offset-2
        transition-all
      `}
    >
      {ownerBadge}
      <PawnDots count={tile.pawnCount} owner={tile.owner} />
      <AnimatePresence>
        {instance && definition && (
          <PlacedCard
            key={instance.instanceId}
            instance={instance}
            definition={definition}
            gameState={gameState}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
