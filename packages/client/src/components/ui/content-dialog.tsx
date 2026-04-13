import { t } from '@lingui/core/macro';
import { type ReactNode, type RefObject, useRef } from 'react';
import { Button } from './button.tsx';
import { DialogBase } from './dialog-base.tsx';

interface ContentDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function ContentDialog({ open, onClose, title, children }: ContentDialogProps) {
  const closeRef: RefObject<HTMLButtonElement | null> = useRef(null);

  return (
    <DialogBase
      open={open}
      onCancel={onClose}
      ariaLabel={title}
      focusRef={closeRef}
      className="bg-surface-overlay/90 p-4"
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
    </DialogBase>
  );
}
