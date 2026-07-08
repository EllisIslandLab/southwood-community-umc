/**
 * Best-effort per-IP throttle for the contact form: 3 submissions / 10 min.
 *
 * This is in-memory, so it resets whenever the serverless function instance
 * is recycled and does not share state across concurrent instances. That's
 * an acceptable tradeoff for a small ministry site's contact form volume —
 * it stops a casual script from hammering the endpoint, not a determined
 * attacker. If real abuse shows up, swap this for Upstash Redis (see
 * README) without changing the route handler's call site.
 */

const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 3;

const hits = new Map<string, number[]>();

export function isRateLimited(key: string): boolean {
  const now = Date.now();
  const timestamps = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);

  if (timestamps.length >= MAX_REQUESTS) {
    hits.set(key, timestamps);
    return true;
  }

  timestamps.push(now);
  hits.set(key, timestamps);
  return false;
}
