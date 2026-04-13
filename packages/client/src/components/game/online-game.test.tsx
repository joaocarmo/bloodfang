import { CardId } from '@bloodfang/engine';
import { useOnlineGameStore } from '../../store/online-game-store.ts';
import {
  createOnlinePlayingState,
  renderWithOnlineProviders,
  resetStores,
  screen,
} from '../../test-utils.tsx';
import { Hand } from '../hand/hand.tsx';
import { PassButton } from './pass-button.tsx';
import { TurnIndicator } from './turn-indicator.tsx';

beforeEach(() => {
  resetStores();
});

describe('Online game - Hand when not my turn', () => {
  it('dims the hand when it is the opponent turn', () => {
    const state = createOnlinePlayingState();
    // Ensure it is the opponent's turn (currentPlayerIndex = 1)
    const opponentTurnState = { ...state, currentPlayerIndex: 1 as const };

    useOnlineGameStore.setState({
      filteredGameState: opponentTurnState,
      connectionStatus: 'connected',
      opponentConnected: true,
    });

    renderWithOnlineProviders(<Hand />);

    const listbox = screen.getByRole('listbox');
    expect(listbox.className).toContain('opacity-50');
    expect(listbox.className).toContain('pointer-events-none');
  });

  it('shows "Waiting for opponent" sr-only text when not my turn', () => {
    const state = createOnlinePlayingState();
    const opponentTurnState = { ...state, currentPlayerIndex: 1 as const };

    useOnlineGameStore.setState({
      filteredGameState: opponentTurnState,
      connectionStatus: 'connected',
      opponentConnected: true,
    });

    renderWithOnlineProviders(<Hand />);

    expect(screen.getByText(/Waiting for opponent/i)).toBeInTheDocument();
  });

  it('does not dim the hand when it is my turn', () => {
    const state = createOnlinePlayingState();
    // Ensure it is my turn (currentPlayerIndex = 0)
    const myTurnState = { ...state, currentPlayerIndex: 0 as const };

    useOnlineGameStore.setState({
      filteredGameState: myTurnState,
      connectionStatus: 'connected',
      opponentConnected: true,
      validMoves: [
        {
          cardId: myTurnState.players[0].hand[0] ?? CardId.HopliteGuard,
          positions: [{ row: 0, col: 0 }],
        },
      ],
    });

    renderWithOnlineProviders(<Hand />);

    const listbox = screen.getByRole('listbox');
    expect(listbox.className).not.toContain('opacity-50');
  });
});

describe('Online game - hand card count heading', () => {
  it('shows "Your Hand (N)" heading with card count', () => {
    const state = createOnlinePlayingState();

    useOnlineGameStore.setState({
      filteredGameState: state,
      connectionStatus: 'connected',
      opponentConnected: true,
    });

    renderWithOnlineProviders(<Hand />);

    const handSize = state.players[0].hand.length;
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveTextContent(`Your Hand (${String(handSize)})`);
  });
});

describe('Online game - PassButton', () => {
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
  });

  it('does not have aria-disabled when it is my turn', () => {
    const state = createOnlinePlayingState();
    const myTurnState = { ...state, currentPlayerIndex: 0 as const };

    useOnlineGameStore.setState({
      filteredGameState: myTurnState,
      connectionStatus: 'connected',
      opponentConnected: true,
    });

    renderWithOnlineProviders(<PassButton />);

    const button = screen.getByRole('button', { name: /Pass/i });
    expect(button).not.toHaveAttribute('aria-disabled', 'true');
  });

  it('does not call doPass when clicked while not my turn', async () => {
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
});

describe('Online game - TurnIndicator', () => {
  it('shows "Your Turn" when it is my turn', () => {
    const state = createOnlinePlayingState();
    const myTurnState = { ...state, currentPlayerIndex: 0 as const };

    useOnlineGameStore.setState({
      filteredGameState: myTurnState,
      connectionStatus: 'connected',
      opponentConnected: true,
    });

    renderWithOnlineProviders(<TurnIndicator />);

    expect(screen.getByText(/Your Turn/)).toBeInTheDocument();
  });

  it('shows "Opponent\'s Turn" when it is the opponent turn', () => {
    const state = createOnlinePlayingState();
    const opponentTurnState = { ...state, currentPlayerIndex: 1 as const };

    useOnlineGameStore.setState({
      filteredGameState: opponentTurnState,
      connectionStatus: 'connected',
      opponentConnected: true,
    });

    renderWithOnlineProviders(<TurnIndicator />);

    expect(screen.getByText(/Opponent/)).toBeInTheDocument();
  });

  it('shows turn number', () => {
    const state = createOnlinePlayingState();

    useOnlineGameStore.setState({
      filteredGameState: state,
      connectionStatus: 'connected',
      opponentConnected: true,
    });

    renderWithOnlineProviders(<TurnIndicator />);

    expect(screen.getByText(new RegExp(`Turn ${String(state.turnNumber)}`))).toBeInTheDocument();
  });
});

describe('Online game - returns null when no game state', () => {
  it('TurnIndicator returns null when no game state', () => {
    useOnlineGameStore.setState({ filteredGameState: null });

    const { container } = renderWithOnlineProviders(<TurnIndicator />);

    expect(container.innerHTML).toBe('');
  });

  it('PassButton returns null when no game state', () => {
    useOnlineGameStore.setState({ filteredGameState: null });

    const { container } = renderWithOnlineProviders(<PassButton />);

    expect(container.innerHTML).toBe('');
  });
});
