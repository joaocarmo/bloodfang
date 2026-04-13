import { getAllGameDefinitions } from '@bloodfang/engine';
import { act } from '@testing-library/react';
import type { ReactNode } from 'react';
import { renderWithProviders, resetStores, screen, waitFor } from '../../test-utils.tsx';
import { CardDetail } from './card-detail.tsx';
import { CardPreviewTrigger } from './card-preview-trigger.tsx';

// Mock AnimatePresence so exit animations don't keep elements in the DOM
vi.mock('motion/react', async () => {
  const actual = await vi.importActual<typeof import('motion/react')>('motion/react');
  return {
    ...actual,
    AnimatePresence: ({ children }: { children: ReactNode }) => children,
  };
});

const definitions = getAllGameDefinitions();
const testDef = definitions['hoplite-guard'];
if (!testDef) throw new Error('hoplite-guard definition not found');

beforeEach(() => {
  resetStores();
  vi.useFakeTimers({ shouldAdvanceTime: true });
});

afterEach(() => {
  vi.useRealTimers();
});

describe('CardDetail', () => {
  it('renders card name, rank, and power', () => {
    renderWithProviders(<CardDetail definition={testDef} effectivePower={undefined} />);

    expect(screen.getByRole('article')).toBeInTheDocument();
    expect(screen.getByText('Hoplite Guard')).toBeInTheDocument();
  });

  it('renders with effective power when provided', () => {
    renderWithProviders(<CardDetail definition={testDef} effectivePower={10} />);

    const card = screen.getByRole('article');
    expect(card).toHaveAttribute('aria-label', expect.stringContaining('10'));
  });

  it('renders range grid', () => {
    renderWithProviders(<CardDetail definition={testDef} effectivePower={undefined} />);

    expect(screen.getByRole('img', { name: /Range/i })).toBeInTheDocument();
  });
});

describe('CardPreviewTrigger hover (desktop)', () => {
  // Ensure matchMedia reports fine pointer (desktop) for these tests
  beforeEach(() => {
    Object.defineProperty(window, 'innerWidth', { value: 1024, writable: true });
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      onchange: null,
      dispatchEvent: vi.fn(),
    }));
  });

  it('shows popup on mouse enter after delay', async () => {
    const { user } = renderWithProviders(
      <CardPreviewTrigger definition={testDef}>
        <button type="button">Hover me</button>
      </CardPreviewTrigger>,
    );

    await user.hover(screen.getByText('Hover me'));
    act(() => {
      vi.advanceTimersByTime(250);
    });

    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toBeInTheDocument();
    });
  });

  it('does not show popup before delay completes', async () => {
    const { user } = renderWithProviders(
      <CardPreviewTrigger definition={testDef}>
        <button type="button">Hover me</button>
      </CardPreviewTrigger>,
    );

    await user.hover(screen.getByText('Hover me'));
    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('hides popup on mouse leave', async () => {
    const { user } = renderWithProviders(
      <CardPreviewTrigger definition={testDef}>
        <button type="button">Hover me</button>
      </CardPreviewTrigger>,
    );

    await user.hover(screen.getByText('Hover me'));
    act(() => {
      vi.advanceTimersByTime(250);
    });

    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toBeInTheDocument();
    });

    await user.unhover(screen.getByText('Hover me'));
    act(() => {
      vi.advanceTimersByTime(500);
    });

    await waitFor(() => {
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });
  });

  it('does not interfere with child click handlers', async () => {
    const onClick = vi.fn();
    const { user } = renderWithProviders(
      <CardPreviewTrigger definition={testDef}>
        <button type="button" onClick={onClick}>
          Click me
        </button>
      </CardPreviewTrigger>,
    );

    await user.click(screen.getByText('Click me'));
    expect(onClick).toHaveBeenCalledOnce();
  });
});

describe('CardPreviewTrigger touch/small screen dialog', () => {
  beforeEach(() => {
    // Simulate small/touch screen
    Object.defineProperty(window, 'innerWidth', { value: 375, writable: true });
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: query === '(pointer: coarse)',
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      onchange: null,
      dispatchEvent: vi.fn(),
    }));
  });

  it('opens card detail dialog on click', async () => {
    const { user } = renderWithProviders(
      <CardPreviewTrigger definition={testDef} touchAction={vi.fn()} touchActionLabel="Add">
        <button type="button">Tap me</button>
      </CardPreviewTrigger>,
    );

    await user.click(screen.getByText('Tap me'));

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
    expect(screen.getByText('Hoplite Guard')).toBeInTheDocument();
  });

  it('shows action button with label in dialog', async () => {
    const { user } = renderWithProviders(
      <CardPreviewTrigger definition={testDef} touchAction={vi.fn()} touchActionLabel="Add to Deck">
        <button type="button">Tap me</button>
      </CardPreviewTrigger>,
    );

    await user.click(screen.getByText('Tap me'));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Add to Deck' })).toBeInTheDocument();
    });
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
  });

  it('calls action and closes dialog when action button is clicked', async () => {
    const action = vi.fn();
    const { user } = renderWithProviders(
      <CardPreviewTrigger definition={testDef} touchAction={action} touchActionLabel="Add to Deck">
        <button type="button">Tap me</button>
      </CardPreviewTrigger>,
    );

    await user.click(screen.getByText('Tap me'));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Add to Deck' })).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: 'Add to Deck' }));

    expect(action).toHaveBeenCalledOnce();
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('closes dialog when close button is clicked', async () => {
    const { user } = renderWithProviders(
      <CardPreviewTrigger definition={testDef} touchAction={vi.fn()} touchActionLabel="Add">
        <button type="button">Tap me</button>
      </CardPreviewTrigger>,
    );

    await user.click(screen.getByText('Tap me'));

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: 'Close' }));

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('does not open dialog when no touchAction is provided', async () => {
    const onClick = vi.fn();
    const { user } = renderWithProviders(
      <CardPreviewTrigger definition={testDef}>
        <button type="button" onClick={onClick}>
          Tap me
        </button>
      </CardPreviewTrigger>,
    );

    await user.click(screen.getByText('Tap me'));

    // Without touchAction, no dialog opens — click passes through to children
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(onClick).toHaveBeenCalledOnce();
  });
});
