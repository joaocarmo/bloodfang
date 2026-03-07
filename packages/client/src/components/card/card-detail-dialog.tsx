import { useRef } from 'react';
import { t } from '@lingui/core/macro';
import type { CardDefinition } from '@bloodfang/engine';
import { DialogBase } from '../ui/dialog-base.tsx';
import { CardDetail } from './card-detail.tsx';
import { Button } from '../ui/button.tsx';
import { getCardName } from '../../lib/card-identity.ts';

interface TouchDetailState {
  definition: CardDefinition;
  effectivePower: number | undefined;
  action: (() => void) | undefined;
  actionLabel: string | undefined;
}

interface CardDetailDialogProps {
  state: TouchDetailState | null;
  onClose: () => void;
}

export function CardDetailDialog({ state, onClose }: CardDetailDialogProps) {
  const closeRef = useRef<HTMLButtonElement>(null);

  const name = state ? getCardName(state.definition.id) : '';

  return (
    <DialogBase
      open={state !== null}
      onCancel={onClose}
      ariaLabel={state ? t`${name} card details` : ''}
      focusRef={closeRef}
      className="bg-surface/80 backdrop-blur-sm"
    >
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />
      <div className="relative flex flex-col items-center gap-3 p-4 max-w-sm w-full">
        {state && (
          <CardDetail definition={state.definition} effectivePower={state.effectivePower} />
        )}
        <div className="flex gap-2">
          {state?.action && state.actionLabel && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                state.action?.();
                onClose();
              }}
            >
              {state.actionLabel}
            </Button>
          )}
          <Button ref={closeRef} size="sm" onClick={onClose}>
            {t`Close`}
          </Button>
        </div>
      </div>
    </DialogBase>
  );
}
