# Blood Fang

A grid-based card battle game featuring a standalone rules engine and a complete playable game with original creative identity.

## What's Here

- **Engine** (`@bloodfang/engine`) — A reusable rules engine. Pure game logic as a library: 3x5 grid, pawn placement, card abilities, lane scoring. No UI, no networking.
- **Game** — A complete card game with original theme, art, and names built on top of the engine.

## Tech Stack

- TypeScript, pnpm workspaces
- Engine: pure functions, immutable state, vitest
- Client: React + Vite (Phase 3)
- Server: Colyseus (Phase 4)

## Getting Started

```bash
pnpm install
pnpm run build
pnpm run test
```

## Project Structure

```
packages/
  engine/    Core rules engine (standalone library)
  client/    Web UI (planned)
  server/    Multiplayer server (planned)
```

## Contributing

Contributions welcome! See `PROJECT.md` for design goals and `PLAN.md` for the current implementation plan.

## License

[MIT](LICENSE)
