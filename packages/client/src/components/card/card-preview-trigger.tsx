import { useState } from 'react';
import type { ReactNode } from 'react';
import {
  useFloating,
  useHover,
  useFocus,
  useClick,
  useDismiss,
  useRole,
  useInteractions,
  offset,
  flip,
  shift,
  autoUpdate,
  FloatingPortal,
  FloatingOverlay,
  FloatingFocusManager,
} from '@floating-ui/react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { t } from '@lingui/core/macro';
import type { CardDefinition } from '@bloodfang/engine';
import { CardDetail } from './card-detail.tsx';
import { Button } from '../ui/button.tsx';
import { getCardName } from '../../lib/card-identity.ts';

export function useIsSmallScreen(): boolean {
  if (typeof window === 'undefined') return false;
  const coarse =
    typeof window.matchMedia === 'function' && window.matchMedia('(pointer: coarse)').matches;
  return coarse || window.innerWidth < 640;
}

interface CardPreviewTriggerProps {
  definition: CardDefinition;
  effectivePower?: number | undefined;
  touchAction?: (() => void) | undefined;
  touchActionLabel?: string | undefined;
  children: ReactNode;
}

export function CardPreviewTrigger({
  definition,
  effectivePower,
  touchAction,
  touchActionLabel,
  children,
}: CardPreviewTriggerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const isSmall = useIsSmallScreen();

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: 'right',
    middleware: [offset(8), flip(), shift({ padding: 8 })],
    whileElementsMounted: autoUpdate,
  });

  const hover = useHover(context, {
    mouseOnly: true,
    delay: { open: 250 },
    enabled: !isSmall,
  });
  const focus = useFocus(context, { enabled: !isSmall });
  const click = useClick(context, { enabled: isSmall });
  const dismiss = useDismiss(context, {
    // On desktop tooltips, allow Escape to propagate to parent handlers
    escapeKey: isSmall,
    outsidePress: isSmall,
  });
  const role = useRole(context, { role: isSmall ? 'dialog' : 'tooltip' });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover,
    focus,
    click,
    dismiss,
    role,
  ]);

  const name = getCardName(definition.id);
  const power = effectivePower ?? definition.power;

  return (
    <>
      <div ref={refs.setReference} {...getReferenceProps()}>
        {children}
      </div>
      {isOpen && (
        <FloatingPortal>
          {isSmall ? (
            <FloatingOverlay
              lockScroll
              className="z-50 flex items-center justify-center bg-surface/80 backdrop-blur-sm"
            >
              <FloatingFocusManager context={context}>
                <div
                  ref={refs.setFloating}
                  aria-label={t`${name} card details`}
                  {...getFloatingProps()}
                  className="flex flex-col items-center gap-3 p-4 max-w-sm w-full"
                >
                  <CardDetail definition={definition} effectivePower={power} />
                  <div className="flex gap-2">
                    {touchAction && touchActionLabel && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => {
                          touchAction();
                          setIsOpen(false);
                        }}
                      >
                        {touchActionLabel}
                      </Button>
                    )}
                    <Button size="sm" onClick={() => setIsOpen(false)}>
                      {t`Close`}
                    </Button>
                  </div>
                </div>
              </FloatingFocusManager>
            </FloatingOverlay>
          ) : (
            <AnimatePresence>
              <div
                ref={refs.setFloating}
                style={floatingStyles}
                {...getFloatingProps()}
                className="z-50 pointer-events-none"
              >
                <motion.div
                  initial={reduceMotion ? false : { opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
                  transition={{ type: 'spring', duration: 0.2, bounce: 0 }}
                >
                  <CardDetail definition={definition} effectivePower={power} />
                </motion.div>
              </div>
            </AnimatePresence>
          )}
        </FloatingPortal>
      )}
    </>
  );
}
