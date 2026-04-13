import { t } from '@lingui/core/macro';
import { type RefObject, useRef } from 'react';
import { Button } from './button.tsx';
import { DialogBase } from './dialog-base.tsx';

interface ConfirmDialogProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
}

export function ConfirmDialog({
  open,
  onConfirm,
  onCancel,
  title,
  description,
  confirmLabel,
  cancelLabel,
}: ConfirmDialogProps) {
  const cancelRef: RefObject<HTMLButtonElement | null> = useRef(null);

  return (
    <DialogBase
      open={open}
      onCancel={onCancel}
      ariaLabel={title}
      focusRef={cancelRef}
      className="bg-surface-overlay/90 p-0"
    >
      <div className="bg-surface-raised border border-border rounded-xl p-6 max-w-sm text-center flex flex-col gap-4">
        <h2 className="text-xl font-bold text-text-primary">{title}</h2>
        <p className="text-text-secondary">{description}</p>
        <div className="flex gap-3 justify-center">
          <Button ref={cancelRef} onClick={onCancel}>
            {cancelLabel ?? t`Cancel`}
          </Button>
          <Button onClick={onConfirm} variant="danger">
            {confirmLabel ?? t`Confirm`}
          </Button>
        </div>
      </div>
    </DialogBase>
  );
}
