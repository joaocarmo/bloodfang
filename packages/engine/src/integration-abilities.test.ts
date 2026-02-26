import { describe, it, expect } from 'vitest';
import type { CardDefinition, GameState, PlayerId, Position } from './types.js';
import { createSeededRng, GAME_PHASES } from './types.js';
import { createGame, mulligan, playCard, pass, destroyCard, getEffectivePower } from './game.js';
import { recalculateContinuousEffects } from './abilities.js';
import { calculateFinalScores } from './scoring.js';
import { getAllTestDefinitions, buildTestDeck } from './cards/test-cards.js';
import { getAllAbilityTestDefinitions } from './cards/ability-test-cards.js';
import { getAllTokenDefinitions } from './cards/token-cards.js';

const seedRng = (s: number) => createSeededRng(s);

function allDefs(): Record<string, CardDefinition> {
  return {
    ...getAllTestDefinitions(),
    ...getAllAbilityTestDefinitions(),
    ...getAllTokenDefinitions(),
  };
}

/** Create a game with controlled hands for testing abilities. */
function setupControlledGame(p0Hand: string[], p1Hand: string[], seed = 100): GameState {
  const defs = allDefs();
  // Build decks that will have the desired cards in hand after deterministic shuffle
  // Simplest approach: override hands after game creation
  const baseDeck = buildTestDeck();
  let state = createGame(baseDeck, baseDeck, defs, undefined, seedRng(seed));
  state = mulligan(state, 0, [], seedRng(seed + 1));
  state = mulligan(state, 1, [], seedRng(seed + 2));

  // Override hands
  const players: [(typeof state.players)[0], (typeof state.players)[1]] = [
    state.players[0],
    state.players[1],
  ];
  players[0] = { ...players[0], hand: p0Hand };
  players[1] = { ...players[1], hand: p1Hand };
  return { ...state, players };
}

/** Manually place a card on the board for setup. */
function injectCard(
  state: GameState,
  cardId: string,
  position: Position,
  owner: PlayerId,
): { state: GameState; instanceId: string } {
  const def = state.cardDefinitions[cardId];
  if (!def) throw new Error(`Unknown card: ${cardId}`);

  const instanceId = String(state.nextInstanceId);
  const instance = {
    instanceId,
    definitionId: cardId,
    owner,
    position,
    basePower: def.power,
    bonusPower: 0,
  };

  let board = state.board;
  board = board.map((r, ri) =>
    ri === position.row
      ? r.map((t, ci) =>
          ci === position.col
            ? { ...t, cardInstanceId: instanceId, owner, pawnCount: Math.max(t.pawnCount, 1) }
            : t,
        )
      : r,
  );

  return {
    state: {
      ...state,
      board,
      cardInstances: { ...state.cardInstances, [instanceId]: instance },
      nextInstanceId: state.nextInstanceId + 1,
    },
    instanceId,
  };
}

describe('integration: whenPlayed abilities', () => {
  it('enhancer-on-play buffs target at range when played', () => {
    let state = setupControlledGame(['enhancer-on-play'], ['filler-1']);

    // Inject a target card at (0,1) for P0
    const injected = injectCard(state, 'r1-basic', { row: 0, col: 1 }, 0);
    state = injected.state;
    const targetId = injected.instanceId;

    // Ensure P0 owns col 0
    // P0 plays enhancer-on-play at (0,0) — ability range is col+1 → targets (0,1)
    state = playCard(state, 'enhancer-on-play', { row: 0, col: 0 });

    // Target should have +2 bonus power
    const target = state.cardInstances[targetId]!;
    expect(target.bonusPower).toBe(2);
    expect(getEffectivePower(state, targetId)).toBe(4); // 2 base + 2 bonus
  });

  it('enfeeble-on-play debuffs enemy card and triggers death', () => {
    let state = setupControlledGame(['enfeeble-on-play'], ['filler-1']);

    // Inject enemy card at (0,1) with power 2
    const injected = injectCard(state, 'r1-basic', { row: 0, col: 1 }, 1);
    state = injected.state;
    const targetId = injected.instanceId;

    // P0 plays enfeeble-on-play at (0,0) — enfeebles (0,1) by -3
    state = playCard(state, 'enfeeble-on-play', { row: 0, col: 0 });

    // Target (power 2 - 3 = -1) should be destroyed by death check
    expect(state.cardInstances[targetId]).toBeUndefined();
  });

  it('destroyer-on-play directly destroys target card', () => {
    let state = setupControlledGame(['destroyer-on-play'], ['filler-1']);

    const injected = injectCard(state, 'r1-basic', { row: 0, col: 1 }, 1);
    state = injected.state;
    const targetId = injected.instanceId;

    state = playCard(state, 'destroyer-on-play', { row: 0, col: 0 });

    expect(state.cardInstances[targetId]).toBeUndefined();
    expect(state.board[0]![1]!.cardInstanceId).toBeNull();
  });

  it('hand-generator adds token cards to hand', () => {
    let state = setupControlledGame(['hand-generator'], ['filler-1']);

    state = playCard(state, 'hand-generator', { row: 0, col: 0 });

    // After turn advances, it's P1's turn. P0's hand should have +2 tokens -1 played card
    // handBefore was 1 (just hand-generator). After playing: 0. Then +2 tokens = 2.
    expect(state.players[0].hand.filter((id) => id === 'token-basic')).toHaveLength(2);
  });

  it('spawner creates token cards on board', () => {
    let state = setupControlledGame(['spawner'], ['filler-1']);

    // Ensure (0,1) is owned by P0 and empty for spawn
    let board = state.board;
    board = board.map((r, ri) =>
      ri === 0
        ? r.map((t, ci) => (ci === 1 ? { ...t, owner: 0 as PlayerId, pawnCount: 1 } : t))
        : r,
    );
    state = { ...state, board };

    state = playCard(state, 'spawner', { row: 0, col: 0 });

    // Token should be spawned at (0,1) — ability range col+1
    expect(state.board[0]![1]!.cardInstanceId).not.toBeNull();
    const spawnedId = state.board[0]![1]!.cardInstanceId!;
    expect(state.cardInstances[spawnedId]!.definitionId).toBe('token-basic');
  });

  it('rank-booster adds pawns to target positions', () => {
    let state = setupControlledGame(['rank-booster'], ['filler-1']);

    const pawnsBefore = state.board[0]![1]!.pawnCount;
    // Need to ensure (0,1) exists — it's a middle column
    state = playCard(state, 'rank-booster', { row: 0, col: 0 });

    // Ability range col+1 → (0,1) gets +2 pawns
    // If it was unowned (pawnCount 0), now it should have 2 (and be owned by P0)
    expect(state.board[0]![1]!.pawnCount).toBeGreaterThan(pawnsBefore);
  });
});

describe('integration: whenDestroyed abilities', () => {
  it('death-curse enfeebles enemies in lane when destroyed', () => {
    let state = setupControlledGame(['filler-1'], ['filler-1']);

    // Set up: death-curse (P0) and enemy card in same lane
    const dc = injectCard(state, 'death-curse', { row: 0, col: 0 }, 0);
    state = dc.state;
    const curseId = dc.instanceId;

    const enemy = injectCard(state, 'r2-basic', { row: 0, col: 4 }, 1);
    state = enemy.state;
    const enemyId = enemy.instanceId;

    // Destroy the death-curse card
    state = destroyCard(state, curseId);

    // Enemy should have -2 bonusPower
    expect(state.cardInstances[enemyId]!.bonusPower).toBe(-2);
  });
});

describe('integration: reaction triggers', () => {
  it('avenger gains +2 when allied card is destroyed', () => {
    let state = setupControlledGame(['filler-1'], ['filler-1']);

    const a = injectCard(state, 'avenger', { row: 0, col: 0 }, 0);
    state = a.state;
    const avengerId = a.instanceId;

    const ally = injectCard(state, 'r1-basic', { row: 0, col: 1 }, 0);
    state = ally.state;
    const allyId = ally.instanceId;

    // Destroy the ally
    state = destroyCard(state, allyId);

    expect(state.cardInstances[avengerId]!.bonusPower).toBe(2);
  });

  it('predator gains +3 when enemy card is destroyed', () => {
    let state = setupControlledGame(['filler-1'], ['filler-1']);

    const p = injectCard(state, 'predator', { row: 0, col: 0 }, 0);
    state = p.state;
    const predatorId = p.instanceId;

    const enemy = injectCard(state, 'r1-basic', { row: 0, col: 4 }, 1);
    state = enemy.state;
    const enemyId = enemy.instanceId;

    state = destroyCard(state, enemyId);

    expect(state.cardInstances[predatorId]!.bonusPower).toBe(3);
  });

  it('scavenger gains +1 when any non-self card is destroyed', () => {
    let state = setupControlledGame(['filler-1'], ['filler-1']);

    const s = injectCard(state, 'scavenger', { row: 0, col: 0 }, 0);
    state = s.state;
    const scavengerId = s.instanceId;

    const victim = injectCard(state, 'r1-basic', { row: 1, col: 4 }, 1);
    state = victim.state;

    state = destroyCard(state, victim.instanceId);

    expect(state.cardInstances[scavengerId]!.bonusPower).toBe(1);
  });
});

describe('integration: continuous effects', () => {
  it('aura-buffer gives +1 to adjacent cards while alive', () => {
    let state = setupControlledGame(['filler-1'], ['filler-1']);

    const aura = injectCard(state, 'aura-buffer', { row: 0, col: 2 }, 0);
    state = aura.state;

    const left = injectCard(state, 'r1-basic', { row: 0, col: 1 }, 0);
    state = left.state;
    const leftId = left.instanceId;

    const right = injectCard(state, 'r1-cross', { row: 0, col: 3 }, 0);
    state = right.state;
    const rightId = right.instanceId;

    // Recalculate continuous effects
    state = recalculateContinuousEffects(state);

    expect(getEffectivePower(state, leftId)).toBe(3); // 2 base + 1 aura
    expect(getEffectivePower(state, rightId)).toBe(4); // 3 base + 1 aura
  });

  it('aura-buffer effect disappears when destroyed', () => {
    let state = setupControlledGame(['filler-1'], ['filler-1']);

    const aura = injectCard(state, 'aura-buffer', { row: 0, col: 2 }, 0);
    state = aura.state;

    const target = injectCard(state, 'r1-basic', { row: 0, col: 3 }, 0);
    state = target.state;
    const targetId = target.instanceId;

    state = recalculateContinuousEffects(state);
    expect(getEffectivePower(state, targetId)).toBe(3); // 2 + 1 aura

    // Destroy the aura source
    state = destroyCard(state, aura.instanceId);

    expect(getEffectivePower(state, targetId)).toBe(2); // Back to base
  });

  it('army-scaler power increases with allied cards in lane', () => {
    let state = setupControlledGame(['filler-1'], ['filler-1']);

    const scaler = injectCard(state, 'army-scaler', { row: 0, col: 0 }, 0);
    state = scaler.state;
    const scalerId = scaler.instanceId;

    state = recalculateContinuousEffects(state);
    // No other allies in lane → power = 1 base + 0 scaling
    expect(getEffectivePower(state, scalerId)).toBe(1);

    // Add an ally in the same lane
    const ally1 = injectCard(state, 'r1-basic', { row: 0, col: 1 }, 0);
    state = ally1.state;

    state = recalculateContinuousEffects(state);
    // 1 ally → +2 scaling → power = 1 + 2 = 3
    expect(getEffectivePower(state, scalerId)).toBe(3);

    // Add another ally
    const ally2 = injectCard(state, 'r1-cross', { row: 0, col: 2 }, 0);
    state = ally2.state;

    state = recalculateContinuousEffects(state);
    // 2 allies → +4 scaling → power = 1 + 4 = 5
    expect(getEffectivePower(state, scalerId)).toBe(5);
  });

  it('dual-aura buffs allies and debuffs enemies', () => {
    let state = setupControlledGame(['filler-1'], ['filler-1']);

    const aura = injectCard(state, 'dual-aura', { row: 0, col: 2 }, 0);
    state = aura.state;

    const ally = injectCard(state, 'r1-basic', { row: 0, col: 1 }, 0);
    state = ally.state;
    const allyId = ally.instanceId;

    const enemy = injectCard(state, 'r1-basic', { row: 0, col: 3 }, 1);
    state = enemy.state;
    const enemyId = enemy.instanceId;

    state = recalculateContinuousEffects(state);

    expect(getEffectivePower(state, allyId)).toBe(3); // 2 + 1
    expect(getEffectivePower(state, enemyId)).toBe(1); // 2 - 1
  });
});

describe('integration: cascade scenarios', () => {
  it('enfeeble → death → whenDestroyed cascade', () => {
    // chain-killer enfeebles target by -5, target (death-curse, power 2) dies,
    // death-curse whenDestroyed enfeebles all enemies in lane by -2
    let state = setupControlledGame(['chain-killer'], ['filler-1']);

    // Set up death-curse as the target
    const curse = injectCard(state, 'death-curse', { row: 0, col: 1 }, 1);
    state = curse.state;
    const curseId = curse.instanceId;

    // And a P0 card in the same lane that death-curse will target
    const p0card = injectCard(state, 'r2-basic', { row: 0, col: 2 }, 0);
    state = p0card.state;

    // chain-killer at (0,0) targets (0,1) via ability range col+1
    state = playCard(state, 'chain-killer', { row: 0, col: 0 });

    // death-curse should be dead
    expect(state.cardInstances[curseId]).toBeUndefined();

    // death-curse's whenDestroyed enfeebles enemies in its lane.
    // death-curse is owned by P1, so enemies are P0's cards.
    // chain-killer (P0) is at (0,0), p0card (P0) at (0,2) → both enfeebled by -2
    // chain-killer: power 2 + (-2) = 0 → should also die (or have -2 bonusPower)!
    const killerCardId = state.board[0]![0]!.cardInstanceId;
    const killerInstance = killerCardId ? state.cardInstances[killerCardId] : undefined;
    // Either dead or enfeebled by -2
    expect(killerInstance === undefined || killerInstance.bonusPower === -2).toBe(true);
  });

  it('cascadeGrower gains power from chain deaths', () => {
    let state = setupControlledGame(['chain-killer'], ['filler-1']);

    // Target: enemy card that will die from enfeeble
    const target = injectCard(state, 'r1-basic', { row: 0, col: 1 }, 1);
    state = target.state;

    // Cascade grower watches for any destruction
    const grower = injectCard(state, 'cascade-grower', { row: 1, col: 0 }, 0);
    state = grower.state;
    const growerId = grower.instanceId;

    state = playCard(state, 'chain-killer', { row: 0, col: 0 });

    // Target dies → cascade-grower gets +2
    expect(state.cardInstances[growerId]!.bonusPower).toBe(2);
  });

  it('multiple death reactions fire in order', () => {
    let state = setupControlledGame(['filler-1'], ['filler-1']);

    // Two scavengers watching for deaths
    const s1 = injectCard(state, 'scavenger', { row: 0, col: 0 }, 0);
    state = s1.state;
    const s1Id = s1.instanceId;

    const s2 = injectCard(state, 'cascade-grower', { row: 1, col: 0 }, 0);
    state = s2.state;
    const s2Id = s2.instanceId;

    // Destroy a third card
    const victim = injectCard(state, 'r1-basic', { row: 2, col: 4 }, 1);
    state = victim.state;

    state = destroyCard(state, victim.instanceId);

    // Both should have gained bonuses
    expect(state.cardInstances[s1Id]!.bonusPower).toBe(1); // scavenger +1
    expect(state.cardInstances[s2Id]!.bonusPower).toBe(2); // cascade-grower +2
  });
});

describe('integration: one-shot flag triggers', () => {
  it('whenFirstEnfeebled fires once then never again', () => {
    let state = setupControlledGame(['enfeeble-on-play', 'enfeeble-on-play'], ['filler-1']);

    // Set up resilient card as target
    const res = injectCard(state, 'resilient', { row: 0, col: 1 }, 1);
    state = res.state;
    const resId = res.instanceId;

    // P0 plays enfeeble at (0,0) targeting (0,1) — resilient gets enfeebled
    // Resilient: power 4, enfeeble -3 → power becomes 4+0+(-3)=1, triggers whenFirstEnfeebled → +3
    // Net bonusPower: -3 + 3 = 0, effective power = 4 + 0 = 4
    state = playCard(state, 'enfeeble-on-play', { row: 0, col: 0 });

    const resilientAfter = state.cardInstances[resId];
    expect(resilientAfter).toBeDefined();
    expect(resilientAfter!.bonusPower).toBe(0); // -3 + 3
    expect(resilientAfter!.hasBeenEnfeebled).toBe(true);
  });

  it('whenPowerReachesN fires once when threshold met', () => {
    let state = setupControlledGame(['enhancer-on-play'], ['filler-1']);

    // threshold5-destroyer: power 3, triggers at 5
    const td = injectCard(state, 'threshold5-destroyer', { row: 0, col: 1 }, 0);
    state = td.state;
    const tdId = td.instanceId;

    // Add enemy in same lane for the destroy target
    const enemy = injectCard(state, 'r1-basic', { row: 0, col: 4 }, 1);
    state = enemy.state;
    const enemyId = enemy.instanceId;

    // enhancer-on-play at (0,0) targets (0,1) → threshold5 gets +2
    // Power becomes 3 + 2 = 5 → reaches threshold → destroys all enemies in lane
    state = playCard(state, 'enhancer-on-play', { row: 0, col: 0 });

    expect(state.cardInstances[tdId]!.powerReachedN).toBe(true);
    expect(state.cardInstances[enemyId]).toBeUndefined(); // destroyed
  });
});

describe('integration: endOfGame scoring', () => {
  it('laneScoreBonus adds bonus points to lane score', () => {
    let state = setupControlledGame(['filler-1'], ['filler-1']);

    // lane-bonus (P0) in lane 0: adds +5 to P0's lane score
    const lb = injectCard(state, 'lane-bonus', { row: 0, col: 0 }, 0);
    state = lb.state;

    // End game
    state = { ...state, phase: GAME_PHASES.ENDED };

    const finalScores = calculateFinalScores(state);

    // Lane 0: P0 has lane-bonus with power 1 + bonus 5 = 6 total
    expect(finalScores[0]).toBe(6);
  });

  it('scoreRedistribution gives lane winner both scores', () => {
    let state = setupControlledGame(['filler-1'], ['filler-1']);

    // P0 card in lane 0
    const p0card = injectCard(state, 'r2-basic', { row: 0, col: 0 }, 0); // power 5
    state = p0card.state;

    // P1 card in lane 0
    const p1card = injectCard(state, 'r1-basic', { row: 0, col: 4 }, 1); // power 2
    state = p1card.state;

    // Score redistributor in lane 0
    const sr = injectCard(state, 'score-redistributor', { row: 0, col: 2 }, 0);
    state = sr.state;

    state = { ...state, phase: GAME_PHASES.ENDED };

    const finalScores = calculateFinalScores(state);
    // P0 wins lane 0: normally gets 5+1 = 6 (r2-basic 5 + redistributor 1)
    // With redistribution, P0 gets 6 + 2 = 8
    expect(finalScores[0]).toBe(8);
    expect(finalScores[1]).toBe(0);
  });
});

describe('integration: continuous effect lifecycle', () => {
  it('whileInPlay modifiers are rebuilt after each ability resolution', () => {
    let state = setupControlledGame(['aura-buffer'], ['filler-1']);

    // Place a target card adjacent to where aura will be placed
    const target = injectCard(state, 'r1-basic', { row: 0, col: 1 }, 0);
    state = target.state;
    const targetId = target.instanceId;

    // Before aura: effective power should be base only
    expect(getEffectivePower(state, targetId)).toBe(2);

    // Set (0,0) owned by P0 for placement
    state = playCard(state, 'aura-buffer', { row: 0, col: 0 });

    // After ability resolution, continuous effects should be recalculated
    // aura-buffer at (0,0) affects (0,1) via ability range col+1 and col-1
    // (0,1) should get +1 from aura
    expect(getEffectivePower(state, targetId)).toBe(3);
  });

  it('scaling updates dynamically as cards enter/leave board', () => {
    let state = setupControlledGame(['filler-1'], ['filler-1']);

    // army-scaler in lane 0
    const scaler = injectCard(state, 'army-scaler', { row: 0, col: 0 }, 0);
    state = scaler.state;
    const scalerId = scaler.instanceId;

    state = recalculateContinuousEffects(state);
    expect(getEffectivePower(state, scalerId)).toBe(1); // base only

    // Add ally
    const ally = injectCard(state, 'r1-basic', { row: 0, col: 1 }, 0);
    state = ally.state;
    const allyId = ally.instanceId;

    state = recalculateContinuousEffects(state);
    expect(getEffectivePower(state, scalerId)).toBe(3); // 1 + 2*1

    // Remove ally
    state = destroyCard(state, allyId);
    expect(getEffectivePower(state, scalerId)).toBe(1); // back to base
  });
});

describe('integration: range mirroring for abilities', () => {
  it('ability range mirrors for player 1', () => {
    let state = setupControlledGame(['filler-1'], ['enhancer-on-play']);

    // Pass P0's turn
    state = pass(state);

    // P1 plays enhancer at (0,4) — ability range col+1 mirrors to col-1 for P1
    // Target at (0,3)
    const target = injectCard(state, 'r1-basic', { row: 0, col: 3 }, 1);
    state = target.state;
    const targetId = target.instanceId;

    state = playCard(state, 'enhancer-on-play', { row: 0, col: 4 });

    expect(state.cardInstances[targetId]!.bonusPower).toBe(2);
  });
});

describe('integration: full game flow with abilities', () => {
  it('complete game with ability cards from start to scoring', () => {
    let state = setupControlledGame(
      ['enhancer-on-play', 'r1-basic', 'lane-bonus'],
      ['r1-basic', 'r1-cross'],
    );

    // P0: play r1-basic at (0,0) — setup for enhancement
    state = playCard(state, 'r1-basic', { row: 0, col: 0 });

    // P1: play r1-basic at (0,4)
    state = playCard(state, 'r1-basic', { row: 0, col: 4 });

    // P0: need to play on a valid tile. Col 0 row 1 is still P0's
    // Play lane-bonus at (1,0)
    state = playCard(state, 'lane-bonus', { row: 1, col: 0 });

    // P1: pass
    state = pass(state);
    // P0: pass → game ends
    state = pass(state);

    expect(state.phase).toBe(GAME_PHASES.ENDED);
    const scores = calculateFinalScores(state);
    // Game should produce valid scores
    expect(scores[0]).toBeGreaterThanOrEqual(0);
    expect(scores[1]).toBeGreaterThanOrEqual(0);
  });
});

describe('integration: token card support', () => {
  it('token definitions are accepted in card definitions', () => {
    const defs = allDefs();
    expect(defs['token-basic']).toBeDefined();
    expect(defs['token-basic']!.isToken).toBe(true);
  });

  it('spawned token cards have correct properties', () => {
    let state = setupControlledGame(['spawner'], ['filler-1']);

    // Ensure (0,1) is P0-owned and empty
    let board = state.board;
    board = board.map((r, ri) =>
      ri === 0
        ? r.map((t, ci) => (ci === 1 ? { ...t, owner: 0 as PlayerId, pawnCount: 1 } : t))
        : r,
    );
    state = { ...state, board };

    state = playCard(state, 'spawner', { row: 0, col: 0 });

    const spawnedId = state.board[0]![1]!.cardInstanceId;
    expect(spawnedId).not.toBeNull();
    const spawned = state.cardInstances[spawnedId!]!;
    expect(spawned.definitionId).toBe('token-basic');
    expect(spawned.owner).toBe(0);
    expect(spawned.basePower).toBe(1);
    expect(spawned.bonusPower).toBe(0);
  });
});

describe('integration: whenAlliedPlayed / whenEnemyPlayed triggers', () => {
  it('ally-watcher gains +1 when owner plays another card', () => {
    let state = setupControlledGame(['r1-basic'], ['filler-1']);

    // Inject ally-watcher already on board for P0
    const watcher = injectCard(state, 'ally-watcher', { row: 1, col: 0 }, 0);
    state = watcher.state;
    const watcherId = watcher.instanceId;

    // P0 plays r1-basic at (0,0) — ally-watcher should trigger
    state = playCard(state, 'r1-basic', { row: 0, col: 0 });

    expect(state.cardInstances[watcherId]!.bonusPower).toBe(1);
  });

  it('ally-watcher does NOT trigger for enemy plays', () => {
    let state = setupControlledGame(['filler-1'], ['r1-basic']);

    // Inject ally-watcher for P0
    const watcher = injectCard(state, 'ally-watcher', { row: 1, col: 0 }, 0);
    state = watcher.state;
    const watcherId = watcher.instanceId;

    // P0 passes
    state = pass(state);

    // P1 plays r1-basic — ally-watcher (P0) should NOT trigger
    state = playCard(state, 'r1-basic', { row: 0, col: 4 });

    expect(state.cardInstances[watcherId]!.bonusPower).toBe(0);
  });

  it('ally-watcher does NOT trigger for its own play', () => {
    // If ally-watcher is in hand and played, it should not trigger itself
    let state = setupControlledGame(['ally-watcher'], ['filler-1']);

    state = playCard(state, 'ally-watcher', { row: 0, col: 0 });

    // Find the ally-watcher instance on the board
    const tile = state.board[0]![0]!;
    const instanceId = tile.cardInstanceId!;
    expect(state.cardInstances[instanceId]!.bonusPower).toBe(0);
  });

  it('enemy-watcher gains +2 when opponent plays a card', () => {
    let state = setupControlledGame(['filler-1'], ['r1-basic']);

    // Inject enemy-watcher for P0
    const watcher = injectCard(state, 'enemy-watcher', { row: 1, col: 0 }, 0);
    state = watcher.state;
    const watcherId = watcher.instanceId;

    // P0 passes
    state = pass(state);

    // P1 plays r1-basic — enemy-watcher (P0) should trigger
    state = playCard(state, 'r1-basic', { row: 0, col: 4 });

    expect(state.cardInstances[watcherId]!.bonusPower).toBe(2);
  });

  it('enemy-watcher does NOT trigger for allied plays', () => {
    let state = setupControlledGame(['r1-basic'], ['filler-1']);

    const watcher = injectCard(state, 'enemy-watcher', { row: 1, col: 0 }, 0);
    state = watcher.state;
    const watcherId = watcher.instanceId;

    // P0 plays r1-basic — enemy-watcher (P0) should NOT trigger
    state = playCard(state, 'r1-basic', { row: 0, col: 0 });

    expect(state.cardInstances[watcherId]!.bonusPower).toBe(0);
  });
});

describe('integration: filtered target selectors (enhanced/enfeebled)', () => {
  it('enfeebled-hunter targets only already-enfeebled enemy cards', () => {
    let state = setupControlledGame(['enfeeble-on-play', 'enfeebled-hunter'], ['filler-1']);

    // Inject enemy at (0,1) to be in enfeeble-on-play's ability range (col+1)
    const e1 = injectCard(state, 'r2-basic', { row: 0, col: 1 }, 1);
    state = e1.state;
    const e1Id = e1.instanceId;

    // Inject another enemy NOT in ability range
    const e2 = injectCard(state, 'r2-basic', { row: 1, col: 4 }, 1);
    state = e2.state;
    const e2Id = e2.instanceId;

    // P0 enfeebles e1 at (0,1) — e1 gets -3, becomes enfeebled
    state = playCard(state, 'enfeeble-on-play', { row: 0, col: 0 });

    // e1 should have hasBeenEnfeebled = true, power 5-3=2
    expect(state.cardInstances[e1Id]!.hasBeenEnfeebled).toBe(true);
    expect(state.cardInstances[e2Id]!.hasBeenEnfeebled).toBeUndefined();

    // Now P1 passes (turn switches to P1 after P0 plays)
    state = pass(state);

    // P0 plays enfeebled-hunter — targets allEnemyEnfeebled
    // Should only hit e1 (enfeebled), not e2
    // e1: base 5, -3 enfeeble = effective 2, then -2 from hunter = effective 0 → dies
    state = playCard(state, 'enfeebled-hunter', { row: 1, col: 0 });

    // e1 dies (power 5 -3 -2 = 0 → death check destroys it)
    expect(state.cardInstances[e1Id]).toBeUndefined();
    // e2 was never enfeebled, so hunter doesn't target it
    expect(state.cardInstances[e2Id]!.bonusPower).toBe(0);
  });

  it('enhanced-booster targets only already-enhanced allied cards', () => {
    let state = setupControlledGame(['enhancer-on-play', 'enhanced-booster'], ['filler-1']);

    // Inject two allied cards
    const ally1 = injectCard(state, 'r1-basic', { row: 0, col: 1 }, 0);
    state = ally1.state;
    const ally1Id = ally1.instanceId;

    const ally2 = injectCard(state, 'r1-basic', { row: 1, col: 1 }, 0);
    state = ally2.state;
    const ally2Id = ally2.instanceId;

    // P0 plays enhancer-on-play at (0,0) — targets (0,1) via ability range
    // ally1 gets +2
    state = playCard(state, 'enhancer-on-play', { row: 0, col: 0 });

    expect(state.cardInstances[ally1Id]!.hasBeenEnhanced).toBe(true);
    expect(state.cardInstances[ally2Id]!.hasBeenEnhanced).toBeUndefined();

    // P1 passes
    state = pass(state);

    // P0 plays enhanced-booster — targets allAlliedEnhanced
    // Should only hit ally1 (enhanced), not ally2
    state = playCard(state, 'enhanced-booster', { row: 1, col: 0 });

    expect(state.cardInstances[ally1Id]!.bonusPower).toBe(4); // +2 from enhancer + +2 from booster
    expect(state.cardInstances[ally2Id]!.bonusPower).toBe(0); // untouched
  });
});

describe('integration: dynamicValue replacement effects', () => {
  it('replacement-dynamic gains power equal to replaced card effective power', () => {
    let state = setupControlledGame(['replacement-dynamic'], ['filler-1']);

    // Inject an allied card to replace — r2-basic has power 5
    const target = injectCard(state, 'r2-basic', { row: 0, col: 0 }, 0);
    state = target.state;
    const targetId = target.instanceId;

    // P0 plays replacement-dynamic at (0,0) replacing r2-basic
    state = playCard(state, 'replacement-dynamic', { row: 0, col: 0 });

    // Old card should be destroyed
    expect(state.cardInstances[targetId]).toBeUndefined();

    // Find the replacement card instance
    const repInstanceId = state.board[0]![0]!.cardInstanceId;
    expect(repInstanceId).not.toBeNull();
    const repInstance = state.cardInstances[repInstanceId!]!;
    expect(repInstance.definitionId).toBe('replacement-dynamic');
    // base power 1 + bonus 5 (from replaced card's effective power)
    expect(repInstance.basePower).toBe(1);
    expect(repInstance.bonusPower).toBe(5);
    expect(getEffectivePower(state, repInstanceId!)).toBe(6);
  });

  it('replacement-dynamic accounts for modifiers on replaced card', () => {
    let state = setupControlledGame(['replacement-dynamic'], ['filler-1']);

    // Inject a card with bonus power
    const target = injectCard(state, 'r1-basic', { row: 0, col: 0 }, 0);
    state = target.state;
    const targetId = target.instanceId;

    // Manually add bonus power to simulate prior enhancement
    state = {
      ...state,
      cardInstances: {
        ...state.cardInstances,
        [targetId]: { ...state.cardInstances[targetId]!, bonusPower: 3 },
      },
    };
    // Effective power = 2 (base) + 3 (bonus) = 5

    state = playCard(state, 'replacement-dynamic', { row: 0, col: 0 });

    const repInstanceId = state.board[0]![0]!.cardInstanceId!;
    // Should gain +5 from effective power of replaced card (2 base + 3 bonus)
    expect(getEffectivePower(state, repInstanceId)).toBe(6); // 1 base + 5 bonus
  });

  it('replacedCardPower is cleaned up after ability resolution', () => {
    let state = setupControlledGame(['replacement-dynamic'], ['filler-1']);

    const target = injectCard(state, 'r1-basic', { row: 0, col: 0 }, 0);
    state = target.state;

    state = playCard(state, 'replacement-dynamic', { row: 0, col: 0 });

    // replacedCardPower should be undefined after play completes
    expect(state.replacedCardPower).toBeUndefined();
  });
});

describe('integration: multi-token addCardToHand', () => {
  it('multi-token-generator adds different token types to hand', () => {
    let state = setupControlledGame(['multi-token-generator'], ['filler-1']);

    state = playCard(state, 'multi-token-generator', { row: 0, col: 0 });

    // P0 hand should have 1 token-basic + 1 token-strong
    const p0Hand = state.players[0].hand;
    expect(p0Hand.filter((id) => id === 'token-basic')).toHaveLength(1);
    expect(p0Hand.filter((id) => id === 'token-strong')).toHaveLength(1);
  });
});
