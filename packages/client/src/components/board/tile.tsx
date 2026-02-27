import { useCallback } from 'react';
import { t } from '@lingui/core/macro';
import { AnimatePresence } from 'motion/react';
import { useGameStore } from '../../store/game-store.ts';
import { useValidMovesForCard } from '../../hooks/use-valid-moves.ts';
import { PawnDots } from './pawn-dots.tsx';
import { PlacedCard } from './placed-card.tsx';
import { getCardName } from '../../lib/card-identity.ts';
import { getEffectivePower } from '@bloodfang/engine';
import type { TilePreview } from '../../hooks/use-placement-preview.ts';

interface TileProps {
  row: number;
  col: number;
  isFocused: boolean;
  onFocus: () => void;
  preview?: TilePreview | undefined;
}

export function Tile({ row, col, isFocused, onFocus, preview }: TileProps) {
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
    tile.owner === 0 ? 'bg-tile-p0' : tile.owner === 1 ? 'bg-tile-p1' : 'bg-tile-empty';

  const ownerBadge =
    tile.owner !== null ? (
      <span className="absolute top-0.5 left-0.5 text-[9px] text-text-muted font-medium">
        {t`P${tile.owner + 1}`}
      </span>
    ) : null;

  // Build aria label
  const rowNum = row + 1;
  const colNum = col + 1;
  const parts: string[] = [t`Row ${rowNum}, Column ${colNum}`];
  if (tile.owner !== null) {
    const ownerNum = tile.owner + 1;
    parts.push(t`Owned by Player ${ownerNum}`);
  }
  if (tile.pawnCount > 0) {
    const pawnCount = tile.pawnCount;
    parts.push(t`${pawnCount} pawns`);
  }
  if (instance && definition) {
    const power = getEffectivePower(gameState, instance.instanceId);
    const name = getCardName(definition.id);
    parts.push(t`${name} (power ${power})`);
  }
  if (isValidTarget) parts.push(t`Valid target`);

  // Preview overlay classes
  const currentPlayer = gameState.currentPlayerIndex;
  let previewOverlay: string | null = null;
  if (preview?.isPlacementTile) {
    previewOverlay = currentPlayer === 0 ? 'bg-p0/30' : 'bg-p1/30';
  } else if (preview?.willBeDestroyed) {
    previewOverlay = 'bg-power-debuff/30';
  } else if (preview?.isPawnRange && preview.isAbilityRange) {
    previewOverlay = currentPlayer === 0 ? 'bg-p0/20' : 'bg-p1/20';
  } else if (preview?.isPawnRange) {
    previewOverlay = currentPlayer === 0 ? 'bg-p0/20' : 'bg-p1/20';
  } else if (preview?.isAbilityRange) {
    previewOverlay = 'bg-power-buff/15';
  }

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
        ${ownerBg} rounded-md min-h-10 min-w-8 sm:min-h-14 sm:min-w-12 md:min-h-16 md:min-w-14 p-0.5 sm:p-1
        ${isValidTarget ? 'ring-2 ring-power-buff cursor-pointer' : ''}
        ${preview?.isPlacementTile ? 'ring-3 ring-power-buff' : ''}
        ${preview?.willBeDestroyed ? 'ring-2 ring-power-debuff animate-pulse' : ''}
        focus:outline-3 focus:outline-focus-ring focus:outline-offset-2
        transition-all
      `}
    >
      {previewOverlay && (
        <div className={`absolute inset-0 rounded-md ${previewOverlay} pointer-events-none z-0`} />
      )}
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
      {preview?.powerDelta != null && preview.powerDelta !== 0 && (
        <span
          className={`absolute bottom-0.5 right-0.5 text-[10px] font-bold z-10 px-0.5 rounded ${
            preview.powerDelta > 0 ? 'text-power-buff' : 'text-power-debuff'
          }`}
        >
          {preview.powerDelta > 0 ? `+${preview.powerDelta}` : preview.powerDelta}
        </span>
      )}
      {preview?.pawnDelta != null && preview.pawnDelta !== 0 && (
        <span
          className={`absolute top-0.5 right-0.5 text-[10px] font-bold z-10 px-0.5 rounded ${
            preview.pawnDelta > 0 ? 'text-power-buff' : 'text-power-debuff'
          }`}
        >
          {preview.pawnDelta > 0 ? `+${preview.pawnDelta}♟` : `${preview.pawnDelta}♟`}
        </span>
      )}
    </div>
  );
}
