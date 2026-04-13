import type { CardId, Position } from '@bloodfang/engine';
import { ClientMessageType } from '@bloodfang/server/protocol';
import { useCallback, useMemo } from 'react';
import { disconnectWs } from '../hooks/use-websocket.ts';
import { sendMessage, useOnlineGameStore } from '../store/online-game-store.ts';
import { GameContext, type GameContextValue } from './game-context.tsx';

export function OnlineGameProvider({ children }: { children: React.ReactNode }) {
  const filteredGameState = useOnlineGameStore((s) => s.filteredGameState);
  const definitions = useOnlineGameStore((s) => s.definitions);
  const validMoves = useOnlineGameStore((s) => s.validMoves);
  const selectedCardId = useOnlineGameStore((s) => s.selectedCardId);
  const hoveredTilePosition = useOnlineGameStore((s) => s.hoveredTilePosition);
  const announcement = useOnlineGameStore((s) => s.announcement);
  const storeSelectCard = useOnlineGameStore((s) => s.selectCard);
  const storeHoverTile = useOnlineGameStore((s) => s.hoverTile);
  const storeAnnounce = useOnlineGameStore((s) => s.announce);

  const isMyTurn = filteredGameState?.currentPlayerIndex === 0;

  const myHand: readonly CardId[] = useMemo(() => {
    return filteredGameState?.players[0].hand ?? [];
  }, [filteredGameState]);

  const doMulligan = useCallback((returnCardIds: CardId[]) => {
    sendMessage({ type: ClientMessageType.Mulligan, returnCardIds });
  }, []);

  const placeCard = useCallback(
    (position: Position) => {
      if (!selectedCardId) return;
      sendMessage({ type: ClientMessageType.PlayCard, cardId: selectedCardId, position });
    },
    [selectedCardId],
  );

  const doPass = useCallback(() => {
    sendMessage({ type: ClientMessageType.Pass });
  }, []);

  const resetToHome = useCallback(() => {
    disconnectWs();
    useOnlineGameStore.getState().reset();
  }, []);

  const setShowTransition = useCallback((_show: boolean) => {
    // No-op in online mode — no turn transition dialog needed
  }, []);

  const value: GameContextValue = useMemo(
    () => ({
      gameState: filteredGameState,
      definitions,
      validMoves: [...validMoves],
      selectedCardId,
      hoveredTilePosition,
      isOnline: true,
      isMyTurn,
      myPlayerIndex: 0,
      myHand,
      announcement,
      showTransition: false,
      doMulligan,
      selectCard: storeSelectCard,
      hoverTile: storeHoverTile,
      placeCard,
      doPass,
      setShowTransition,
      announce: storeAnnounce,
      resetToHome,
    }),
    [
      filteredGameState,
      definitions,
      validMoves,
      selectedCardId,
      hoveredTilePosition,
      isMyTurn,
      myHand,
      announcement,
      doMulligan,
      storeSelectCard,
      storeHoverTile,
      placeCard,
      doPass,
      setShowTransition,
      storeAnnounce,
      resetToHome,
    ],
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}
