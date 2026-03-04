import { useFloating, offset, flip, shift, FloatingPortal } from '@floating-ui/react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useCardPreview } from '../../hooks/use-card-preview.tsx';
import { CardDetail } from './card-detail.tsx';

export function CardPreviewPopup() {
  const { state } = useCardPreview();
  const reduceMotion = useReducedMotion();

  const { refs, floatingStyles } = useFloating({
    placement: 'right',
    middleware: [offset(8), flip(), shift({ padding: 8 })],
    elements: {
      reference: state?.anchorEl ?? null,
    },
  });

  return (
    <FloatingPortal>
      <AnimatePresence>
        {state && (
          <div ref={refs.setFloating} style={floatingStyles} className="z-50 pointer-events-none">
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', duration: 0.2, bounce: 0 }}
            >
              <CardDetail definition={state.definition} effectivePower={state.effectivePower} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </FloatingPortal>
  );
}
