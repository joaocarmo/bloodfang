import { useRef, useEffect } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { useGameStore } from '../../store/game-store.ts';
import { calculateFinalScores, determineWinner } from '@bloodfang/engine';
import { useLaneScores } from '../../hooks/use-lane-scores.ts';
import { BOARD_ROWS } from '@bloodfang/engine';

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

  const winnerText = winner !== null ? `Player ${winner + 1} Wins!` : "It's a Draw!";

  return (
    <div className="flex flex-col items-center gap-8 p-8 max-w-lg mx-auto">
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
          <div className="text-text-secondary text-sm">Player 1</div>
          <div className="text-p0 text-5xl font-bold tabular-nums">{finalScores[0]}</div>
        </motion.div>
        <div className="text-text-muted text-2xl self-center">vs</div>
        <motion.div
          initial={reduceMotion ? false : { x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="text-text-secondary text-sm">Player 2</div>
          <div className="text-p1 text-5xl font-bold tabular-nums">{finalScores[1]}</div>
        </motion.div>
      </div>

      {/* Lane breakdown */}
      <div className="w-full">
        <h2 className="text-sm text-text-secondary font-medium mb-2 text-center">Lane Breakdown</h2>
        <div className="space-y-1">
          {Array.from({ length: BOARD_ROWS }, (_, row) => {
            const p0 = laneScores[row]?.[0] ?? 0;
            const p1 = laneScores[row]?.[1] ?? 0;
            const laneWinner = p0 > p1 ? 0 : p1 > p0 ? 1 : null;

            return (
              <motion.div
                key={row}
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
                <span className="text-text-muted text-sm">Lane {row + 1}</span>
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
        <button
          onClick={startGame}
          className="px-6 py-3 bg-p0/20 border border-p0 rounded-lg font-medium text-p0-light
            hover:bg-p0/30 focus:outline-3 focus:outline-focus-ring focus:outline-offset-2
            min-h-[48px] transition-colors"
        >
          Rematch
        </button>
        <button
          onClick={resetToHome}
          className="px-6 py-3 bg-surface-raised border border-border rounded-lg font-medium
            hover:bg-border focus:outline-3 focus:outline-focus-ring focus:outline-offset-2
            min-h-[48px] transition-colors"
        >
          Home
        </button>
      </motion.div>
    </div>
  );
}
