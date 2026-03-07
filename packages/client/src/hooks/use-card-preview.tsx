import { createContext, useCallback, useContext, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import type { CardDefinition } from '@bloodfang/engine';
import { CardPreviewPopup } from '../components/card/card-preview-popup.tsx';
import { CardDetailDialog } from '../components/card/card-detail-dialog.tsx';

interface CardPreviewState {
  definition: CardDefinition;
  anchorEl: HTMLElement;
  effectivePower: number | undefined;
}

interface TouchDetailState {
  definition: CardDefinition;
  effectivePower: number | undefined;
  action: (() => void) | undefined;
  actionLabel: string | undefined;
}

interface CardPreviewContextValue {
  state: CardPreviewState | null;
  scheduleShow: (
    definition: CardDefinition,
    anchorEl: HTMLElement,
    effectivePower?: number,
  ) => void;
  cancelScheduled: () => void;
  hide: () => void;
  showTouchDetail: (
    definition: CardDefinition,
    effectivePower?: number,
    action?: () => void,
    actionLabel?: string,
  ) => void;
  hideTouchDetail: () => void;
}

const CardPreviewContext = createContext<CardPreviewContextValue | null>(null);

const SHOW_DELAY = 250;

export function CardPreviewProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CardPreviewState | null>(null);
  const [touchDetail, setTouchDetail] = useState<TouchDetailState | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelScheduled = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const hide = useCallback(() => {
    cancelScheduled();
    setState(null);
  }, [cancelScheduled]);

  const scheduleShow = useCallback(
    (definition: CardDefinition, anchorEl: HTMLElement, effectivePower?: number) => {
      cancelScheduled();
      timerRef.current = setTimeout(() => {
        setState({ definition, anchorEl, effectivePower });
        timerRef.current = null;
      }, SHOW_DELAY);
    },
    [cancelScheduled],
  );

  const showTouchDetail = useCallback(
    (
      definition: CardDefinition,
      effectivePower?: number,
      action?: () => void,
      actionLabel?: string,
    ) => {
      setTouchDetail({ definition, effectivePower, action, actionLabel });
    },
    [],
  );

  const hideTouchDetail = useCallback(() => {
    setTouchDetail(null);
  }, []);

  return (
    <CardPreviewContext.Provider
      value={{ state, scheduleShow, cancelScheduled, hide, showTouchDetail, hideTouchDetail }}
    >
      {children}
      <CardPreviewPopup />
      <CardDetailDialog state={touchDetail} onClose={hideTouchDetail} />
    </CardPreviewContext.Provider>
  );
}

export function useCardPreview(): CardPreviewContextValue {
  const ctx = useContext(CardPreviewContext);
  if (!ctx) {
    throw new Error('useCardPreview must be used within CardPreviewProvider');
  }
  return ctx;
}
