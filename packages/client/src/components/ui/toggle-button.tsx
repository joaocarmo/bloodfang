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

export function ToggleButton({ pressed, size = 'sm', className, ...props }: ToggleButtonProps) {
  const state = pressed
    ? 'bg-p0/30 border border-p0 text-p0-light'
    : 'bg-surface-raised border border-border text-text-secondary hover:bg-border';

  return (
    <button
      aria-pressed={pressed}
      className={`${base} ${sizes[size]} ${state}${className ? ` ${className}` : ''}`}
      {...props}
    />
  );
}
