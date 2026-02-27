import { t } from '@lingui/core/macro';
import type { CardDefinition } from '@bloodfang/engine';
import { RankIcon } from './rank-icon.tsx';
import { PowerBadge } from './power-badge.tsx';
import { RangeGrid } from './range-grid.tsx';
import { AbilityText } from './ability-text.tsx';
import { getCardName, getArtPlaceholder } from '../../lib/card-identity.ts';

interface CardProps {
  definition: CardDefinition;
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  compact?: boolean;
}

export function Card({ definition, selected, disabled, onClick, compact }: CardProps) {
  const name = getCardName(definition.id);
  const art = getArtPlaceholder(definition);
  const rankBg =
    definition.rank === 1
      ? 'from-rank-1/20'
      : definition.rank === 2
        ? 'from-rank-2/20'
        : definition.rank === 3
          ? 'from-rank-3/20'
          : 'from-rank-replacement/20';

  const rank = definition.rank;
  const power = definition.power;
  const ariaLabel = [
    name,
    t`Rank ${rank}`,
    t`Power ${power}`,
    definition.ability ? t`Ability: ${definition.ability.effect.type}` : '',
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <div
      className={`
        relative flex flex-col rounded-lg border bg-gradient-to-b ${rankBg} to-surface-raised
        ${selected ? 'border-focus-ring ring-2 ring-focus-ring' : 'border-border'}
        ${disabled ? 'opacity-50' : 'cursor-pointer hover:border-text-secondary'}
        ${compact ? 'w-24 sm:w-28 md:w-32 p-1 sm:p-1.5 gap-0.5' : 'w-32 sm:w-36 md:w-40 p-1.5 sm:p-2 gap-1'}
        transition-colors
      `}
      onClick={disabled ? undefined : onClick}
      onKeyDown={
        disabled || !onClick
          ? undefined
          : (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick();
              }
            }
      }
      role={onClick ? 'button' : undefined}
      tabIndex={onClick && !disabled ? 0 : undefined}
      aria-label={ariaLabel}
    >
      {/* Header: Rank + Power */}
      <div className="flex items-center justify-between">
        <RankIcon rank={definition.rank} />
        <PowerBadge basePower={definition.power} effectivePower={definition.power} size="md" />
      </div>

      {/* Art placeholder */}
      <div
        className={`flex items-center justify-center rounded bg-surface/50 ${compact ? 'h-8 sm:h-10 text-lg' : 'h-10 sm:h-12 md:h-14 text-2xl'}`}
      >
        {art}
      </div>

      {/* Name */}
      <p
        className={`font-medium leading-tight ${compact ? 'text-xs' : 'text-sm'} truncate`}
        title={name}
      >
        {name}
      </p>

      {/* Range Grid + Ability */}
      {!compact && (
        <div className="flex items-start gap-2 mt-auto">
          <RangeGrid rangePattern={definition.rangePattern} size="sm" />
          <div className="flex-1 min-w-0">
            <AbilityText definition={definition} />
          </div>
        </div>
      )}
    </div>
  );
}
