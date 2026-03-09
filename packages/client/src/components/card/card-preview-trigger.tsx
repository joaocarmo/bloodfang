import { useCallback, useRef } from 'react';
import type { ReactNode } from 'react';
import type { CardDefinition } from '@bloodfang/engine';
import { useCardPreview } from '../../hooks/use-card-preview.tsx';

/** Returns true when the device has no fine pointer (touch-only) or the viewport is narrow. */
function isTouchDevice(): boolean {
  return (
    typeof window !== 'undefined' &&
    (window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 640)
  );
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
  const { scheduleShow, cancelScheduled, hide, showTouchDetail } = useCardPreview();
  const ref = useRef<HTMLDivElement>(null);
  const isTouchRef = useRef(false);

  const handleTouchStart = useCallback(() => {
    isTouchRef.current = true;
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault();
      showTouchDetail(definition, effectivePower, touchAction, touchActionLabel);
    },
    [definition, effectivePower, touchAction, touchActionLabel, showTouchDetail],
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (e.pointerType === 'touch') return;
      if (isTouchDevice()) {
        showTouchDetail(definition, effectivePower, touchAction, touchActionLabel);
      }
    },
    [definition, effectivePower, touchAction, touchActionLabel, showTouchDetail],
  );

  const handleMouseEnter = useCallback(() => {
    if (isTouchRef.current) {
      isTouchRef.current = false;
      return;
    }
    if (isTouchDevice()) return;
    if (ref.current) {
      scheduleShow(definition, ref.current, effectivePower);
    }
  }, [definition, effectivePower, scheduleShow]);

  const handleMouseLeave = useCallback(() => {
    cancelScheduled();
    hide();
  }, [cancelScheduled, hide]);

  const handleFocus = useCallback(() => {
    if (isTouchDevice()) return;
    if (ref.current) {
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
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onPointerUp={handlePointerUp}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocusCapture={handleFocus}
      onBlurCapture={handleBlur}
    >
      {children}
    </div>
  );
}
