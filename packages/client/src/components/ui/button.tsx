import { forwardRef } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'secondary' | 'primary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

const base =
  'rounded-lg font-medium transition-colors focus:outline-3 focus:outline-focus-ring focus:outline-offset-2';

const variants: Record<NonNullable<ButtonProps['variant']>, string> = {
  secondary: 'bg-surface-raised border border-border hover:bg-border',
  primary: 'bg-p0/20 border border-p0 text-p0-light hover:bg-p0/30',
  danger: 'bg-p1/30 border border-p1 text-p1-light hover:bg-p1/40',
  ghost: 'text-text-muted hover:text-text-secondary underline',
};

const sizes: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'px-3 py-1.5 min-h-[36px] text-sm',
  md: 'px-6 py-2 min-h-[44px]',
  lg: 'px-8 py-3 min-h-[48px] text-lg',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'secondary', size = 'md', className, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      className={`${base} ${variants[variant]} ${sizes[size]}${className ? ` ${className}` : ''}`}
      {...props}
    />
  );
});
