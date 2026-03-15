import { useMemo } from 'react';
import {
  BOARD_ROWS,
  BOARD_COLS,
  GamePhase,
  resolveRangePattern,
  resolveAbilityRangePattern,
  playCard,
  getEffectivePower,
  calculateLaneScores,
} from '@bloodfang/engine';
import type { GameState, LaneScores } from '@bloodfang/engine';
import { useGame } from '../context/game-context.tsx';
import { toSimulatableState } from '../lib/game-state-adapter.ts';
import type { FilteredGameState } from '@bloodfang/server/protocol';

export interface TilePreview {
  isPawnRange: boolean;
  isAbilityRange: boolean;
  powerDelta?: number | undefined;
  pawnDelta?: number | undefined;
  willBeDestroyed?: boolean | undefined;
  isPlacementTile?: boolean | undefined;
  maxRankBefore?: number | undefined;
  maxRankAfter?: number | undefined;
}

export interface PlacementPreviewResult {
  tiles: Map<string, TilePreview>;
  previewLaneScores: LaneScores | null;
}

export function usePlacementPreview(): PlacementPreviewResult {
  const { gameState, selectedCardId, hoveredTilePosition, definitions, validMoves, isOnline } =
    useGame();

  return useMemo(() => {
    const empty: PlacementPreviewResult = {
      tiles: new Map<string, TilePreview>(),
      previewLaneScores: null,
    };

    if (!gameState || !selectedCardId || !hoveredTilePosition) return empty;
    if (gameState.phase !== GamePhase.Playing) return empty;

    // Check if hover position is a valid move
    const cardMoves = validMoves.find((m) => m.cardId === selectedCardId);
    const isValid = cardMoves?.positions.some(
      (p) => p.row === hoveredTilePosition.row && p.col === hoveredTilePosition.col,
    );
    if (!isValid) return empty;

    const def = definitions[selectedCardId];
    if (!def) return empty;

    const player = gameState.currentPlayerIndex;
    const result = new Map<string, TilePreview>();

    // Mark placement tile
    const placementKey = `${String(hoveredTilePosition.row)},${String(hoveredTilePosition.col)}`;
    result.set(placementKey, {
      isPawnRange: false,
      isAbilityRange: false,
      isPlacementTile: true,
    });

    // Compute pawn range
    const pawnPositions = resolveRangePattern(def.rangePattern, hoveredTilePosition, player);
    for (const pos of pawnPositions) {
      const key = `${String(pos.row)},${String(pos.col)}`;
      const existing = result.get(key);
      result.set(key, {
        ...existing,
        isPawnRange: true,
        isAbilityRange: existing?.isAbilityRange ?? false,
      });
    }

    // Compute ability range
    if (def.ability) {
      const abilityPositions = resolveAbilityRangePattern(
        def.rangePattern,
        hoveredTilePosition,
        player,
      );
      for (const pos of abilityPositions) {
        const key = `${String(pos.row)},${String(pos.col)}`;
        const existing = result.get(key);
        result.set(key, {
          ...existing,
          isPawnRange: existing?.isPawnRange ?? false,
          isAbilityRange: true,
        });
      }
    }

    // Simulate placement to compute power deltas and destroyed cards
    try {
      // Get a simulatable GameState (works for both local and online)
      const simulatable: GameState = isOnline
        ? toSimulatableState(gameState as FilteredGameState)
        : (gameState as GameState);

      const newState = playCard(simulatable, selectedCardId, hoveredTilePosition);

      // Collect power before (for existing instances)
      const oldInstances = simulatable.cardInstances;
      const newInstances = newState.cardInstances;

      for (const instanceId of Object.keys(oldInstances)) {
        const oldInstance = oldInstances[instanceId];
        if (!oldInstance) continue;

        const newInstance = newInstances[instanceId];
        const key = `${String(oldInstance.position.row)},${String(oldInstance.position.col)}`;

        if (!newInstance) {
          // Card was destroyed
          const existing = result.get(key);
          result.set(key, {
            isPawnRange: existing?.isPawnRange ?? false,
            isAbilityRange: existing?.isAbilityRange ?? false,
            willBeDestroyed: true,
          });
        } else {
          const oldPower = getEffectivePower(simulatable, instanceId);
          const newPower = getEffectivePower(newState, instanceId);
          const delta = newPower - oldPower;

          if (delta !== 0) {
            const existing = result.get(key);
            result.set(key, {
              isPawnRange: existing?.isPawnRange ?? false,
              isAbilityRange: existing?.isAbilityRange ?? false,
              powerDelta: delta,
            });
          }
        }
      }

      // Compute pawn count deltas and rank tier changes
      for (let r = 0; r < BOARD_ROWS; r++) {
        for (let c = 0; c < BOARD_COLS; c++) {
          const oldTile = simulatable.board[r]?.[c];
          const newTile = newState.board[r]?.[c];
          if (!oldTile || !newTile) continue;

          const key = `${String(r)},${String(c)}`;
          const existing = result.get(key);

          const pawnDelta = newTile.pawnCount - oldTile.pawnCount;
          const oldMaxRank = Math.min(oldTile.pawnCount, 3);
          const newMaxRank = Math.min(newTile.pawnCount, 3);

          if (pawnDelta !== 0 || oldMaxRank !== newMaxRank) {
            result.set(key, {
              isPawnRange: existing?.isPawnRange ?? false,
              isAbilityRange: existing?.isAbilityRange ?? false,
              ...existing,
              ...(pawnDelta !== 0 ? { pawnDelta } : {}),
              ...(oldMaxRank !== newMaxRank
                ? { maxRankBefore: oldMaxRank, maxRankAfter: newMaxRank }
                : {}),
            });
          }
        }
      }

      const previewLaneScores = calculateLaneScores(newState);
      return { tiles: result, previewLaneScores };
    } catch {
      // If simulation fails, just show range overlays without power deltas
      return { tiles: result, previewLaneScores: null };
    }
  }, [gameState, selectedCardId, hoveredTilePosition, definitions, validMoves, isOnline]);
}
