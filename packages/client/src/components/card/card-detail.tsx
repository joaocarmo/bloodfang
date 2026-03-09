import { t } from '@lingui/core/macro';
import type { CardDefinition } from '@bloodfang/engine';
import { RankIcon } from './rank-icon.tsx';
import { PowerBadge } from './power-badge.tsx';
import { RangeGrid } from './range-grid.tsx';
import { AbilityText } from './ability-text.tsx';
import { CardArt } from './card-art.tsx';
import { getCardName, getFlavorText } from '../../lib/card-identity.ts';

interface CardDetailProps {
  definition: CardDefinition;
  effectivePower: number | undefined;
}

export function CardDetail({ definition, effectivePower }: CardDetailProps) {
  const name = getCardName(definition.id);
  const flavorText = getFlavorText(definition.id);
  const power = effectivePower ?? definition.power;
  const rank = definition.rank;

  const rankBg =
    rank === 1
      ? 'from-rank-1/60'
      : rank === 2
        ? 'from-rank-2/60'
        : rank === 3
          ? 'from-rank-3/60'
          : 'from-rank-replacement/60';

  const ariaLabel = [
    name,
    t`Rank ${rank}`,
    t`Power ${power}`,
    definition.ability ? t`Ability: ${definition.ability.effect.type}` : '',
    flavorText ? t`Lore: ${flavorText}` : '',
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <div
      aria-label={ariaLabel}
      className={`w-64 sm:w-72 rounded-xl border border-border bg-gradient-to-b ${rankBg} to-surface-raised p-2.5 sm:p-3 flex flex-col gap-1.5`}
    >
      <div className="flex items-center justify-between">
        <RankIcon rank={definition.rank} />
        <PowerBadge basePower={definition.power} effectivePower={power} size="lg" />
      </div>

      <CardArt definitionId={definition.id} rank={definition.rank} size="large" />

      <p className="text-base sm:text-lg font-bold leading-tight truncate" title={name}>
        {name}
      </p>

      <div className="flex items-start gap-2.5">
        <RangeGrid rangePattern={definition.rangePattern} size="md" />
        <div className="flex-1 min-w-0">
          <AbilityText definition={definition} />
        </div>
      </div>

      {flavorText && (
        <>
          <hr className="border-text-muted/20" aria-hidden="true" />
          <p className="text-xs sm:text-sm italic text-text-muted leading-snug">{flavorText}</p>
        </>
      )}
    </div>
  );
}
