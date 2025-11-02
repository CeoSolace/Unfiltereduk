// In-memory rate limiter (replace with Redis in prod)
const requestCounts = new Map<string, { count: number; resetTime: number }>();

export function rateLimit(ip_psi: string, limit: number = 20, windowMs: number = 5000) {
  const now = Date.now();
  const record = requestCounts.get(ip_psi);

  if (record && record.resetTime > now) {
    if (record.count >= limit) {
      return { allowed: false, retryAfter: record.resetTime - now };
    }
    requestCounts.set(ip_psi, { count: record.count + 1, resetTime: record.resetTime });
  } else {
    requestCounts.set(ip_psi, { count: 1, resetTime: now + windowMs });
  }

  return { allowed: true };
}
