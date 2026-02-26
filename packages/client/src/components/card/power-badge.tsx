interface PowerBadgeProps {
  basePower: number;
  effectivePower: number;
  size?: 'sm' | 'md' | 'lg';
}

export function PowerBadge({ basePower, effectivePower, size = 'md' }: PowerBadgeProps) {
  const isBuffed = effectivePower > basePower;
  const isDebuffed = effectivePower < basePower;

  const colorClass = isBuffed
    ? 'text-power-buff'
    : isDebuffed
      ? 'text-power-debuff'
      : 'text-power-base';

  const sizeClass = size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-2xl' : 'text-lg';

  const arrow = isBuffed ? '\u2191' : isDebuffed ? '\u2193' : '';

  return (
    <span
      className={`${colorClass} ${sizeClass} font-bold tabular-nums`}
      aria-label={`Power ${effectivePower}${isBuffed ? ', buffed' : isDebuffed ? ', debuffed' : ''}`}
    >
      {effectivePower}
      {arrow && <span className="text-xs">{arrow}</span>}
    </span>
  );
}
