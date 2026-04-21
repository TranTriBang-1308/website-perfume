type RateLimitEntry = { count: number; resetAt: number };

// In-memory store — works for single-instance (dev/single-server).
// For multi-instance production (Vercel serverless), use Upstash Redis instead.
const store = new Map<string, RateLimitEntry>();

// Periodically clear expired entries to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (entry.resetAt < now) store.delete(key);
  }
}, 60_000);

export interface RateLimitConfig {
  /** Max requests allowed in the window */
  limit: number;
  /** Window duration in milliseconds */
  windowMs: number;
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetAt: number;
}

/**
 * Check rate limit for a given identifier (e.g. IP address or userId).
 * Returns { success: false } when the limit is exceeded.
 */
export function rateLimit(identifier: string, config: RateLimitConfig): RateLimitResult {
  const now = Date.now();
  const entry = store.get(identifier);

  if (!entry || entry.resetAt < now) {
    const newEntry: RateLimitEntry = { count: 1, resetAt: now + config.windowMs };
    store.set(identifier, newEntry);
    return { success: true, remaining: config.limit - 1, resetAt: newEntry.resetAt };
  }

  if (entry.count >= config.limit) {
    return { success: false, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count += 1;
  return { success: true, remaining: config.limit - entry.count, resetAt: entry.resetAt };
}

/** Helper to get a stable identifier from a Request */
export function getIdentifier(req: Request, suffix = ""): string {
  const forwarded = req.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";
  return suffix ? `${ip}:${suffix}` : ip;
}
