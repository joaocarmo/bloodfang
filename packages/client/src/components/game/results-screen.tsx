import { useRef, useEffect } from 'react';
import { t } from '@lingui/core/macro';
import { motion, useReducedMotion } from 'motion/react';
import { useGameStore } from '../../store/game-store.ts';
import { calculateFinalScores, determineWinner } from '@bloodfang/engine';
import { useLaneScores } from '../../hooks/use-lane-scores.ts';
import { BOARD_ROWS } from '@bloodfang/engine';
import { Button } from '../ui/button.tsx';

export function ResultsScreen() {
  const gameState = useGameStore((s) => s.gameState);
  const resetToHome = useGameStore((s) => s.resetToHome);
  const startGame = useGameStore((s) => s.startGame);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const laneScores = useLaneScores();
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  if (!gameState) return null;

  const finalScores = calculateFinalScores(gameState);
  const winner = determineWinner(finalScores);

  const winnerText = winner !== null ? t`Player ${winner + 1} Wins!` : t`It's a Draw!`;

  return (
    <main className="flex flex-col items-center gap-8 p-8 max-w-lg mx-auto">
      <motion.h1
        ref={headingRef}
        tabIndex={-1}
        initial={reduceMotion ? false : { scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', duration: 0.5, bounce: 0.3 }}
        className={`text-4xl font-bold outline-none ${
          winner === 0 ? 'text-p0' : winner === 1 ? 'text-p1' : 'text-text-primary'
        }`}
      >
        {winnerText}
      </motion.h1>

      {/* Final scores */}
      <div className="flex gap-12 text-center">
        <motion.div
          initial={reduceMotion ? false : { x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="text-text-secondary text-sm">{t`Player 1`}</div>
          <div className="text-p0 text-5xl font-bold tabular-nums">{finalScores[0]}</div>
        </motion.div>
        <div className="text-text-muted text-2xl self-center">{t`vs`}</div>
        <motion.div
          initial={reduceMotion ? false : { x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="text-text-secondary text-sm">{t`Player 2`}</div>
          <div className="text-p1 text-5xl font-bold tabular-nums">{finalScores[1]}</div>
        </motion.div>
      </div>

      {/* Lane breakdown */}
      <div className="w-full">
        <h2 className="text-sm text-text-secondary font-medium mb-2 text-center">{t`Lane Breakdown`}</h2>
        <div className="space-y-1">
          {Array.from({ length: BOARD_ROWS }, (_, row) => {
            const p0 = laneScores[row]?.[0] ?? 0;
            const p1 = laneScores[row]?.[1] ?? 0;
            const laneWinner = p0 > p1 ? 0 : p1 > p0 ? 1 : null;

            const laneNum = row + 1;
            const laneLabel =
              laneWinner === 0
                ? t`Lane ${laneNum}: Player 1 wins ${p0} to ${p1}`
                : laneWinner === 1
                  ? t`Lane ${laneNum}: Player 2 wins ${p1} to ${p0}`
                  : t`Lane ${laneNum}: Tied ${p0} to ${p1}`;

            return (
              <motion.div
                key={row}
                aria-label={laneLabel}
                initial={reduceMotion ? false : { y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 + row * 0.15 }}
                className="flex items-center justify-between bg-surface-raised rounded-lg px-4 py-2"
              >
                <span
                  className={`font-bold tabular-nums w-8 text-right ${laneWinner === 0 ? 'text-p0' : 'text-text-muted'}`}
                >
                  {p0}
                </span>
                <span className="text-text-muted text-sm">{t`Lane ${row + 1}`}</span>
                <span
                  className={`font-bold tabular-nums w-8 ${laneWinner === 1 ? 'text-p1' : 'text-text-muted'}`}
                >
                  {p1}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <motion.div
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="flex gap-3"
      >
        <Button onClick={startGame} variant="primary" size="lg">
          {t`Rematch`}
        </Button>
        <Button onClick={resetToHome} size="lg">
          {t`Home`}
        </Button>
      </motion.div>
    </main>
  );
}
