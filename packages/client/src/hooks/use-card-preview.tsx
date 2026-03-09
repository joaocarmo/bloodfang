import type { ReactNode } from 'react';

/**
 * CardPreviewProvider is now a passthrough — preview state is managed locally
 * in each CardPreviewTrigger using @floating-ui/react interaction hooks.
 * This wrapper is kept for backward compatibility with the existing component tree.
 */
export function CardPreviewProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
