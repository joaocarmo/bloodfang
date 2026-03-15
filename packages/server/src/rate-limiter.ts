export function createRateLimiter() {
  const counters = new Map<string, { count: number; resetAt: number }>();

  return function isRateLimited(key: string, maxPerMinute: number): boolean {
    const now = Date.now();
    const entry = counters.get(key);
    if (!entry || now >= entry.resetAt) {
      counters.set(key, { count: 1, resetAt: now + 60_000 });
      return false;
    }
    entry.count++;
    return entry.count > maxPerMinute;
  };
}
