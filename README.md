# Blood Fang

A strategic card game on a 3x5 grid featuring a standalone rules engine and a complete playable web client with original creative identity.

## What's Here

- **Engine** (`@bloodfang/engine`) — A reusable rules engine. Pure game logic as a library: grid placement, pawn scoring, card abilities, lane scoring. No UI, no networking, zero dependencies.
- **Client** (`@bloodfang/client`) — A complete web client with original theme, art, and names built on top of the engine. Hot-seat multiplayer for two players.

## Tech Stack

- TypeScript, pnpm workspaces
- Engine: pure functions, immutable state, vitest
- Client: React 19, Vite, Tailwind CSS v4, Zustand, Lingui i18n, Motion

## Getting Started

```bash
pnpm install
pnpm -F @bloodfang/engine build
pnpm -F @bloodfang/client dev
```

## Scripts

```bash
# Engine
pnpm -F @bloodfang/engine build       # Build (ESM + types)
pnpm -F @bloodfang/engine test        # Run tests

# Client
pnpm -F @bloodfang/client dev         # Dev server
pnpm -F @bloodfang/client build       # Type-check + production build
pnpm -F @bloodfang/client test        # Integration tests
pnpm -F @bloodfang/client lint        # ESLint

# Repo-wide
pnpm format                           # Prettier format
pnpm format:check                     # Prettier check
```

## Project Structure

```
packages/
  engine/    Core rules engine (standalone library)
  client/    React web UI
```

## CI

GitHub Actions runs on every push to `main` and on pull requests. It checks formatting, lints, runs all tests, and builds both packages.

## Contributing

Contributions welcome! See `PROJECT.md` for design goals and `PLAN.md` for the current implementation plan.

## License

[MIT](LICENSE)
