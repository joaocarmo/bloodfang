import { t } from '@lingui/core/macro';
import { motion, useReducedMotion } from 'motion/react';
import { useRef } from 'react';
import { useGame } from '../../context/game-context.tsx';
import { playerTextColor } from '../../lib/player-color.ts';

export function TurnIndicator() {
  const { gameState, isOnline, isMyTurn } = useGame();
  const reduceMotion = useReducedMotion();
  const prevIsMyTurnRef = useRef(isMyTurn);
  const animKeyRef = useRef(0);

  if (!gameState) return null;

  // Increment animation key when it becomes our turn
  if (isMyTurn && !prevIsMyTurnRef.current) {
    animKeyRef.current += 1;
  }
  prevIsMyTurnRef.current = isMyTurn;

  const player = gameState.currentPlayerIndex;

  const turnLabel = isOnline
    ? isMyTurn
      ? t`Your Turn`
      : t`Opponent's Turn`
    : t`Player ${String(player + 1)}'s Turn`;

  return (
    <motion.div
      key={animKeyRef.current}
      className="text-center"
      role="status"
      initial={reduceMotion ? false : { scale: 1.15 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', duration: 0.3, bounce: 0.3 }}
    >
      <span className={`${playerTextColor(isOnline ? 0 : player)} font-bold text-lg`}>
        {turnLabel}
      </span>
      <span className="text-text-muted text-sm ml-2">{t`Turn ${String(gameState.turnNumber)}`}</span>
    </motion.div>
  );
}
