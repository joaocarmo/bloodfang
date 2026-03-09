import type { ReactElement } from 'react';
import { render } from '@testing-library/react';
import { screen, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nProvider } from '@lingui/react';
import { i18n } from './i18n.ts';
import { useGameStore } from './store/game-store.ts';
import { useDeckStore } from './store/deck-store.ts';
import type { GameState } from '@bloodfang/engine';
import { createGame, mulligan, createSeededRng, getAllGameDefinitions } from '@bloodfang/engine';

// ── Providers ────────────────────────────────────────────────────────────

function Providers({ children }: { children: React.ReactNode }) {
  return <I18nProvider i18n={i18n}>{children}</I18nProvider>;
}

export function renderWithProviders(ui: ReactElement) {
  const user = userEvent.setup();
  return { user, ...render(ui, { wrapper: Providers }) };
}

// ── Store helpers ────────────────────────────────────────────────────────

const gameStoreInitial = useGameStore.getState();
const deckStoreInitial = useDeckStore.getState();

export function resetStores() {
  useGameStore.setState(gameStoreInitial, true);
  useDeckStore.setState(deckStoreInitial, true);
}

// ── Game state factories ─────────────────────────────────────────────────

const definitions = getAllGameDefinitions();
const nonTokenIds = Object.values(definitions)
  .filter((d) => !d.isToken)
  .map((d) => d.id);

/** 15 unique non-token card IDs for a valid deck */
export const TEST_DECK_A = nonTokenIds.slice(0, 15);
/** 15 different unique non-token card IDs for a second deck */
export const TEST_DECK_B = nonTokenIds.slice(15, 30);

/** Returns a GameState in the Mulligan phase */
export function createMulliganState(): GameState {
  const rng = createSeededRng(42);
  return createGame(TEST_DECK_A, TEST_DECK_B, definitions, undefined, rng);
}

/** Returns a GameState in the Playing phase (both players have mulliganed) */
export function createPlayingState(): GameState {
  const rng = createSeededRng(42);
  let state = createGame(TEST_DECK_A, TEST_DECK_B, definitions, undefined, rng);
  state = mulligan(state, 0, [], rng);
  state = mulligan(state, 1, [], rng);
  return state;
}

// ── Re-exports ───────────────────────────────────────────────────────────

export { screen, within, waitFor };
