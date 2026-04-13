import { type LogLevel, parseLogLevel } from './logger.js';

export interface ServerConfig {
  readonly port: number;
  readonly corsOrigin: string;
  readonly maxSessions: number;
  readonly logLevel: LogLevel;
}

export function loadConfig(): ServerConfig {
  const port = parsePositiveInt(process.env.PORT, 'PORT') ?? 3001;
  const corsOrigin = process.env.CORS_ORIGIN ?? 'http://localhost:5173';
  const maxSessions = parsePositiveInt(process.env.MAX_SESSIONS, 'MAX_SESSIONS') ?? 1000;
  const logLevel = parseLogLevel(process.env.LOG_LEVEL);

  return { port, corsOrigin, maxSessions, logLevel };
}

function parsePositiveInt(value: string | undefined, name: string): number | undefined {
  if (value === undefined) return undefined;
  const num = Number(value);
  if (!Number.isInteger(num) || num <= 0) {
    throw new Error(`Invalid ${name}: expected positive integer, got "${value}"`);
  }
  return num;
}
