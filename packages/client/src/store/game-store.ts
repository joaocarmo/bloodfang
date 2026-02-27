import { useMemo } from 'react';
import { create } from 'zustand';
import { t } from '@lingui/core/macro';
import type { CardDefinition, GameState, PlayerId, Position } from '@bloodfang/engine';
import {
  createGame,
  mulligan,
  playCard,
  pass,
  getValidMoves,
  getAllGameDefinitions,
  calculateFinalScores,
  determineWinner,
} from '@bloodfang/engine';
import { getCardName } from '../lib/card-identity.ts';

interface GameStore {
  definitions: Record<string, CardDefinition>;
  gameState: GameState | null;

  // UI interaction
  selectedCardId: string | null;
  hoveredTilePosition: Position | null;

  // Decks
  playerDecks: [string[], string[]];
  setPlayerDeck: (player: PlayerId, deck: string[]) => void;

  // Announcements for screen readers
  announcement: string;
  announce: (message: string) => void;

  // Actions
  startGame: () => void;
  doMulligan: (player: PlayerId, returnCardIds: string[]) => void;
  selectCard: (cardId: string | null) => void;
  hoverTile: (position: Position | null) => void;
  placeCard: (position: Position) => void;
  doPass: () => void;
  resetToHome: () => void;

  // Hot-seat transition
  showTransition: boolean;
  setShowTransition: (show: boolean) => void;

  // Exit confirmation
  showExitConfirm: boolean;
  setShowExitConfirm: (show: boolean) => void;
  confirmExitToHome: () => void;
}

export const useGameStore = create<GameStore>((set, get) => {
  const definitions = getAllGameDefinitions();

  return {
    definitions,
    gameState: null,

    selectedCardId: null,
    hoveredTilePosition: null,

    playerDecks: [[], []],
    setPlayerDeck: (player, deck) =>
      set((state) => {
        const decks = [...state.playerDecks] as [string[], string[]];
        decks[player] = deck;
        return { playerDecks: decks };
      }),

    announcement: '',
    announce: (message) => set({ announcement: message }),

    startGame: () => {
      const { playerDecks, definitions: defs } = get();
      try {
        const gameState = createGame(playerDecks[0], playerDecks[1], defs);
        set({
          gameState,
          selectedCardId: null,
          hoveredTilePosition: null,
          showTransition: false,
        });
        get().announce(t`Game started. Mulligan phase. Player 1, select cards to return.`);
      } catch (e) {
        const reason = e instanceof Error ? e.message : t`Unknown error`;
        get().announce(t`Failed to start game: ${reason}`);
      }
    },

    doMulligan: (player, returnCardIds) => {
      const { gameState } = get();
      if (!gameState) return;
      const newState = mulligan(gameState, player, returnCardIds);
      set({ gameState: newState, selectedCardId: null });

      if (newState.phase === 'playing') {
        const p = newState.currentPlayerIndex + 1;
        get().announce(t`Mulligan complete. Player ${p}'s turn.`);
        set({ showTransition: true });
      } else {
        const nextPlayer = player === 0 ? 1 : 0;
        const pDone = player + 1;
        const pNext = nextPlayer + 1;
        get().announce(
          t`Player ${pDone} mulligan complete. Player ${pNext}, select cards to return.`,
        );
        set({ showTransition: true });
      }
    },

    selectCard: (cardId) => set({ selectedCardId: cardId }),

    hoverTile: (position) => set({ hoveredTilePosition: position }),

    placeCard: (position) => {
      const { gameState, selectedCardId, definitions: defs } = get();
      if (!gameState || !selectedCardId) return;

      const prevPlayer = gameState.currentPlayerIndex;
      const newState = playCard(gameState, selectedCardId, position);
      const cardDef = defs[selectedCardId];
      const cardName = cardDef ? getCardName(cardDef.id) : selectedCardId;

      set({
        gameState: newState,
        selectedCardId: null,
        hoveredTilePosition: null,
      });

      const pNum = prevPlayer + 1;
      const rowNum = position.row + 1;
      const colNum = position.col + 1;
      get().announce(t`Player ${pNum} played ${cardName} at row ${rowNum}, column ${colNum}.`);

      if (newState.phase === 'ended') {
        const scores = calculateFinalScores(newState);
        const winner = determineWinner(scores);
        const winMsg =
          winner !== null
            ? t`Player ${winner + 1} wins ${scores[winner]} to ${scores[winner === 0 ? 1 : 0]}.`
            : t`Draw! ${scores[0]} to ${scores[1]}.`;
        get().announce(t`Game over. ${winMsg}`);
      } else if (newState.currentPlayerIndex !== prevPlayer) {
        set({ showTransition: true });
        const nextP = newState.currentPlayerIndex + 1;
        get().announce(t`Player ${nextP}'s turn.`);
      }
    },

    doPass: () => {
      const { gameState } = get();
      if (!gameState) return;

      const prevPlayer = gameState.currentPlayerIndex;
      const newState = pass(gameState);
      set({ gameState: newState, selectedCardId: null });

      const passP = prevPlayer + 1;
      get().announce(t`Player ${passP} passed.`);

      if (newState.phase === 'ended') {
        const scores = calculateFinalScores(newState);
        const winner = determineWinner(scores);
        const winMsg =
          winner !== null
            ? t`Player ${winner + 1} wins ${scores[winner]} to ${scores[winner === 0 ? 1 : 0]}.`
            : t`Draw! ${scores[0]} to ${scores[1]}.`;
        get().announce(t`Game over. ${winMsg}`);
      } else {
        set({ showTransition: true });
        const nextP = newState.currentPlayerIndex + 1;
        get().announce(t`Player ${nextP}'s turn.`);
      }
    },

    resetToHome: () =>
      set({
        gameState: null,
        selectedCardId: null,
        hoveredTilePosition: null,
        playerDecks: [[], []],
        showTransition: false,
        showExitConfirm: false,
      }),

    showTransition: false,
    setShowTransition: (show) => set({ showTransition: show }),

    showExitConfirm: false,
    setShowExitConfirm: (show) => set({ showExitConfirm: show }),
    confirmExitToHome: () =>
      set({
        gameState: null,
        selectedCardId: null,
        hoveredTilePosition: null,
        playerDecks: [[], []],
        showTransition: false,
        showExitConfirm: false,
      }),
  };
});

// Selector helpers
export function useValidMoves() {
  const gameState = useGameStore((s) => s.gameState);
  // useMemo prevents the infinite re-render that a raw Zustand selector would cause
  // (getValidMoves returns new array refs, failing Object.is equality)
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useMemo(() => {
    if (!gameState || gameState.phase !== 'playing') return [];
    return getValidMoves(gameState);
  }, [gameState]);
}

export function useCurrentPlayer(): PlayerId {
  return useGameStore((s) => s.gameState?.currentPlayerIndex ?? 0);
}
