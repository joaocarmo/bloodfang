import { useRef, type ReactNode, type RefObject } from 'react';
import { t } from '@lingui/core/macro';
import { useDialog } from '../../hooks/use-dialog.ts';
import { Button } from './button.tsx';

interface ContentDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function ContentDialog({ open, onClose, title, children }: ContentDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef: RefObject<HTMLButtonElement | null> = useRef(null);

  useDialog(open, dialogRef, closeRef);

  if (!open) return null;

  return (
    <dialog
      ref={dialogRef}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      aria-label={title}
      className="fixed inset-0 z-50 bg-surface-overlay/90 flex flex-col items-center justify-center
        w-full h-full max-w-none max-h-none border-none m-0 p-4"
    >
      <div className="bg-surface-raised border border-border rounded-xl max-w-lg w-full max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-xl font-bold text-text-primary">{title}</h2>
          <Button ref={closeRef} variant="ghost" size="sm" onClick={onClose} aria-label={t`Close`}>
            ×
          </Button>
        </div>
        <div className="p-4 overflow-y-auto flex flex-col gap-6">{children}</div>
      </div>
    </dialog>
  );
}
