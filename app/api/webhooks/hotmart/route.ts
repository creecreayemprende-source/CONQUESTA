import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import { verifyHotmart } from "@/lib/hotmart-verify";
import { statusForEvent } from "@/lib/membership-fsm";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs"; // necesitamos node:crypto y el raw body (no Edge)

const REPLAY_WINDOW_MS = 5 * 60 * 1000;

/** Ver docs/sistema/18-VENTA-HOTMART.md ("SEGURIDAD DEL WEBHOOK DE HOTMART") —
 * este endpoint sigue el pipeline obligatorio: autenticidad → frescura →
 * parseo → idempotencia (dentro de la RPC) → transición de estado → log. */
export async function POST(req: NextRequest) {
  const admin = supabaseAdmin();

  // 1. Bytes exactos, antes de parsear (necesarios si algún día se verifica una
  // firma documentada por Hotmart, y para el hash de auditoría).
  const rawBody = await req.text();

  // 2. Autenticidad — hottok en tiempo constante, sobre HTTPS.
  const hottok = req.headers.get("x-hotmart-hottok") ?? undefined;
  if (!verifyHotmart({ hottok })) {
    await admin.from("webhook_log").insert({ result: "unauthorized" });
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  // 3. Parsear SOLO después de verificar.
  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }

  // 4. Frescura (anti-replay).
  const data = (payload.data ?? {}) as Record<string, unknown>;
  const purchase = (data.purchase ?? {}) as Record<string, unknown>;
  const ts = (payload.creation_date ?? purchase.approved_date) as number | undefined;
  if (ts && Date.now() - Number(ts) > REPLAY_WINDOW_MS) {
    return NextResponse.json({ error: "stale" }, { status: 400 });
  }

  // 5. Datos del evento.
  const event = payload.event as string;
  const buyer = (data.buyer ?? {}) as Record<string, unknown>;
  const subscription = (data.subscription ?? {}) as Record<string, unknown>;
  const subscriber = (subscription.subscriber ?? {}) as Record<string, unknown>;

  const eventId =
    (payload.id as string) ??
    (payload.event_id as string) ??
    (purchase.transaction as string) ??
    `${event}:${buyer.email as string}:${ts ?? ""}`;
  const email = (buyer.email as string) ?? (payload.email as string) ?? undefined;
  const subscriberCode = (subscriber.code as string) ?? undefined;

  const newStatus = statusForEvent(event);
  if (!newStatus) {
    return NextResponse.json({ received: true, ignored: event });
  }
  if (!email) {
    await admin.from("webhook_log").insert({ event_id: eventId, type: event, result: "error" });
    return NextResponse.json({ error: "missing email" }, { status: 400 });
  }

  const payloadHash = crypto.createHash("sha256").update(rawBody).digest("hex");

  // 6. Idempotencia + transición de estado, atómico en una RPC transaccional.
  const { data: rpcData, error } = await admin.rpc("apply_hotmart_event", {
    p_event_id: eventId,
    p_event_type: event,
    p_payload_hash: payloadHash,
    p_email: email,
    p_subscriber_code: subscriberCode ?? null,
    p_new_status: newStatus,
  });

  if (error) {
    console.error("webhook hotmart error", { event, code: error.code }); // sin PII
    await admin.from("webhook_log").insert({ event_id: eventId, type: event, result: "error" });
    return NextResponse.json({ error: "processing failed" }, { status: 500 }); // 5xx → Hotmart reintenta
  }

  const status = (rpcData as { status?: string } | null)?.status;
  const result = status === "applied" ? "applied" : status === "duplicate" ? "duplicate" : status === "illegal_transition" ? "illegal" : "applied";
  await admin.from("webhook_log").insert({ event_id: eventId, type: event, result });

  // 7. Siempre 200 cuando la decisión fue tomada (incluido duplicate/illegal):
  // así Hotmart deja de reintentar.
  return NextResponse.json({ received: true, result: status ?? "ok" });
}
