interface RateLimitRecord {
  timestamps: number[]
}

const rateLimitMap = new Map<string, RateLimitRecord>()

// Periodic cleanup of stale rate limit entries to prevent memory leaks
if (typeof globalThis !== "undefined") {
  const globalAny = globalThis as any
  if (!globalAny.rateLimitCleanupInterval) {
    globalAny.rateLimitCleanupInterval = setInterval(() => {
      const now = Date.now()
      for (const [key, record] of rateLimitMap.entries()) {
        record.timestamps = record.timestamps.filter((t) => now - t < 10 * 60 * 1000)
        if (record.timestamps.length === 0) {
          rateLimitMap.delete(key)
        }
      }
    }, 10 * 60 * 1000)
  }
}

/**
 * Checks if a user has exceeded their rate limit.
 * Defaults to 10 requests per minute.
 */
export function checkRateLimit(
  userId: string,
  limit: number = 10,
  windowMs: number = 60 * 1000,
): { limited: boolean; remaining: number; resetTime: number } {
  const now = Date.now()
  let record = rateLimitMap.get(userId)

  if (!record) {
    record = { timestamps: [] }
    rateLimitMap.set(userId, record)
  }

  // Filter out timestamps outside the active window
  record.timestamps = record.timestamps.filter((t) => now - t < windowMs)

  if (record.timestamps.length >= limit) {
    const oldestTimestamp = record.timestamps[0]
    const resetTime = oldestTimestamp + windowMs
    return {
      limited: true,
      remaining: 0,
      resetTime,
    }
  }

  record.timestamps.push(now)

  return {
    limited: false,
    remaining: limit - record.timestamps.length,
    resetTime: now + windowMs,
  }
}
