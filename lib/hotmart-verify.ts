import crypto from "node:crypto";

const HOTTOK = process.env.HOTMART_HOTTOK;
if (!HOTTOK) throw new Error("FALTA HOTMART_HOTTOK — el webhook no puede operar de forma segura");

/** Comparación en tiempo constante (anti timing-attack) — nunca usar === para secretos. */
function timingSafeEqualStr(a: string, b: string): boolean {
  const ba = Buffer.from(a, "utf8");
  const bb = Buffer.from(b, "utf8");
  if (ba.length !== bb.length) return false;
  return crypto.timingSafeEqual(ba, bb);
}

/** Hotmart no firma el body con HMAC — su modelo de autenticidad es el hottok
 * (token único de la cuenta) viajando sobre HTTPS. Comparación en tiempo constante. */
export function verifyHotmart(opts: { hottok?: string }): boolean {
  if (!opts.hottok) return false;
  return timingSafeEqualStr(opts.hottok, HOTTOK!);
}
