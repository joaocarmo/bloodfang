import type { ReactNode } from 'react';
import { Link } from '@tanstack/react-router';

interface LinkButtonProps {
  to: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  className?: string;
}

const base =
  'rounded-lg font-medium transition-colors focus:outline-3 focus:outline-focus-ring focus:outline-offset-2 inline-flex items-center justify-center';

const variants: Record<NonNullable<LinkButtonProps['variant']>, string> = {
  secondary: 'bg-surface-raised border border-border hover:bg-border',
  primary: 'bg-p0/20 border border-p0 text-p0-light hover:bg-p0/30',
  ghost: 'text-text-muted hover:text-text-secondary underline',
};

const sizes: Record<NonNullable<LinkButtonProps['size']>, string> = {
  sm: 'px-3 py-1.5 min-h-[36px] text-sm',
  md: 'px-6 py-2 min-h-[44px]',
  lg: 'px-8 py-3 min-h-[48px] text-lg',
};

export function LinkButton({
  to,
  variant = 'secondary',
  size = 'md',
  children,
  className,
}: LinkButtonProps) {
  return (
    <Link
      to={to}
      className={`${base} ${variants[variant]} ${sizes[size]}${className ? ` ${className}` : ''}`}
    >
      {children}
    </Link>
  );
}
