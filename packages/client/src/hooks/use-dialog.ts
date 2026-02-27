import { useEffect, type RefObject } from 'react';

export function useDialog(
  open: boolean,
  dialogRef: RefObject<HTMLDialogElement | null>,
  focusRef: RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    if (open) {
      dialogRef.current?.showModal();
      focusRef.current?.focus();
    } else {
      dialogRef.current?.close();
    }
  }, [open, dialogRef, focusRef]);
}
