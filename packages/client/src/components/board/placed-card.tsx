import type { CardDefinition, CardInstance, GameState } from '@bloodfang/engine';
import { getEffectivePower } from '@bloodfang/engine';
import { motion, useReducedMotion } from 'motion/react';
import { CardMini } from '../card/card-mini.tsx';

interface PlacedCardProps {
  instance: CardInstance;
  definition: CardDefinition;
  gameState: GameState;
}

export function PlacedCard({ instance, definition, gameState }: PlacedCardProps) {
  const effectivePower = getEffectivePower(gameState, instance.instanceId);
  const reduceMotion = useReducedMotion();

  const exitAnimation = reduceMotion ? {} : { scale: 0, opacity: 0 };

  return (
    <motion.div
      initial={reduceMotion ? false : { scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={exitAnimation}
      transition={{ type: 'spring', duration: 0.3, bounce: 0.2 }}
      layoutId={`card-${instance.instanceId}`}
    >
      <CardMini definition={definition} effectivePower={effectivePower} />
    </motion.div>
  );
}
