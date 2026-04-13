import type { CardId, CardRank } from '@bloodfang/engine';
import { DECK_SIZE } from '@bloodfang/engine';
import { create } from 'zustand';

interface DeckStore {
  selectedCards: CardId[];
  searchQuery: string;
  rankFilter: CardRank | null;

  addCard: (definitionId: CardId) => void;
  removeCard: (definitionId: CardId) => void;
  setCards: (cardIds: CardId[]) => void;
  clear: () => void;
  setSearchQuery: (query: string) => void;
  setRankFilter: (rank: CardRank | null) => void;

  isDeckFull: () => boolean;
}

export const useDeckStore = create<DeckStore>((set, get) => ({
  selectedCards: [],
  searchQuery: '',
  rankFilter: null,

  addCard: (definitionId) => {
    set((state) => {
      if (state.selectedCards.length >= DECK_SIZE) return state;
      if (state.selectedCards.includes(definitionId)) return state;
      return { selectedCards: [...state.selectedCards, definitionId] };
    });
  },

  removeCard: (definitionId) => {
    set((state) => ({
      selectedCards: state.selectedCards.filter((id) => id !== definitionId),
    }));
  },

  setCards: (cardIds) => {
    set({ selectedCards: cardIds.slice(0, DECK_SIZE) });
  },

  clear: () => {
    set({ selectedCards: [], searchQuery: '', rankFilter: null });
  },

  setSearchQuery: (query) => {
    set({ searchQuery: query });
  },
  setRankFilter: (rank) => {
    set({ rankFilter: rank });
  },

  isDeckFull: () => get().selectedCards.length >= DECK_SIZE,
}));
