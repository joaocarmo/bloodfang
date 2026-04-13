import { CardId, GamePhase } from '@bloodfang/engine';
import { useOnlineGameStore } from '../../store/online-game-store.ts';
import {
  createOnlinePlayingState,
  renderWithOnlineProviders,
  resetStores,
  screen,
} from '../../test-utils.tsx';
import { PassButton } from './pass-button.tsx';

beforeEach(() => {
  resetStores();
});

describe('PassButton', () => {
  it('shows "Pass" when there are valid moves and it is my turn', () => {
    const state = createOnlinePlayingState();
    const myTurnState = { ...state, currentPlayerIndex: 0 as const };

    useOnlineGameStore.setState({
      filteredGameState: myTurnState,
      connectionStatus: 'connected',
      opponentConnected: true,
      validMoves: [{ cardId: CardId.HopliteGuard, positions: [{ row: 0, col: 0 }] }],
    });

    renderWithOnlineProviders(<PassButton />);

    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('Pass');
    expect(button).not.toHaveTextContent('No Moves');
  });

  it('shows "Pass (No Moves)" when no valid moves', () => {
    const state = createOnlinePlayingState();
    const myTurnState = { ...state, currentPlayerIndex: 0 as const };

    useOnlineGameStore.setState({
      filteredGameState: myTurnState,
      connectionStatus: 'connected',
      opponentConnected: true,
      validMoves: [],
    });

    renderWithOnlineProviders(<PassButton />);

    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('Pass (No Moves)');
  });

  it('has aria-disabled when not my turn', () => {
    const state = createOnlinePlayingState();
    const opponentTurnState = { ...state, currentPlayerIndex: 1 as const };

    useOnlineGameStore.setState({
      filteredGameState: opponentTurnState,
      connectionStatus: 'connected',
      opponentConnected: true,
    });

    renderWithOnlineProviders(<PassButton />);

    const button = screen.getByRole('button', { name: /Pass/i });
    expect(button).toHaveAttribute('aria-disabled', 'true');
    expect(button.className).toContain('opacity-50');
    expect(button.className).toContain('cursor-not-allowed');
  });

  it('clicking when not my turn does not trigger pass', async () => {
    const state = createOnlinePlayingState();
    const opponentTurnState = { ...state, currentPlayerIndex: 1 as const };

    const sendMock = vi.fn();
    useOnlineGameStore.setState({
      filteredGameState: opponentTurnState,
      connectionStatus: 'connected',
      opponentConnected: true,
      _send: sendMock,
    });

    const { user } = renderWithOnlineProviders(<PassButton />);

    const button = screen.getByRole('button', { name: /Pass/i });
    await user.click(button);

    expect(sendMock).not.toHaveBeenCalled();
  });

  it('renders nothing when game is not in Playing phase', () => {
    const state = createOnlinePlayingState();
    const mulliganState = { ...state, phase: GamePhase.Mulligan };

    useOnlineGameStore.setState({
      filteredGameState: mulliganState,
      connectionStatus: 'connected',
      opponentConnected: true,
    });

    const { container } = renderWithOnlineProviders(<PassButton />);

    expect(container.innerHTML).toBe('');
  });
});
