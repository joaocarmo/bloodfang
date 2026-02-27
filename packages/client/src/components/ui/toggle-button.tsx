import { forwardRef } from 'react';

interface ToggleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  pressed: boolean;
  size?: 'sm' | 'md';
}

const base =
  'rounded-lg transition-colors focus:outline-3 focus:outline-focus-ring focus:outline-offset-2';

const sizes: Record<NonNullable<ToggleButtonProps['size']>, string> = {
  sm: 'px-3 py-1.5 min-h-[36px] text-sm',
  md: 'px-6 py-2 min-h-[44px]',
};

export const ToggleButton = forwardRef<HTMLButtonElement, ToggleButtonProps>(function ToggleButton(
  { pressed, size = 'sm', className, ...props },
  ref,
) {
  const state = pressed
    ? 'bg-p0/30 border border-p0 text-p0-light'
    : 'bg-surface-raised border border-border text-text-secondary hover:bg-border';

  return (
    <button
      ref={ref}
      aria-pressed={pressed}
      className={`${base} ${sizes[size]} ${state}${className ? ` ${className}` : ''}`}
      {...props}
    />
  );
});
