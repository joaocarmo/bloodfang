import { create } from 'zustand';
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

type Screen = 'home' | 'setup' | 'game' | 'results';

interface GameStore {
  screen: Screen;
  setScreen: (screen: Screen) => void;

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
}

export const useGameStore = create<GameStore>((set, get) => {
  const definitions = getAllGameDefinitions();

  return {
    screen: 'home',
    setScreen: (screen) => set({ screen }),

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
      const gameState = createGame(playerDecks[0], playerDecks[1], defs);
      set({
        gameState,
        screen: 'game',
        selectedCardId: null,
        hoveredTilePosition: null,
        showTransition: false,
      });
      get().announce('Game started. Mulligan phase. Player 1, select cards to return.');
    },

    doMulligan: (player, returnCardIds) => {
      const { gameState } = get();
      if (!gameState) return;
      const newState = mulligan(gameState, player, returnCardIds);
      set({ gameState: newState, selectedCardId: null });

      if (newState.phase === 'playing') {
        get().announce("Mulligan complete. Player 1's turn.");
        set({ showTransition: true });
      } else {
        get().announce(`Player ${player + 1} mulligan complete. Player ${player === 0 ? 2 : 1}, select cards to return.`);
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
      const cardDef = defs[selectedCardId.split(':')[0] ?? ''];
      const cardName = cardDef ? getCardName(cardDef.id) : selectedCardId;

      set({
        gameState: newState,
        selectedCardId: null,
        hoveredTilePosition: null,
      });

      get().announce(
        `Player ${prevPlayer + 1} played ${cardName} at row ${position.row + 1}, column ${position.col + 1}.`,
      );

      if (newState.phase === 'ended') {
        const scores = calculateFinalScores(newState);
        const winner = determineWinner(scores);
        const winMsg =
          winner !== null
            ? `Player ${winner + 1} wins ${scores[winner]} to ${scores[winner === 0 ? 1 : 0]}.`
            : `Draw! ${scores[0]} to ${scores[1]}.`;
        get().announce(`Game over. ${winMsg}`);
        set({ screen: 'results' });
      } else if (newState.currentPlayerIndex !== prevPlayer) {
        set({ showTransition: true });
        get().announce(`Player ${newState.currentPlayerIndex + 1}'s turn.`);
      }
    },

    doPass: () => {
      const { gameState } = get();
      if (!gameState) return;

      const prevPlayer = gameState.currentPlayerIndex;
      const newState = pass(gameState);
      set({ gameState: newState, selectedCardId: null });

      get().announce(`Player ${prevPlayer + 1} passed.`);

      if (newState.phase === 'ended') {
        const scores = calculateFinalScores(newState);
        const winner = determineWinner(scores);
        const winMsg =
          winner !== null
            ? `Player ${winner + 1} wins ${scores[winner]} to ${scores[winner === 0 ? 1 : 0]}.`
            : `Draw! ${scores[0]} to ${scores[1]}.`;
        get().announce(`Game over. ${winMsg}`);
        set({ screen: 'results' });
      } else {
        set({ showTransition: true });
        get().announce(`Player ${newState.currentPlayerIndex + 1}'s turn.`);
      }
    },

    resetToHome: () =>
      set({
        screen: 'home',
        gameState: null,
        selectedCardId: null,
        hoveredTilePosition: null,
        playerDecks: [[], []],
        showTransition: false,
      }),

    showTransition: false,
    setShowTransition: (show) => set({ showTransition: show }),
  };
});

// Selector helpers
export function useValidMoves() {
  return useGameStore((s) => {
    if (!s.gameState || s.gameState.phase !== 'playing') return [];
    return getValidMoves(s.gameState);
  });
}

export function useCurrentPlayer(): PlayerId {
  return useGameStore((s) => s.gameState?.currentPlayerIndex ?? 0);
}
