import { useEffect, useRef } from 'react';
import { Button } from './button.tsx';

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
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (open) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [open]);

  if (!open) return null;

  return (
    <dialog
      ref={dialogRef}
      onCancel={(e) => {
        e.preventDefault();
        onCancel();
      }}
      aria-label={title}
      className="fixed inset-0 z-50 bg-surface-overlay/90 flex flex-col items-center justify-center
        w-full h-full max-w-none max-h-none border-none m-0 p-0"
    >
      <div className="bg-surface-raised border border-border rounded-xl p-6 max-w-sm text-center flex flex-col gap-4">
        <h2 className="text-xl font-bold text-text-primary">{title}</h2>
        <p className="text-text-secondary">{description}</p>
        <div className="flex gap-3 justify-center">
          <Button onClick={onCancel} autoFocus>
            {cancelLabel ?? 'Cancel'}
          </Button>
          <Button onClick={onConfirm} variant="danger">
            {confirmLabel ?? 'Confirm'}
          </Button>
        </div>
      </div>
    </dialog>
  );
}
