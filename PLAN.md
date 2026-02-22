# Plan: Phase 1 — Blood Fang Core Engine

## Context

We've completed extensive research and design for a Blood Fang card game engine. All architectural decisions are locked: TypeScript, pure functions, immutable state, action log, offset-based range patterns, data-driven abilities, layered power tracking. This plan implements Phase 1: the core engine library with board state, turn flow, card placement, pawn resolution, scoring, mulligan, draw phase, and basic card destruction. Abilities are Phase 2 (types defined now, logic deferred).

## Project Setup

Create a monorepo with pnpm workspaces. Only `packages/engine` for Phase 1. Client (React + Vite) and server (Colyseus) packages are added in later phases.

**Root files:**

- `package.json` — workspace config (private: true)
- `pnpm-workspace.yaml` — `packages: ['packages/*']`
- `tsconfig.base.json` — maximum strictness: strict: true, noUncheckedIndexedAccess: true, exactOptionalPropertyTypes: true, noUnusedLocals: true, noUnusedParameters: true, noPropertyAccessFromIndexSignature: true, noFallthroughCasesInSwitch: true, forceConsistentCasingInFileImports: true, verbatimModuleSyntax: true, target ES2022, module ESNext
- `eslint.config.mjs` — flat config with switch-exhaustiveness-check: error
- `.gitignore` — node_modules, dist, coverage

**Root devDependencies:** typescript ~5.7, vitest ^3.0, eslint ^9.0, @typescript-eslint ^8.0, tsup ^8.0

**Engine package (`packages/engine/`):**

- `package.json` — name: @bloodfang/engine, type: module, build with tsup (ESM + CJS + dts)
- `tsconfig.json` — extends base
- `vitest.config.ts` — tests co-located with source

## File Structure

```
packages/engine/src/
  types.ts              All type definitions + constants
  board.ts              Board creation and manipulation
  board.test.ts
  game.ts               Game creation, mulligan, playCard, pass, getValidMoves
  game.test.ts
  scoring.ts            Lane scoring, final scores, winner
  scoring.test.ts
  power.ts              Effective power calculation
  power.test.ts
  cards/
    test-cards.ts       ~15 test card definitions (no abilities)
  integration.test.ts   Full game flow tests
  index.ts              Public API barrel
```

## Implementation Steps

### Step 1: Scaffolding

Create all config files, install dependencies, verify `pnpm run build` and `pnpm run test` work with a trivial placeholder.

### Step 2: Core Types (`types.ts`)

All types are `readonly` throughout to enforce immutability at the type level.

Key types:

- `PlayerId = 0 | 1` — enables direct array indexing
- `Position = { row: number; col: number }`
- `RangeCell = { row: number; col: number; type: 'pawn' | 'ability' | 'both' }` — offsets from card position
- `CardDefinition = { id, rank: 1|2|3|'replacement', power, rangePattern: RangeCell[], abilities: Ability[] }`
- `CardInstance = { instanceId, definitionId, owner, position, basePower, bonusPower }` — runtime card in play
- `ContinuousModifier = { sourceInstanceId, targetInstanceId, value }` — tracked on game state
- `Tile = { owner: PlayerId|null, pawnCount: 0-3, cardInstanceId: string|null }`
- `PlayerState = { deck: string[], hand: string[], mulliganUsed: boolean }`
- `GameState = { board, players, currentPlayerIndex, turnNumber, phase, consecutivePasses, continuousModifiers, cardInstances: ReadonlyMap, actionLog, nextInstanceId, cardDefinitions: ReadonlyMap }`
- `GameAction` — discriminated union for action log entries (drawCard, placeCard, placePawn, capturePawn, destroyCard, pass, mulligan, gameEnd)
- `GameConfig = { firstPlayer?, initialHandSize?, skipFirstDraw? }`
- Ability types defined for forward compatibility (AbilityTrigger, AbilityEffect, AbilityTarget) — not implemented in Phase 1
- Constants: `BOARD_ROWS=3, BOARD_COLS=5, MAX_PAWN_COUNT=3, DECK_SIZE=15, INITIAL_HAND_SIZE=5`

`cardDefinitions` lives on GameState so the engine is fully self-contained — given a state, you can compute anything without external lookups. Since it's a ReadonlyMap, the reference is shared across state copies (no duplication cost).

### Step 3: Board (`board.ts`)

Functions:

- `createBoard()` — 3x5 grid. P0 owns col 0 (1 pawn each), P1 owns col 4, rest empty.
- `getTile(board, pos)` — safe access, returns undefined if out of bounds
- `isValidPosition(pos)` — bounds check
- `setTile(board, pos, tile)` — returns new board with one tile replaced (via map)
- `allPositions()` — utility for iteration

### Step 4: Game Creation (`game.ts`)

`createGame(p0Deck, p1Deck, definitions, config?, rng?)`:

- Validate deck size = 15, no duplicates, all IDs exist in definitions
- Fisher-Yates shuffle with injected RNG (defaults to Math.random, enables deterministic tests)
- Draw 5 cards per player, log drawCard actions
- Return state in 'mulligan' phase, turnNumber = 0

### Step 5: Mulligan (`game.ts`)

`mulligan(state, player, returnCardIds, rng?)`:

- Return specified cards to deck, shuffle, draw same count
- Mark mulliganUsed = true
- When both players done → phase transitions to 'playing', turnNumber = 1
- Passing on mulligan: call with empty array

### Step 6: Draw Phase

Draw is automatic on turn transition — no separate startTurn call. When `playCard` or `pass` ends a turn:

1. Increment turnNumber, switch currentPlayerIndex
2. If turnNumber > 1, draw 1 card for the new current player
3. If deck is empty, skip draw

This means the consumer always sees the correct hand when inspecting state.

### Step 7: Placement Validation (`game.ts`)

`getValidMoves(state)` — returns all (cardId, positions[]) pairs for current player
`canPlayCard(state, cardId, position)` — single check

Rules:

- Phase must be 'playing'
- Card must be in current player's hand
- Tile must be owned by current player
- Tile pawnCount >= card rank
- Tile must not have a card (unless replacement card targeting allied card)
- Replacement cards MUST target a tile with an allied card

### Step 8: Card Placement + Pawn Resolution (`game.ts`)

`playCard(state, cardId, position)` — the core action:

1. Validate via canPlayCard
2. Remove card from hand
3. Create CardInstance (instanceId from counter, basePower from definition, bonusPower = 0)
4. Place on board tile, add to cardInstances map
5. Reset consecutivePasses to 0
6. Resolve range pattern — pawn placement for 'pawn' and 'both' cells:
   - **Mirror for player 1:** negate column offsets (`col - cell.col` instead of `col + cell.col`)
   - Skip cells that fall off board
   - Unowned/allied tile: add 1 pawn (cap at 3), set owner. Log placePawn.
   - Opponent tile: capture — owner flips, pawnCount stays. Log capturePawn.
   - 'ability'-only cells: no-op in Phase 1
7. For replacement cards: destroyCard on existing card first, then place
8. Log placeCard action
9. Advance turn (Step 6 logic)
10. Check all-tiles-filled end condition

### Step 9: Pass + Game End (`game.ts`)

`pass(state)`:

1. Validate phase = 'playing'
2. Log pass action
3. Increment consecutivePasses
4. If consecutivePasses >= 2: calculate scores, log gameEnd, phase = 'ended'
5. Otherwise: advance turn

`playCard` resets consecutivePasses to 0.

### Step 10: Scoring (`scoring.ts`)

- `calculateLaneScores(state)` — sum effective power per player per row
- `calculateFinalScores(state)` — winner-take-all per lane (loser gets 0, ties both 0), sum remaining
- `determineWinner(finalScores)` — higher total wins, null for draw

### Step 11: Card Destruction (`game.ts`)

`destroyCard(state, instanceId)`:

- Remove card from board tile (set cardInstanceId = null)
- Remove from cardInstances map
- Remove continuous modifiers referencing this card (source or target)
- **Pawns and ownership remain on tile** (best interpretation of unclear rules)
- Log destroyCard action
- Phase 2 adds cascade triggers

### Step 12: Effective Power (`power.ts`)

`getEffectivePower(state, instanceId)`:

- Returns basePower + bonusPower + sum(continuous modifiers targeting this card)
- No clamping — destruction check handles <= 0 separately

### Step 13: Test Cards (`cards/test-cards.ts`)

~15 card definitions covering: rank 1/2/3/replacement, various range patterns (cross, forward, long-range, empty), 'both' and 'ability' cell types. Plus filler cards for deck completion. Helper functions: `buildTestDeck()`, `getAllTestDefinitions()`.

### Step 14: Integration Tests (`integration.test.ts`)

End-to-end scenarios:

1. Both players pass immediately → draw, all lanes 0
2. One card each → scoring works
3. Pawn capture and territory control
4. Draw depletion (empty deck, no error)
5. Mulligan changes hand composition (deterministic RNG)
6. Winning 1 lane beats winning 2 lanes (score 15 vs 5+5)
7. Full action log correctness
8. getValidMoves reflects board state after pawn placement
9. Replacement card flow
10. Range pattern mirroring symmetry for player 1

## Public API (`index.ts`)

```
// Game lifecycle
createGame, mulligan, playCard, pass, destroyCard

// Query
getValidMoves, canPlayCard, getEffectivePower
calculateLaneScores, calculateFinalScores, determineWinner

// Board utilities
createBoard, getTile, isValidPosition

// All types re-exported
// All constants re-exported
```

## Error Handling

Plain `Error` with descriptive messages. No custom error classes (Phase 2 can add a `GameError` union if needed). All public functions validate preconditions and throw on invalid input.

## Verification

1. `pnpm run typecheck` — zero errors with strict config
2. `pnpm run lint` — zero warnings
3. `pnpm run test` — all unit + integration tests pass
4. `pnpm run build` — produces dist/ with ESM + CJS + .d.ts
5. Integration tests cover complete game flows from creation through scoring
