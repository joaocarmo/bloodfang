# ── Stage 1: Install & Build ──────────────────────────────────────────
FROM node:24-slim AS builder

RUN corepack enable && corepack prepare pnpm@10.30.3 --activate

WORKDIR /app

# Copy workspace root files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.base.json ./

# Copy package manifests for dependency resolution
COPY packages/engine/package.json packages/engine/
COPY packages/server/package.json packages/server/tsup.config.ts packages/server/

# Install dependencies (frozen lockfile for reproducibility)
RUN pnpm install --frozen-lockfile

# Copy source files
COPY packages/engine/ packages/engine/
COPY packages/server/src/ packages/server/src/
COPY packages/server/tsconfig.json packages/server/

# Build engine first (server depends on it), then server
RUN pnpm -F @bloodfang/engine build && pnpm -F @bloodfang/server build

# ── Stage 2: Production Runtime ──────────────────────────────────────
FROM node:24-slim AS runtime

RUN corepack enable && corepack prepare pnpm@10.30.3 --activate

WORKDIR /app

# Copy workspace root files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy package manifests
COPY packages/engine/package.json packages/engine/
COPY packages/server/package.json packages/server/

# Install production dependencies only
RUN pnpm install --frozen-lockfile --prod

# Copy built artifacts from builder
COPY --from=builder /app/packages/engine/dist/ packages/engine/dist/
COPY --from=builder /app/packages/server/dist/ packages/server/dist/

ENV PORT=3001
ENV LOG_LEVEL=INFO
ENV NODE_ENV=production

EXPOSE 3001

CMD ["node", "packages/server/dist/index.js"]
