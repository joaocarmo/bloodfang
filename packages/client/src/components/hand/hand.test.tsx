import { useGameStore } from '../../store/game-store.ts';
import { Hand } from './hand.tsx';
import { renderWithProviders, resetStores, screen, createPlayingState } from '../../test-utils.tsx';

beforeEach(() => {
  resetStores();
  useGameStore.setState({ gameState: createPlayingState() });
});

describe('Hand', () => {
  it('renders listbox with card options', () => {
    renderWithProviders(<Hand />);
    const listbox = screen.getByRole('listbox');
    expect(listbox).toBeInTheDocument();

    const state = useGameStore.getState().gameState!;
    const handSize = state.players[state.currentPlayerIndex]!.hand.length;
    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(handSize);
  });

  it('shows empty message when no cards in hand', () => {
    const state = createPlayingState();
    const current = state.currentPlayerIndex;
    const emptyState = {
      ...state,
      players: [
        current === 0 ? { ...state.players[0]!, hand: [] as string[] } : state.players[0]!,
        current === 1 ? { ...state.players[1]!, hand: [] as string[] } : state.players[1]!,
      ] as const,
    };
    useGameStore.setState({ gameState: emptyState });

    renderWithProviders(<Hand />);
    expect(screen.getByText(/No cards in hand/i)).toBeInTheDocument();
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('clicking a card selects it', async () => {
    const { user } = renderWithProviders(<Hand />);

    const options = screen.getAllByRole('option');
    const first = options[0]!;
    await user.click(first);

    expect(first).toHaveAttribute('aria-selected', 'true');
    expect(useGameStore.getState().selectedCardId).not.toBeNull();
  });

  it('clicking a selected card deselects it', async () => {
    const { user } = renderWithProviders(<Hand />);

    const options = screen.getAllByRole('option');
    const first = options[0]!;

    await user.click(first);
    expect(first).toHaveAttribute('aria-selected', 'true');

    await user.click(first);
    expect(first).toHaveAttribute('aria-selected', 'false');
    expect(useGameStore.getState().selectedCardId).toBeNull();
  });

  it('ArrowRight moves focus to next card', async () => {
    const { user } = renderWithProviders(<Hand />);

    const options = screen.getAllByRole('option');
    const first = options[0]!;
    first.focus();

    await user.keyboard('{ArrowRight}');

    expect(options[1]).toHaveFocus();
  });

  it('ArrowLeft moves focus backward', async () => {
    const { user } = renderWithProviders(<Hand />);

    const options = screen.getAllByRole('option');
    // Navigate right first to land on index 1, then navigate left
    options[0]!.focus();
    await user.keyboard('{ArrowRight}');
    expect(options[1]).toHaveFocus();

    await user.keyboard('{ArrowLeft}');
    expect(options[0]).toHaveFocus();
  });

  it('Escape deselects card', async () => {
    const { user } = renderWithProviders(<Hand />);

    const options = screen.getAllByRole('option');
    await user.click(options[0]!);
    expect(useGameStore.getState().selectedCardId).not.toBeNull();

    await user.keyboard('{Escape}');
    expect(useGameStore.getState().selectedCardId).toBeNull();
  });
});
