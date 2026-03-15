import type { CardId } from '@bloodfang/engine';
import { useGameStore } from '../../store/game-store.ts';
import { Hand } from './hand.tsx';
import {
  renderWithGameProviders,
  resetStores,
  screen,
  createPlayingState,
} from '../../test-utils.tsx';

beforeEach(() => {
  resetStores();
  useGameStore.setState({ gameState: createPlayingState() });
});

describe('Hand', () => {
  it('renders listbox with card options', () => {
    renderWithGameProviders(<Hand />);
    const listbox = screen.getByRole('listbox');
    expect(listbox).toBeInTheDocument();

    const state = useGameStore.getState().gameState;
    if (!state) throw new Error('Game state not found');
    const handSize = state.players[state.currentPlayerIndex].hand.length;
    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(handSize);
  });

  it('shows empty message when no cards in hand', () => {
    const state = createPlayingState();
    const current = state.currentPlayerIndex;
    const emptyState = {
      ...state,
      players: [
        current === 0 ? { ...state.players[0], hand: [] as CardId[] } : state.players[0],
        current === 1 ? { ...state.players[1], hand: [] as CardId[] } : state.players[1],
      ] as const,
    };
    useGameStore.setState({ gameState: emptyState });

    renderWithGameProviders(<Hand />);
    expect(screen.getByText(/No cards in hand/i)).toBeInTheDocument();
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('clicking a card selects it', async () => {
    const { user } = renderWithGameProviders(<Hand />);

    const options = screen.getAllByRole('option');
    const first = options[0];
    if (!first) throw new Error('No option found');
    await user.click(first);

    expect(first).toHaveAttribute('aria-selected', 'true');
    expect(useGameStore.getState().selectedCardId).not.toBeNull();
  });

  it('clicking a selected card deselects it', async () => {
    const { user } = renderWithGameProviders(<Hand />);

    const options = screen.getAllByRole('option');
    const first = options[0];
    if (!first) throw new Error('No option found');

    await user.click(first);
    expect(first).toHaveAttribute('aria-selected', 'true');

    await user.click(first);
    expect(first).toHaveAttribute('aria-selected', 'false');
    expect(useGameStore.getState().selectedCardId).toBeNull();
  });

  it('ArrowRight moves focus to next card', async () => {
    const { user } = renderWithGameProviders(<Hand />);

    const options = screen.getAllByRole('option');
    const first = options[0];
    if (!first) throw new Error('No option found');
    first.focus();

    await user.keyboard('{ArrowRight}');

    expect(options[1]).toHaveFocus();
  });

  it('ArrowLeft moves focus backward', async () => {
    const { user } = renderWithGameProviders(<Hand />);

    const options = screen.getAllByRole('option');
    // Navigate right first to land on index 1, then navigate left
    const firstOpt = options[0];
    if (!firstOpt) throw new Error('No option found');
    firstOpt.focus();
    await user.keyboard('{ArrowRight}');
    expect(options[1]).toHaveFocus();

    await user.keyboard('{ArrowLeft}');
    expect(options[0]).toHaveFocus();
  });

  it('Escape deselects card', async () => {
    const { user } = renderWithGameProviders(<Hand />);

    const options = screen.getAllByRole('option');
    const firstOpt = options[0];
    if (!firstOpt) throw new Error('No option found');
    await user.click(firstOpt);
    expect(useGameStore.getState().selectedCardId).not.toBeNull();

    await user.keyboard('{Escape}');
    expect(useGameStore.getState().selectedCardId).toBeNull();
  });
});
