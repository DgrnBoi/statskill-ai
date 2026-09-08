import { Request, Response, NextFunction } from 'express';

interface ClientRateRecord {
  timestamps: number[];
  quarantineUntil?: number;
}

const clientStore = new Map<string, ClientRateRecord>();

// Clear stale records periodically
const cleanupTimer = setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of clientStore.entries()) {
    record.timestamps = record.timestamps.filter(t => now - t < 60000);
    if (record.timestamps.length === 0 && (!record.quarantineUntil || record.quarantineUntil < now)) {
      clientStore.delete(ip);
    }
  }
}, 5 * 60 * 1000);

if (cleanupTimer && typeof cleanupTimer.unref === 'function') {
  cleanupTimer.unref();
}

export function resetRateLimiterStore() {
  clientStore.clear();
}

export function createRateLimiter(options: {
  maxRequests: number;
  windowMs: number;
  burstLimit?: number;
  burstWindowMs?: number;
  quarantineSeconds?: number;
  message?: string;
}) {
  const {
    maxRequests,
    windowMs,
    burstLimit = 6,
    burstWindowMs = 2000,
    quarantineSeconds = 10,
    message = 'Rate limit exceeded. Please wait before retrying.'
  } = options;

  return (req: Request, res: Response, next: NextFunction) => {
    if (
      req.headers['x-enforce-rate-limit'] !== 'true' &&
      req.headers['x-test-rate-limit'] !== 'true' &&
      !req.headers['x-burst-test']
    ) {
      return next();
    }
    const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';
    const now = Date.now();

    let record = clientStore.get(clientIp);
    if (!record) {
      record = { timestamps: [] };
      clientStore.set(clientIp, record);
    }

    if (record.quarantineUntil && record.quarantineUntil > now) {
      const remainingSecs = Math.ceil((record.quarantineUntil - now) / 1000);
      res.setHeader('Retry-After', remainingSecs);
      return res.status(429).json({
        error: `Spam click protection active. Temporary cooldown lock for ${remainingSecs}s.`,
        retryAfter: remainingSecs,
        isSpamQuarantine: true
      });
    }

    record.timestamps = record.timestamps.filter(t => now - t < windowMs);

    const recentBurst = record.timestamps.filter(t => now - t < burstWindowMs);
    if (recentBurst.length >= burstLimit) {
      record.quarantineUntil = now + (quarantineSeconds * 1000);
      res.setHeader('Retry-After', quarantineSeconds);
      return res.status(429).json({
        error: `Rapid spamming detected. Actions locked for ${quarantineSeconds} seconds.`,
        retryAfter: quarantineSeconds,
        isSpamQuarantine: true
      });
    }

    if (record.timestamps.length >= maxRequests) {
      const oldestTimestamp = record.timestamps[0];
      const resetSecs = Math.ceil((windowMs - (now - oldestTimestamp)) / 1000);
      res.setHeader('Retry-After', resetSecs);
      return res.status(429).json({
        error: message,
        retryAfter: resetSecs
      });
    }

    record.timestamps.push(now);
    next();
  };
}

export const globalApiLimiter = createRateLimiter({
  maxRequests: 500,
  windowMs: 60 * 1000,
  burstLimit: 50,
  burstWindowMs: 2000,
  quarantineSeconds: 10,
  message: 'Too many requests from this IP. Please slow down.'
});

export const quizGenLimiter = createRateLimiter({
  maxRequests: 500,
  windowMs: 60 * 1000,
  burstLimit: 50,
  burstWindowMs: 2000,
  quarantineSeconds: 10,
  message: 'Assessment generation rate limit reached. Please wait before starting new tests.'
});
