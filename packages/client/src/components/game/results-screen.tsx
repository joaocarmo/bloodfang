import { BOARD_ROWS, calculateFinalScores, determineWinner } from '@bloodfang/engine';
import { t } from '@lingui/core/macro';
import { useNavigate } from '@tanstack/react-router';
import { motion, useReducedMotion } from 'motion/react';
import { useEffect, useRef } from 'react';
import { LocalGameProvider } from '../../context/game-context.tsx';
import { useLaneScores } from '../../hooks/use-lane-scores.ts';
import { Route } from '../../routes.ts';
import { useGameStore } from '../../store/game-store.ts';
import { BackButton } from '../ui/back-button.tsx';
import { Button } from '../ui/button.tsx';

function ResultsContent() {
  const gameState = useGameStore((s) => s.gameState);
  const resetToHome = useGameStore((s) => s.resetToHome);
  const startGame = useGameStore((s) => s.startGame);
  const navigate = useNavigate();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const laneScores = useLaneScores();
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  if (!gameState) return null;

  const finalScores = calculateFinalScores(gameState);
  const winner = determineWinner(finalScores);

  const winnerText = winner !== null ? t`Player ${String(winner + 1)} Wins!` : t`It's a Draw!`;

  const handleRematch = () => {
    startGame();
    void navigate({ to: Route.Game });
  };

  const handleHome = () => {
    resetToHome();
    void navigate({ to: Route.Home });
  };

  return (
    <main
      tabIndex={-1}
      className="flex flex-col items-center gap-4 p-4 sm:gap-6 sm:p-6 md:gap-8 md:p-8 max-w-lg mx-auto outline-none"
    >
      <BackButton />

      <motion.h1
        ref={headingRef}
        tabIndex={-1}
        initial={reduceMotion ? false : { scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', duration: 0.5, bounce: 0.3 }}
        className={`text-2xl sm:text-3xl md:text-4xl font-bold outline-none ${
          winner === 0 ? 'text-p0' : winner === 1 ? 'text-p1' : 'text-text-primary'
        }`}
      >
        {winnerText}
      </motion.h1>

      {/* Final scores */}
      <div className="flex gap-6 sm:gap-8 md:gap-12 text-center">
        <motion.div
          initial={reduceMotion ? false : { x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="text-text-secondary text-sm">{t`Player 1`}</div>
          <div className="text-p0 text-3xl sm:text-4xl md:text-5xl font-bold tabular-nums">
            {finalScores[0]}
          </div>
        </motion.div>
        <div className="text-text-muted text-2xl self-center">{t`vs`}</div>
        <motion.div
          initial={reduceMotion ? false : { x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="text-text-secondary text-sm">{t`Player 2`}</div>
          <div className="text-p1 text-3xl sm:text-4xl md:text-5xl font-bold tabular-nums">
            {finalScores[1]}
          </div>
        </motion.div>
      </div>

      {/* Lane breakdown */}
      <section className="w-full">
        <h2 className="text-sm text-text-secondary font-medium mb-2 text-center">{t`Lane Breakdown`}</h2>
        <div className="space-y-1">
          {Array.from({ length: BOARD_ROWS }, (_, row) => {
            const p0 = laneScores[row]?.[0] ?? 0;
            const p1 = laneScores[row]?.[1] ?? 0;
            const laneWinner = p0 > p1 ? 0 : p1 > p0 ? 1 : null;

            const laneNum = String(row + 1);
            const laneLabel =
              laneWinner === 0
                ? t`Lane ${laneNum}: Player 1 wins ${String(p0)} to ${String(p1)}`
                : laneWinner === 1
                  ? t`Lane ${laneNum}: Player 2 wins ${String(p1)} to ${String(p0)}`
                  : t`Lane ${laneNum}: Tied ${String(p0)} to ${String(p1)}`;

            return (
              <motion.div
                key={`lane-${String(row)}`}
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
                <span className="text-text-muted text-sm">{t`Lane ${String(row + 1)}`}</span>
                <span
                  className={`font-bold tabular-nums w-8 ${laneWinner === 1 ? 'text-p1' : 'text-text-muted'}`}
                >
                  {p1}
                </span>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Actions */}
      <motion.div
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="flex gap-3"
      >
        <Button onClick={handleRematch} variant="primary" size="lg">
          {t`Rematch`}
        </Button>
        <Button onClick={handleHome} size="lg">
          {t`Home`}
        </Button>
      </motion.div>
    </main>
  );
}

export function ResultsScreen() {
  return (
    <LocalGameProvider>
      <ResultsContent />
    </LocalGameProvider>
  );
}
