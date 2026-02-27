import { t } from '@lingui/core/macro';
import type { PlayerId } from '@bloodfang/engine';
import { MAX_PAWN_COUNT } from '@bloodfang/engine';
import { motion, useReducedMotion } from 'motion/react';
import { playerBgColor } from '../../lib/player-color.ts';

interface PawnDotsProps {
  count: number;
  owner: PlayerId | null;
}

export function PawnDots({ count, owner }: PawnDotsProps) {
  const colorClass = owner !== null ? playerBgColor(owner) : 'bg-text-muted';
  const reduceMotion = useReducedMotion();

  if (count === 0) return null;

  return (
    <div className="flex gap-0.5 items-center" aria-label={t`${count} of ${MAX_PAWN_COUNT} pawns`}>
      {Array.from({ length: count }, (_, i) => (
        <motion.div
          key={i}
          initial={reduceMotion ? false : { scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', duration: 0.2, delay: i * 0.05 }}
          className={`w-1.5 h-1.5 rounded-full ${colorClass}`}
        />
      ))}
    </div>
  );
}
