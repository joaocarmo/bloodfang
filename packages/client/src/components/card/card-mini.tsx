import type { CardDefinition } from '@bloodfang/engine';
import { PowerBadge } from './power-badge.tsx';
import { RankIcon } from './rank-icon.tsx';
import { getCardName } from '../../lib/card-identity.ts';

interface CardMiniProps {
  definition: CardDefinition;
  effectivePower: number;
}

export function CardMini({ definition, effectivePower }: CardMiniProps) {
  const name = getCardName(definition.id);

  return (
    <div className="flex flex-col items-center gap-0.5 text-center">
      <div className="flex items-center justify-between w-full">
        <RankIcon rank={definition.rank} />
        <PowerBadge basePower={definition.power} effectivePower={effectivePower} size="sm" />
      </div>
      <span className="text-[10px] leading-tight text-text-secondary truncate max-w-full">
        {name}
      </span>
    </div>
  );
}
