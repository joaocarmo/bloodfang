import { useRef, type ReactNode, type RefObject } from 'react';
import { useDialog } from '../../hooks/use-dialog.ts';

const base =
  'fixed inset-0 z-50 text-text-primary flex flex-col items-center justify-center w-full h-full max-w-none max-h-none border-none m-0';

interface DialogBaseProps {
  open: boolean;
  onCancel: () => void;
  ariaLabel: string;
  focusRef: RefObject<HTMLElement | null>;
  className?: string;
  children: ReactNode;
}

export function DialogBase({
  open,
  onCancel,
  ariaLabel,
  focusRef,
  className,
  children,
}: DialogBaseProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useDialog(open, dialogRef, focusRef);

  if (!open) return null;

  return (
    <dialog
      ref={dialogRef}
      onCancel={(e) => {
        e.preventDefault();
        onCancel();
      }}
      aria-label={ariaLabel}
      className={`${base}${className ? ` ${className}` : ''}`}
    >
      {children}
    </dialog>
  );
}
