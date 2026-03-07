import type { ReactNode } from 'react';
import { act, render } from '@testing-library/react';
import { getAllGameDefinitions } from '@bloodfang/engine';
import type { CardDefinition } from '@bloodfang/engine';
import { useCardPreview } from '../../hooks/use-card-preview.tsx';
import { CardPreviewTrigger } from './card-preview-trigger.tsx';
import { CardDetail } from './card-detail.tsx';
import { renderWithProviders, resetStores, screen, waitFor } from '../../test-utils.tsx';

// Mock AnimatePresence so exit animations don't keep elements in the DOM
vi.mock('motion/react', async () => {
  const actual = await vi.importActual<typeof import('motion/react')>('motion/react');
  return {
    ...actual,
    AnimatePresence: ({ children }: { children: ReactNode }) => children,
  };
});

const definitions = getAllGameDefinitions();
const testDef = definitions['hoplite-guard'] as CardDefinition;

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

    expect(screen.getByRole('tooltip')).toBeInTheDocument();
    expect(screen.getByText('Hoplite Guard')).toBeInTheDocument();
  });

  it('renders with effective power when provided', () => {
    renderWithProviders(<CardDetail definition={testDef} effectivePower={10} />);

    const tooltip = screen.getByRole('tooltip');
    expect(tooltip).toHaveAttribute('aria-label', expect.stringContaining('10'));
  });

  it('renders range grid', () => {
    renderWithProviders(<CardDetail definition={testDef} effectivePower={undefined} />);

    expect(screen.getByRole('img', { name: /Range/i })).toBeInTheDocument();
  });
});

describe('CardPreviewTrigger', () => {
  it('shows popup on mouse enter after delay', async () => {
    const { user } = renderWithProviders(
      <CardPreviewTrigger definition={testDef}>
        <button>Hover me</button>
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
        <button>Hover me</button>
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
        <button>Hover me</button>
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
    // Advance past exit animation
    act(() => {
      vi.advanceTimersByTime(500);
    });

    await waitFor(() => {
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });
  });

  it('cancels scheduled popup when mouse leaves before delay', async () => {
    const { user } = renderWithProviders(
      <CardPreviewTrigger definition={testDef}>
        <button>Hover me</button>
      </CardPreviewTrigger>,
    );

    await user.hover(screen.getByText('Hover me'));
    act(() => {
      vi.advanceTimersByTime(100);
    });
    await user.unhover(screen.getByText('Hover me'));
    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('shows popup on focus for keyboard users', async () => {
    renderWithProviders(
      <CardPreviewTrigger definition={testDef}>
        <button>Focus me</button>
      </CardPreviewTrigger>,
    );

    act(() => {
      screen.getByText('Focus me').focus();
    });
    act(() => {
      vi.advanceTimersByTime(250);
    });

    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toBeInTheDocument();
    });
  });

  it('hides popup on blur', async () => {
    renderWithProviders(
      <CardPreviewTrigger definition={testDef}>
        <button>Focus me</button>
      </CardPreviewTrigger>,
    );

    act(() => {
      screen.getByText('Focus me').focus();
    });
    act(() => {
      vi.advanceTimersByTime(250);
    });

    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toBeInTheDocument();
    });

    act(() => {
      screen.getByText('Focus me').blur();
    });
    // Advance past exit animation
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
        <button onClick={onClick}>Click me</button>
      </CardPreviewTrigger>,
    );

    await user.click(screen.getByText('Click me'));
    expect(onClick).toHaveBeenCalledOnce();
  });
});

describe('CardPreviewTrigger touch detail dialog', () => {
  // jsdom doesn't implement showModal, so stub it
  beforeEach(() => {
    HTMLDialogElement.prototype.showModal = vi.fn(function (this: HTMLDialogElement) {
      this.setAttribute('open', '');
    });
    HTMLDialogElement.prototype.close = vi.fn(function (this: HTMLDialogElement) {
      this.removeAttribute('open');
    });
  });

  function simulateTouch(el: Element) {
    act(() => {
      el.dispatchEvent(new TouchEvent('touchstart', { bubbles: true }));
      el.dispatchEvent(new TouchEvent('touchend', { bubbles: true, cancelable: true }));
    });
  }

  it('opens card detail dialog on touch', () => {
    renderWithProviders(
      <CardPreviewTrigger definition={testDef} touchAction={vi.fn()} touchActionLabel="Add">
        <button>Tap me</button>
      </CardPreviewTrigger>,
    );

    simulateTouch(screen.getByText('Tap me').parentElement!);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Hoplite Guard')).toBeInTheDocument();
  });

  it('shows action button with label in touch dialog', () => {
    renderWithProviders(
      <CardPreviewTrigger definition={testDef} touchAction={vi.fn()} touchActionLabel="Add to Deck">
        <button>Tap me</button>
      </CardPreviewTrigger>,
    );

    simulateTouch(screen.getByText('Tap me').parentElement!);

    expect(screen.getByRole('button', { name: 'Add to Deck' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
  });

  it('calls action and closes dialog when action button is clicked', async () => {
    const action = vi.fn();
    const { user } = renderWithProviders(
      <CardPreviewTrigger definition={testDef} touchAction={action} touchActionLabel="Add to Deck">
        <button>Tap me</button>
      </CardPreviewTrigger>,
    );

    simulateTouch(screen.getByText('Tap me').parentElement!);

    await user.click(screen.getByRole('button', { name: 'Add to Deck' }));

    expect(action).toHaveBeenCalledOnce();
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('closes dialog when close button is clicked', async () => {
    const { user } = renderWithProviders(
      <CardPreviewTrigger definition={testDef} touchAction={vi.fn()} touchActionLabel="Add">
        <button>Tap me</button>
      </CardPreviewTrigger>,
    );

    simulateTouch(screen.getByText('Tap me').parentElement!);

    await user.click(screen.getByRole('button', { name: 'Close' }));

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('shows dialog without action button when no touchAction provided', () => {
    renderWithProviders(
      <CardPreviewTrigger definition={testDef}>
        <button>Tap me</button>
      </CardPreviewTrigger>,
    );

    simulateTouch(screen.getByText('Tap me').parentElement!);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Add to Deck' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
  });
});

describe('useCardPreview', () => {
  it('throws when used outside provider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    function Bad() {
      useCardPreview();
      return null;
    }

    // Render without CardPreviewProvider by using raw render
    expect(() => render(<Bad />)).toThrow('useCardPreview must be used within CardPreviewProvider');

    spy.mockRestore();
  });
});
