import type { CardDefinition } from '@bloodfang/engine';
import {
  getCardAriaLabel,
  getCardName,
  getFlavorText,
  getRankGradientClass,
} from '../../lib/card-identity.ts';
import { AbilityText } from './ability-text.tsx';
import { CardArt } from './card-art.tsx';
import { PowerBadge } from './power-badge.tsx';
import { RangeGrid } from './range-grid.tsx';
import { RankIcon } from './rank-icon.tsx';

interface CardDetailProps {
  definition: CardDefinition;
  effectivePower: number | undefined;
}

export function CardDetail({ definition, effectivePower }: CardDetailProps) {
  const name = getCardName(definition.id);
  const flavorText = getFlavorText(definition.id);
  const power = effectivePower ?? definition.power;
  const rankBg = getRankGradientClass(definition.rank, '60');

  return (
    <article
      aria-label={getCardAriaLabel(definition, effectivePower)}
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
          <hr className="border-text-muted/20" />
          <p className="text-xs sm:text-sm italic text-text-muted leading-snug">{flavorText}</p>
        </>
      )}
    </article>
  );
}
