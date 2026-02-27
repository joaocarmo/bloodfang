import { useMemo } from 'react';
import {
  GamePhase,
  getValidMoves,
  resolveRangePattern,
  resolveAbilityRangePattern,
  playCard,
  getEffectivePower,
} from '@bloodfang/engine';
import { useGameStore } from '../store/game-store.ts';

export interface TilePreview {
  isPawnRange: boolean;
  isAbilityRange: boolean;
  powerDelta?: number;
  willBeDestroyed?: boolean;
  isPlacementTile?: boolean;
}

export function usePlacementPreview(): Map<string, TilePreview> {
  const gameState = useGameStore((s) => s.gameState);
  const selectedCardId = useGameStore((s) => s.selectedCardId);
  const hoveredTilePosition = useGameStore((s) => s.hoveredTilePosition);
  const definitions = useGameStore((s) => s.definitions);

  return useMemo(() => {
    const empty = new Map<string, TilePreview>();

    if (!gameState || !selectedCardId || !hoveredTilePosition) return empty;
    if (gameState.phase !== GamePhase.Playing) return empty;

    // Check if hover position is a valid move
    const validMoves = getValidMoves(gameState);
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
    const placementKey = `${hoveredTilePosition.row},${hoveredTilePosition.col}`;
    result.set(placementKey, {
      isPawnRange: false,
      isAbilityRange: false,
      isPlacementTile: true,
    });

    // Compute pawn range
    const pawnPositions = resolveRangePattern(def.rangePattern, hoveredTilePosition, player);
    for (const pos of pawnPositions) {
      const key = `${pos.row},${pos.col}`;
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
        const key = `${pos.row},${pos.col}`;
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
      const newState = playCard(gameState, selectedCardId, hoveredTilePosition);

      // Collect power before (for existing instances)
      const oldInstances = gameState.cardInstances;
      const newInstances = newState.cardInstances;

      for (const instanceId of Object.keys(oldInstances)) {
        const oldInstance = oldInstances[instanceId];
        if (!oldInstance) continue;

        const newInstance = newInstances[instanceId];
        const key = `${oldInstance.position.row},${oldInstance.position.col}`;

        if (!newInstance) {
          // Card was destroyed
          const existing = result.get(key);
          result.set(key, {
            isPawnRange: existing?.isPawnRange ?? false,
            isAbilityRange: existing?.isAbilityRange ?? false,
            willBeDestroyed: true,
          });
        } else {
          const oldPower = getEffectivePower(gameState, instanceId);
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
    } catch {
      // If simulation fails, just show range overlays without power deltas
    }

    return result;
  }, [gameState, selectedCardId, hoveredTilePosition, definitions]);
}
