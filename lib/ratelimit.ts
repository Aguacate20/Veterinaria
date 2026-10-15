import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/**
 * Límites de uso del endpoint de análisis.
 *  - Por IP: 5 análisis cada 10 minutos y 20 al día.
 *  - Global: tope diario para no agotar la cuota gratuita del proveedor de IA.
 *
 * Con Upstash Redis (variables UPSTASH_REDIS_REST_URL / _TOKEN) los límites son
 * compartidos entre todas las instancias de Vercel. Sin Upstash se usa una
 * versión en memoria (mejor que nada, pero se reinicia con cada instancia).
 */
const PER_IP_SHORT = { limit: Number(process.env.RL_IP_PER_10MIN ?? 5), windowSec: 600 };
const PER_IP_DAY = { limit: Number(process.env.RL_IP_PER_DAY ?? 20), windowSec: 86_400 };
const GLOBAL_DAY = { limit: Number(process.env.RL_GLOBAL_PER_DAY ?? 8_000), windowSec: 86_400 };

const hasUpstash = !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);

let redis: Redis | null = null;
let rlShort: Ratelimit | null = null;
let rlDay: Ratelimit | null = null;
let rlGlobal: Ratelimit | null = null;

if (hasUpstash) {
  redis = Redis.fromEnv();
  rlShort = new Ratelimit({ redis, prefix: "hs:ip10m", limiter: Ratelimit.slidingWindow(PER_IP_SHORT.limit, "10 m") });
  rlDay = new Ratelimit({ redis, prefix: "hs:ip1d", limiter: Ratelimit.fixedWindow(PER_IP_DAY.limit, "1 d") });
  rlGlobal = new Ratelimit({ redis, prefix: "hs:global", limiter: Ratelimit.fixedWindow(GLOBAL_DAY.limit, "1 d") });
}

// ---- Fallback en memoria ----
const mem = new Map<string, { count: number; resetAt: number }>();
function memHit(key: string, limit: number, windowSec: number) {
  const now = Date.now();
  const cur = mem.get(key);
  if (!cur || cur.resetAt <= now) {
    mem.set(key, { count: 1, resetAt: now + windowSec * 1000 });
    return { success: true, reset: now + windowSec * 1000 };
  }
  cur.count += 1;
  return { success: cur.count <= limit, reset: cur.resetAt };
}

export type LimitResult = { ok: true } | { ok: false; reason: "ip" | "global"; retryAfterSec: number };

export async function checkLimits(ip: string): Promise<LimitResult> {
  if (rlShort && rlDay && rlGlobal) {
    const [s, d, g] = await Promise.all([rlShort.limit(ip), rlDay.limit(ip), rlGlobal.limit("all")]);
    if (!g.success) return { ok: false, reason: "global", retryAfterSec: secs(g.reset) };
    if (!s.success) return { ok: false, reason: "ip", retryAfterSec: secs(s.reset) };
    if (!d.success) return { ok: false, reason: "ip", retryAfterSec: secs(d.reset) };
    return { ok: true };
  }
  const g = memHit("global", GLOBAL_DAY.limit, GLOBAL_DAY.windowSec);
  if (!g.success) return { ok: false, reason: "global", retryAfterSec: secs(g.reset) };
  const s = memHit(`s:${ip}`, PER_IP_SHORT.limit, PER_IP_SHORT.windowSec);
  if (!s.success) return { ok: false, reason: "ip", retryAfterSec: secs(s.reset) };
  const d = memHit(`d:${ip}`, PER_IP_DAY.limit, PER_IP_DAY.windowSec);
  if (!d.success) return { ok: false, reason: "ip", retryAfterSec: secs(d.reset) };
  return { ok: true };
}

function secs(resetMs: number) {
  return Math.max(1, Math.ceil((resetMs - Date.now()) / 1000));
}

export function clientIp(req: Request): string {
  const h = req.headers;
  return (
    h.get("x-real-ip") ||
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("cf-connecting-ip") ||
    "unknown"
  );
}
