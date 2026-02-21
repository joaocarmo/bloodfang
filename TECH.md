# Technology Decisions

## Language: TypeScript

### Why TypeScript over Rust

Evaluated Rust with WASM/napi-rs bindings against pure TypeScript. TypeScript wins for this project:

| Factor | TypeScript | Rust + WASM |
|---|---|---|
| Runtime targets | Browser, Node.js, Deno, Bun, Workers — zero config | Requires wasm-bindgen + napi-rs bindings per target |
| Contributor accessibility | Anyone who knows JS can add card data | Rust toolchain + borrow checker + WASM setup |
| Type system for abilities | Discriminated unions + exhaustiveness checks | `enum` + `match` — more elegant but... |
| WASM enum limitation | N/A | **wasm-bindgen cannot export data-carrying enums** (issue #2407, open since 2021). Our 11 ability trigger types with associated data are exactly this. Must serialize through serde — JS consumers see plain objects anyway. |
| Performance | Microseconds for a 15-tile board. Irrelevant. | ~5-20x faster. Still irrelevant for turn-based play. |
| Build complexity | `pnpm install` | Rust toolchain + wasm32 target + wasm-bindgen-cli + wasm-opt + napi-rs for Node native |
| Debugging | `console.log(state)` | DWARF extension, limited source maps, `web_sys::console::log_1(...)` |
| Testing | Single test suite everywhere | Native tests + separate WASM tests via wasm-bindgen-test |
| License concerns | None | None (both MIT-compatible) |

**The decisive argument:** The exact feature that makes Rust attractive for this project (algebraic data types for modeling 11 ability triggers with associated data) doesn't work across the WASM boundary. You'd serialize everything through `serde` and TypeScript consumers would see `{ type: 'whenPlayed', ... }` discriminated unions either way. You pay the full cost of Rust's complexity without getting the benefit at the API surface.

**If performance ever matters** (e.g., AI MCTS playouts in a future phase), a focused Rust/WASM module for just the simulation inner loop can be added later without the entire engine being in Rust.

### TypeScript type system for this domain

Discriminated unions model the ability system well:

```typescript
type AbilityTrigger =
  | { type: 'whenPlayed' }
  | { type: 'whileInPlay' }
  | { type: 'whenDestroyed' }
  | { type: 'whenAlliedDestroyed' }
  | { type: 'whenEnemyDestroyed' }
  | { type: 'whenAnyDestroyed' }
  | { type: 'whenFirstEnfeebled' }
  | { type: 'whenFirstEnhanced' }
  | { type: 'whenPowerReaches'; threshold: number }
  | { type: 'scaling'; condition: ScalingCondition }
  | { type: 'endOfGame' };
```

With `switch-exhaustiveness-check` (ESLint rule) or the `satisfies never` pattern, the compiler catches any unhandled trigger type at build time — same correctness guarantee as Rust's `match`.

---

## Framework: None (from scratch)

### Why not boardgame.io

- **Last npm release ~3 years ago.** Community has raised maintenance concerns (issue #1150).
- Helps with multiplayer infrastructure (state sync, lobby, matchmaking, secret state), but ~90% of Blood Fang logic must be custom anyway.
- Built-in MCTS AI does random playouts with no evaluation function — unusable for competitive play.
- Couples game logic to boardgame.io's `(G, ctx) => newG` API surface. If the project stalls, extracting logic is a migration.
- **Verdict:** Rejected. Colyseus was chosen for networking (see Server section below).

### Why not Godot Card Game Framework

- **AGPL-3.0 license** — forces all downstream projects to be AGPL. Hostile to "community-driven, extensible" goals.
- Locks into Godot engine + GDScript. Engine cannot run headlessly for server-side validation.
- GDScript has a much smaller contributor pool than TypeScript.
- No multiplayer or AI support — the features we'd actually want help with.
- WASM exports produce large bundles (20-40MB) for a card game.

### What a framework would help with vs. what we build ourselves

| Component | Complexity | Framework help? |
|---|---|---|
| Board state (3x5 grid, pawns) | Low | Neither helps |
| Card data model | Low | Neither helps |
| Placement validation | Medium | Neither helps |
| Pawn placement/capture | Medium | Neither helps |
| Range pattern resolution | Medium | Neither helps |
| Turn flow (play/pass/end) | Low | boardgame.io: slight |
| Lane scoring | Low | Neither helps |
| **Ability system (triggers, chains)** | **High** | Neither helps meaningfully |
| **Networked multiplayer** | **High** | Colyseus (chosen — see Server section) |
| Matchmaking/lobby | Medium | Colyseus (chosen — see Server section) |

The two hardest domain-specific problems (ability system, chain cascading) get zero framework help. Networking is handled by Colyseus (see Server section).

---

## Architecture

Three packages in a pnpm monorepo:

```
packages/
  engine/                Pure TS library, zero dependencies, MIT license
    src/
      board.ts          3x5 grid, tiles, pawn state
      card.ts           Card model, range patterns (mechanics only — no names/art/lore)
      abilities.ts      Trigger system, effect resolution, chain cascading
      game.ts           Turn flow, draw, mulligan, placement, scoring
      types.ts          Shared types
      index.ts          Public API
    cards/
      starter.ts        ~20-30 card definitions for testing (mechanics only, placeholder IDs)

  client/                Web UI — React + Vite
    src/
      cards/            Full card database with original names, art, lore, flavor text
      components/       React components (board, hand, card, deck builder)
      hooks/            Game state hooks, Colyseus room hooks
      assets/           Card art, sounds, fonts

  server/                Multiplayer game server — Colyseus
    src/
      rooms/            Colyseus room definitions (game room, lobby)
      schema/           Colyseus @colyseus/schema state definitions (mirrors engine state)
      services/         Matchmaking, deck validation
```

### Dependency graph

```
client → engine    (types, client-side validation, move previews)
server → engine    (authoritative game logic, all state transitions)
client ← → server  (Colyseus WebSocket protocol, no direct import)
```

No circular dependencies. `engine` depends on nothing.

### The boundary

The engine knows nothing about names, art, or lore. A card in the engine is:

```typescript
{
  id: string;
  rank: 1 | 2 | 3 | 'replacement';
  power: number;
  rangePattern: RangeCell[];      // [{offset: {row, col}, type: 'pawn' | 'ability' | 'both'}]
  ability?: Ability;              // trigger + effect, fully mechanical
}
```

The client maps engine card IDs to creative identity:

```typescript
{
  engineCardId: string;
  name: string;                   // original name
  art: string;                    // path to original artwork
  lore: string;                   // flavor text
  rarity: 'standard' | 'legendary';
}
```

This separation means:
- The engine can be published independently — anyone can build their own game on top
- The game's creative layer can be swapped, extended, or localized without touching game logic
- Contributors can work on mechanics or creative identity independently
- Third parties can create entirely different themes on the same engine

### Design principles

- **Pure functions.** The engine exports `createGame()`, `playCard(state, cardId, position)`, `pass(state)`, `getValidMoves(state)`. Every function takes state in, returns new state out. No side effects.
- **Zero dependencies.** The engine package has no npm dependencies. Consumers bring their own UI, networking, and storage.
- **Testable.** Pure state transformations are trivially unit-testable. With 145 cards and chain cascading abilities, exhaustive testing is critical.
- **Portable.** Runs anywhere JavaScript runs: browser, Node.js, Deno, Bun, Web Workers, serverless functions.
- **Layered.** Client and server are consumers of the engine, not part of it. All three can evolve independently.

---

## Monorepo: pnpm workspaces

pnpm workspaces over Nx or Turborepo. Three packages doesn't justify the config overhead. `pnpm -F engine test`, `pnpm -F client dev`, `pnpm -F server dev` — done. Migration to Turborepo is trivial if the repo grows significantly.

---

## Client: React + Vite

### Why React

- Largest ecosystem and community — easiest to find contributors, libraries, examples
- Vite provides fast HMR and zero-config React setup via `@vitejs/plugin-react`
- React's component model maps cleanly to the game's UI (Board → Row → Tile → Card, Hand → Card, DeckBuilder)
- If canvas-rendered animations are needed later (card plays, pawn captures), Pixi.js integrates well via `@pixi/react`

### Alternatives considered

| Framework | Verdict |
|---|---|
| Svelte 5 | Less boilerplate, great reactivity — but smaller ecosystem, fewer game-specific libraries |
| Solid | Excellent perf — but niche community, contributor accessibility matters more |
| Vue | Viable — but no meaningful advantage over React for this use case |

---

## Server: Colyseus

### Why Colyseus

Colyseus is purpose-built for the exact problem Blood Fang needs to solve: authoritative turn-based multiplayer with rooms, matchmaking, and state synchronization.

**Key features for this project:**
- **Room-based architecture** — maps directly to game matches: create room → matchmake → play → dispose
- **Automatic delta-compressed state sync** via `@colyseus/schema` — define state schema, Colyseus handles serialization, diffing, and broadcasting
- **`StateView` (new in 0.16)** — per-client state visibility, critical for card games where players see different hands
- **Built-in matchmaking** with room filtering and queuing
- **Built-in reconnection** — players can reconnect to in-progress games
- **Authoritative server model** — all state changes happen server-side, clients receive patches
- **TypeScript-native** — written in TypeScript, first-class TS support throughout

**How it integrates with the engine:**
- Server rooms import `@bloodfang/engine` for all game logic
- `@colyseus/schema` state mirrors engine state (thin translation layer)
- Client actions (play card, pass, mulligan) are Colyseus messages → server validates via engine → state patches broadcast back
- Engine stays pure and framework-agnostic; Colyseus is the networking adapter

### Alternatives considered

| Framework | Verdict |
|---|---|
| Nakama | More battle-tested (11.6K stars, backed by Heroic Labs) and feature-complete (accounts, friends, leaderboards, chat built in). But no automatic state sync — you build serialization and diffing yourself. Server logic runs in an embedded JS runtime inside Go, not native Node.js. Significantly heavier setup for a focused card game. Better suited if we needed the full social platform. |
| Socket.IO + custom | 62.7K stars, 9.7M weekly downloads — safest long-term maintenance bet. But zero game-specific features: rooms exist but matchmaking, state sync, reconnection with state recovery, schema diffing are all DIY. Would spend weeks rebuilding what Colyseus provides on day one. |
| PartyKit / PartyServer | Architecturally elegant (stateful edge rooms on Cloudflare Durable Objects). But explicitly "not recommended for production," locked to Cloudflare platform (not self-hostable on a VPS), and no game-specific features. |
| boardgame.io | Last npm release ~3 years ago. Maintenance concerns (issue #1150). Couples game logic to its API surface. |

### Risks and mitigations

| Risk | Severity | Mitigation |
|---|---|---|
| Single-maintainer bus factor (Endel Dreyer) | Medium | MIT-licensed — fork if abandoned. Colyseus targeting 1.0 in 2026 is a positive signal. |
| Schema 64-field limit per structure | Low | Board is 3x5 with nested schemas. Well within bounds. |
| No client-side prediction | Low | Irrelevant for turn-based play. Latency tolerance is high. |
| Horizontal scaling requires Redis + proxy | Low | Not a concern until thousands of concurrent players. |
