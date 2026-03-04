import { useCallback, useRef } from 'react';
import type { ReactNode } from 'react';
import type { CardDefinition } from '@bloodfang/engine';
import { useCardPreview } from '../../hooks/use-card-preview.tsx';

interface CardPreviewTriggerProps {
  definition: CardDefinition;
  effectivePower?: number;
  children: ReactNode;
}

export function CardPreviewTrigger({
  definition,
  effectivePower,
  children,
}: CardPreviewTriggerProps) {
  const { scheduleShow, cancelScheduled, hide } = useCardPreview();
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseEnter = useCallback(() => {
    if (ref.current) {
      scheduleShow(definition, ref.current, effectivePower);
    }
  }, [definition, effectivePower, scheduleShow]);

  const handleMouseLeave = useCallback(() => {
    cancelScheduled();
    hide();
  }, [cancelScheduled, hide]);

  const handleFocus = useCallback(() => {
    if (ref.current) {
      // Show immediately for keyboard users
      cancelScheduled();
      scheduleShow(definition, ref.current, effectivePower);
    }
  }, [definition, effectivePower, cancelScheduled, scheduleShow]);

  const handleBlur = useCallback(() => {
    hide();
  }, [hide]);

  return (
    <div
      ref={ref}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocusCapture={handleFocus}
      onBlurCapture={handleBlur}
    >
      {children}
    </div>
  );
}
