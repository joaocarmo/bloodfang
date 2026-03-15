import { createContext, useContext, useMemo } from 'react';
import type { CardDefinition, CardId, PlayerId, Position } from '@bloodfang/engine';
import { GamePhase, getValidMoves } from '@bloodfang/engine';
import type { FilteredGameState, ValidMove } from '@bloodfang/server/protocol';
import type { GameState } from '@bloodfang/engine';
import { useGameStore } from '../store/game-store.ts';
import { getMulliganPlayer } from '../lib/get-mulligan-player.ts';

// ── Context Interface ───────────────────────────────────────────────

export interface GameContextValue {
  // State
  gameState: GameState | FilteredGameState | null;
  definitions: Record<string, CardDefinition>;
  validMoves: ValidMove[];
  selectedCardId: CardId | null;
  hoveredTilePosition: Position | null;

  // Mode awareness
  isOnline: boolean;
  isMyTurn: boolean;
  myPlayerIndex: PlayerId;
  myHand: readonly CardId[];

  // UI
  announcement: string;
  showTransition: boolean;

  // Actions
  doMulligan: (returnCardIds: CardId[]) => void;
  selectCard: (cardId: CardId | null) => void;
  hoverTile: (position: Position | null) => void;
  placeCard: (position: Position) => void;
  doPass: () => void;
  setShowTransition: (show: boolean) => void;
  announce: (message: string) => void;
  resetToHome: () => void;
}

const GameContext = createContext<GameContextValue | null>(null);

export function useGame(): GameContextValue {
  const ctx = useContext(GameContext);
  if (!ctx) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return ctx;
}

// ── Local Game Provider ─────────────────────────────────────────────

export function LocalGameProvider({ children }: { children: React.ReactNode }) {
  const gameState = useGameStore((s) => s.gameState);
  const definitions = useGameStore((s) => s.definitions);
  const selectedCardId = useGameStore((s) => s.selectedCardId);
  const hoveredTilePosition = useGameStore((s) => s.hoveredTilePosition);
  const announcement = useGameStore((s) => s.announcement);
  const showTransition = useGameStore((s) => s.showTransition);
  const storeMulligan = useGameStore((s) => s.doMulligan);
  const storeSelectCard = useGameStore((s) => s.selectCard);
  const storeHoverTile = useGameStore((s) => s.hoverTile);
  const storePlaceCard = useGameStore((s) => s.placeCard);
  const storePass = useGameStore((s) => s.doPass);
  const storeSetShowTransition = useGameStore((s) => s.setShowTransition);
  const storeAnnounce = useGameStore((s) => s.announce);
  const storeResetToHome = useGameStore((s) => s.resetToHome);

  const validMoves: ValidMove[] = useMemo(() => {
    if (gameState?.phase !== GamePhase.Playing) return [];
    return getValidMoves(gameState);
  }, [gameState]);

  const myPlayerIndex: PlayerId = gameState?.currentPlayerIndex ?? 0;

  const myHand: readonly CardId[] = useMemo(() => {
    return gameState?.players[myPlayerIndex].hand ?? [];
  }, [gameState, myPlayerIndex]);

  const doMulligan = useMemo(() => {
    return (returnCardIds: CardId[]) => {
      if (!gameState) return;
      const player = getMulliganPlayer(gameState);
      storeMulligan(player, returnCardIds);
    };
  }, [gameState, storeMulligan]);

  const value: GameContextValue = useMemo(
    () => ({
      gameState,
      definitions,
      validMoves,
      selectedCardId,
      hoveredTilePosition,
      isOnline: false,
      isMyTurn: true,
      myPlayerIndex,
      myHand,
      announcement,
      showTransition,
      doMulligan,
      selectCard: storeSelectCard,
      hoverTile: storeHoverTile,
      placeCard: storePlaceCard,
      doPass: storePass,
      setShowTransition: storeSetShowTransition,
      announce: storeAnnounce,
      resetToHome: storeResetToHome,
    }),
    [
      gameState,
      definitions,
      validMoves,
      selectedCardId,
      hoveredTilePosition,
      myPlayerIndex,
      myHand,
      announcement,
      showTransition,
      doMulligan,
      storeSelectCard,
      storeHoverTile,
      storePlaceCard,
      storePass,
      storeSetShowTransition,
      storeAnnounce,
      storeResetToHome,
    ],
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

// Re-export for OnlineGameProvider
export { GameContext };
