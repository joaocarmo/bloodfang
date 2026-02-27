import { useGameStore } from '../../store/game-store.ts';
import { LaneScores, LaneTotal } from './lane-scores.tsx';
import { renderWithProviders, resetStores, screen, createPlayingState } from '../../test-utils.tsx';

beforeEach(() => {
  resetStores();
  useGameStore.setState({ gameState: createPlayingState() });
});

describe('LaneScores', () => {
  it('renders 3 lane scores for a player', () => {
    renderWithProviders(<LaneScores player={0} side="left" />);

    const region = screen.getByRole('status', { name: /Player 1 lane scores/i });
    expect(region).toBeInTheDocument();
    // 3 rows, each with a score of 0
    expect(region.children).toHaveLength(3);
  });

  it('shows preview arrows when preview differs from current', () => {
    renderWithProviders(
      <LaneScores
        player={0}
        side="left"
        previewLaneScores={[
          [5, 0],
          [0, 0],
          [0, 0],
        ]}
      />,
    );

    const region = screen.getByRole('status', { name: /Player 1 lane scores/i });
    // First lane shows "0 → 5"
    expect(region).toHaveTextContent(/0\s*\u2192\s*5/);
  });

  it('does not show preview arrows when scores match', () => {
    renderWithProviders(
      <LaneScores
        player={0}
        side="left"
        previewLaneScores={[
          [0, 0],
          [0, 0],
          [0, 0],
        ]}
      />,
    );

    expect(screen.queryByText(/\u2192/)).not.toBeInTheDocument();
  });
});

describe('LaneTotal', () => {
  it('renders total score', () => {
    renderWithProviders(<LaneTotal player={0} side="left" />);

    const region = screen.getByRole('status', { name: /Player 1 total score/i });
    expect(region).toBeInTheDocument();
    // Initial state: all lanes are 0, so total is 0
    expect(region).toHaveTextContent('0');
  });

  it('shows preview arrow for different total', () => {
    renderWithProviders(
      <LaneTotal
        player={0}
        side="left"
        previewLaneScores={[
          [3, 0],
          [2, 0],
          [0, 0],
        ]}
      />,
    );

    const region = screen.getByRole('status', { name: /Player 1 total score/i });
    // Total shows "0 → 5"
    expect(region).toHaveTextContent(/0\s*\u2192\s*5/);
  });
});
