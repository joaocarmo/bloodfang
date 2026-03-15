// ── Log Level ────────────────────────────────────────────────────────

export enum LogLevel {
  Debug = 0,
  Info = 1,
  Warn = 2,
  Error = 3,
}

const LOG_LEVEL_MAP: Record<string, LogLevel> = {
  DEBUG: LogLevel.Debug,
  INFO: LogLevel.Info,
  WARN: LogLevel.Warn,
  ERROR: LogLevel.Error,
};

export function parseLogLevel(value: string | undefined): LogLevel {
  if (value && value in LOG_LEVEL_MAP) {
    const level = LOG_LEVEL_MAP[value];
    if (level !== undefined) return level;
  }
  return LogLevel.Info;
}

// ── Logger Interface ─────────────────────────────────────────────────

export interface Logger {
  debug(event: string, data?: Record<string, unknown>): void;
  info(event: string, data?: Record<string, unknown>): void;
  warn(event: string, data?: Record<string, unknown>): void;
  error(event: string, data?: Record<string, unknown>): void;
}

// ── Console Logger ───────────────────────────────────────────────────

export class ConsoleLogger implements Logger {
  private readonly level: LogLevel;

  constructor(level: LogLevel) {
    this.level = level;
  }

  debug(event: string, data?: Record<string, unknown>): void {
    if (this.level <= LogLevel.Debug) {
      console.debug(this.format('DEBUG', event, data));
    }
  }

  info(event: string, data?: Record<string, unknown>): void {
    if (this.level <= LogLevel.Info) {
      console.log(this.format('INFO', event, data));
    }
  }

  warn(event: string, data?: Record<string, unknown>): void {
    if (this.level <= LogLevel.Warn) {
      console.warn(this.format('WARN', event, data));
    }
  }

  error(event: string, data?: Record<string, unknown>): void {
    console.error(this.format('ERROR', event, data));
  }

  private format(level: string, event: string, data?: Record<string, unknown>): string {
    return JSON.stringify({ timestamp: new Date().toISOString(), level, event, ...data });
  }
}
