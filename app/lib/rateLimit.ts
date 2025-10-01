const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 5;

const CLEANUP_LIMIT = 10_000;

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

type RateLimitStore = Map<string, RateLimitEntry>;

declare global {
  var __appRateLimitStore: RateLimitStore | undefined;
  var __appRateLimitCleanupCounter: number | undefined;
}

const getStore = (): RateLimitStore => {
  if (!globalThis.__appRateLimitStore) {
    globalThis.__appRateLimitStore = new Map();
  }
  return globalThis.__appRateLimitStore;
};

const cleanupStore = () => {
  const store = getStore();
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (entry.resetAt <= now) {
      store.delete(key);
    }
  }
};

const maybeCleanup = () => {
  const counter = (globalThis.__appRateLimitCleanupCounter ?? 0) + 1;
  globalThis.__appRateLimitCleanupCounter = counter;
  if (counter >= CLEANUP_LIMIT) {
    globalThis.__appRateLimitCleanupCounter = 0;
    cleanupStore();
  }
};

export type RateLimitOptions = {
  windowMs?: number;
  maxRequests?: number;
};

export type RateLimitResult = {
  limited: boolean;
  retryAfterSeconds: number;
  remainingRequests: number;
};

const defaultOptions: Required<RateLimitOptions> = {
  windowMs: RATE_LIMIT_WINDOW_MS,
  maxRequests: RATE_LIMIT_MAX_REQUESTS,
};

export const takeRateLimitToken = (
  key: string,
  { windowMs, maxRequests }: RateLimitOptions = defaultOptions,
): RateLimitResult => {
  const { windowMs: win, maxRequests: max } = {
    ...defaultOptions,
    windowMs,
    maxRequests,
  };

  const storeKey = `${key}`;
  const store = getStore();
  const now = Date.now();
  const entry = store.get(storeKey);

  maybeCleanup();

  if (!entry || entry.resetAt <= now) {
    store.set(storeKey, { count: 1, resetAt: now + win });
    return {
      limited: false,
      retryAfterSeconds: Math.ceil(win / 1000),
      remainingRequests: Math.max(0, max - 1),
    };
  }

  if (entry.count >= max) {
    return {
      limited: true,
      retryAfterSeconds: Math.max(1, Math.ceil((entry.resetAt - now) / 1000)),
      remainingRequests: 0,
    };
  }

  entry.count += 1;
  store.set(storeKey, entry);
  return {
    limited: false,
    retryAfterSeconds: Math.max(1, Math.ceil((entry.resetAt - now) / 1000)),
    remainingRequests: Math.max(0, max - entry.count),
  };
};

export const getClientIdentifier = (request: Request): string => {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const [first] = forwardedFor.split(",");
    if (first) {
      return first.trim();
    }
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }

  const clientIp = (request as unknown as { ip?: string }).ip;
  if (clientIp) {
    return clientIp;
  }

  return "anonymous";
};
