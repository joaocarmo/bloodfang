import { DECK_SIZE } from '@bloodfang/engine';
import { act } from '@testing-library/react';
import { useDeckStore } from '../../store/deck-store.ts';
import { renderWithProviders, resetStores, screen, TEST_DECK_A } from '../../test-utils.tsx';
import { DeckBuilder } from './deck-builder.tsx';

beforeEach(() => {
  resetStores();
});

describe('DeckBuilder', () => {
  it('renders heading with player number', () => {
    renderWithProviders(
      <DeckBuilder
        playerNumber={1}
        onConfirm={() => {
          /* noop */
        }}
      />,
    );
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Player 1');
  });

  it('confirm button shows 0/15 and is aria-disabled', () => {
    renderWithProviders(
      <DeckBuilder
        playerNumber={1}
        onConfirm={() => {
          /* noop */
        }}
      />,
    );
    const confirmBtn = screen.getByRole('button', { name: /Confirm/i });
    expect(confirmBtn).toHaveTextContent(`0/${String(DECK_SIZE)}`);
    expect(confirmBtn).toHaveAttribute('aria-disabled', 'true');
  });

  it('clears deck store on mount', () => {
    useDeckStore.getState().addCard('hoplite-guard');
    expect(useDeckStore.getState().selectedCards).toHaveLength(1);

    renderWithProviders(
      <DeckBuilder
        playerNumber={1}
        onConfirm={() => {
          /* noop */
        }}
      />,
    );

    // useEffect clears on mount
    expect(useDeckStore.getState().selectedCards).toHaveLength(0);
  });

  it('clicking a catalog card adds it to the deck', async () => {
    const { user } = renderWithProviders(
      <DeckBuilder
        playerNumber={1}
        onConfirm={() => {
          /* noop */
        }}
      />,
    );

    // Find a specific card button by its aria-label
    const cardBtn = screen.getByRole('button', { name: /Hoplite Guard/i });
    await user.click(cardBtn);

    expect(useDeckStore.getState().selectedCards).toHaveLength(1);
    const confirmBtn = screen.getByRole('button', { name: /Confirm/i });
    expect(confirmBtn).toHaveTextContent(`1/${String(DECK_SIZE)}`);
  });

  it('clicking slot remove button removes card from deck', async () => {
    const { user } = renderWithProviders(
      <DeckBuilder
        playerNumber={2}
        onConfirm={() => {
          /* noop */
        }}
      />,
    );

    // Add card after mount-clear has run
    act(() => {
      useDeckStore.getState().addCard('hoplite-guard');
    });

    const removeBtn = screen.getByRole('button', { name: /Remove .* from deck/i });
    await user.click(removeBtn);

    expect(useDeckStore.getState().selectedCards).toHaveLength(0);
  });

  it('clear button resets deck', async () => {
    const { user } = renderWithProviders(
      <DeckBuilder
        playerNumber={1}
        onConfirm={() => {
          /* noop */
        }}
      />,
    );

    // Add a few cards via store (after mount clear)
    act(() => {
      useDeckStore.getState().addCard('hoplite-guard');
      useDeckStore.getState().addCard('siren-queen');
    });
    expect(useDeckStore.getState().selectedCards).toHaveLength(2);

    const clearBtn = screen.getByRole('button', { name: /Clear/i });
    await user.click(clearBtn);

    expect(useDeckStore.getState().selectedCards).toHaveLength(0);
  });

  it('confirm calls onConfirm when deck is full', async () => {
    const onConfirm = vi.fn();
    const { user } = renderWithProviders(<DeckBuilder playerNumber={1} onConfirm={onConfirm} />);

    // Fill the deck after mount-clear
    act(() => {
      useDeckStore.getState().setCards(TEST_DECK_A);
    });
    expect(useDeckStore.getState().selectedCards).toHaveLength(DECK_SIZE);

    const confirmBtn = screen.getByRole('button', { name: /Confirm/i });
    await user.click(confirmBtn);

    expect(onConfirm).toHaveBeenCalledWith(TEST_DECK_A);
  });
});
