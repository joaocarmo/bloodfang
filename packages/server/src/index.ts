import { serve } from '@hono/node-server';
import { loadConfig } from './config.js';
import { ConsoleLogger } from './logger.js';
import { createApp } from './app.js';

// ── Bootstrap ────────────────────────────────────────────────────────

const config = loadConfig();
const logger = new ConsoleLogger(config.logLevel);
const { app, manager, injectWebSocket } = createApp({
  corsOrigin: config.corsOrigin,
  maxSessions: config.maxSessions,
  logger,
});

// ── Server Start ─────────────────────────────────────────────────────

manager.start();

const server = serve({ fetch: app.fetch, port: config.port }, (info) => {
  logger.info('server.started', { port: info.port, logLevel: config.logLevel });
  injectWebSocket(server);
});

// ── Graceful Shutdown ────────────────────────────────────────────────

function shutdown(signal: string) {
  logger.info('server.shutdown', { reason: signal });
  manager.shutdownAll();
  manager.stop();

  server.close(() => {
    process.exit(0);
  });

  // Force exit after 10 seconds
  setTimeout(() => {
    process.exit(1);
  }, 10_000).unref();
}

process.on('SIGTERM', () => {
  shutdown('SIGTERM');
});
process.on('SIGINT', () => {
  shutdown('SIGINT');
});
