import { useGameStore } from '../../store/game-store.ts';
import { MulliganScreen } from './mulligan-screen.tsx';
import {
  renderWithProviders,
  resetStores,
  screen,
  createMulliganState,
} from '../../test-utils.tsx';

beforeEach(() => {
  resetStores();
  useGameStore.setState({ gameState: createMulliganState() });
});

describe('MulliganScreen', () => {
  it('renders heading with current player', () => {
    renderWithProviders(<MulliganScreen />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/Player 1 — Mulligan/);
  });

  it('renders hand cards as buttons with aria-pressed=false', () => {
    renderWithProviders(<MulliganScreen />);
    const cardButtons = screen.getAllByRole('button', { pressed: false });
    // Player starts with a 5-card hand
    expect(cardButtons.length).toBe(5);
  });

  it('clicking a card toggles aria-pressed', async () => {
    const { user } = renderWithProviders(<MulliganScreen />);

    const cardButtons = screen.getAllByRole('button', { pressed: false });
    const firstCard = cardButtons[0]!;

    await user.click(firstCard);
    expect(firstCard).toHaveAttribute('aria-pressed', 'true');

    await user.click(firstCard);
    expect(firstCard).toHaveAttribute('aria-pressed', 'false');
  });

  it('shows "Return N Cards" button when cards are selected', async () => {
    const { user } = renderWithProviders(<MulliganScreen />);

    // Initially no return button
    expect(screen.queryByRole('button', { name: /Return/i })).not.toBeInTheDocument();

    const cardButtons = screen.getAllByRole('button', { pressed: false });
    await user.click(cardButtons[0]!);

    expect(screen.getByRole('button', { name: /Return 1 Card/i })).toBeInTheDocument();

    await user.click(cardButtons[1]!);

    expect(screen.getByRole('button', { name: /Return 2 Cards/i })).toBeInTheDocument();
  });

  it('Keep All advances game state', async () => {
    const { user } = renderWithProviders(<MulliganScreen />);

    const keepBtn = screen.getByRole('button', { name: /Keep All/i });
    await user.click(keepBtn);

    const state = useGameStore.getState().gameState;
    expect(state).not.toBeNull();
    // Player 0 has mulliganed, now player 1's turn
    expect(state!.players[0]!.mulliganUsed).toBe(true);
  });

  it('Return N Cards advances with selected card IDs', async () => {
    const { user } = renderWithProviders(<MulliganScreen />);

    const cardButtons = screen.getAllByRole('button', { pressed: false });
    await user.click(cardButtons[0]!);
    await user.click(cardButtons[1]!);

    const returnBtn = screen.getByRole('button', { name: /Return 2 Cards/i });
    await user.click(returnBtn);

    const state = useGameStore.getState().gameState;
    expect(state).not.toBeNull();
    expect(state!.players[0]!.mulliganUsed).toBe(true);
  });
});
