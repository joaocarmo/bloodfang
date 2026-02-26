import type { CardDefinition } from '@bloodfang/engine';
import { getAbilityDescription } from '../../lib/card-identity.ts';

interface AbilityTextProps {
  definition: CardDefinition;
}

export function AbilityText({ definition }: AbilityTextProps) {
  const description = getAbilityDescription(definition);
  if (!description) return null;

  return <p className="text-xs text-text-secondary leading-tight">{description}</p>;
}
