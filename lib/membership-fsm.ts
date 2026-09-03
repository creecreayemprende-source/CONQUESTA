export type MembershipStatus =
  | "free"
  | "trialing"
  | "active"
  | "past_due"
  | "cancelled"
  | "expired"
  | "refunded"
  | "chargeback";

// ⚠️ PLACEHOLDER — verificar en el panel real de Hotmart antes de confiar en la
// métrica trial→pago: hacer una compra sandbox CON trial y capturar el JSON
// real del webhook (puede llegar como PURCHASE_APPROVED con valor 0, o con un
// evento/flag de trial distinto). Ajustar aquí antes de lanzar.
const TRIAL_START_EVENT = "SUBSCRIPTION_TRIAL_START"; // (verificar)

const EVENT_TO_STATUS: Record<string, MembershipStatus> = {
  [TRIAL_START_EVENT]: "trialing",
  PURCHASE_APPROVED: "active",
  PURCHASE_COMPLETE: "active",
  PURCHASE_DELAYED: "past_due",
  SUBSCRIPTION_CANCELLATION: "cancelled",
  PURCHASE_EXPIRED: "expired",
  PURCHASE_REFUNDED: "refunded",
  PURCHASE_CHARGEBACK: "chargeback",
};

const TERMINAL_NEGATIVE: MembershipStatus[] = ["refunded", "chargeback"];
const FULL_ACCESS: MembershipStatus[] = ["trialing", "active"];

export function statusForEvent(event: string): MembershipStatus | null {
  return EVENT_TO_STATUS[event] ?? null;
}

/** ¿Es legal pasar de `from` a `to`? Bloquea reactivaciones ilegales por eventos viejos. */
export function canTransition(from: MembershipStatus | null, to: MembershipStatus): boolean {
  if (from === null) return true;
  if (TERMINAL_NEGATIVE.includes(from) && (to === "active" || to === "trialing")) return false;
  return true;
}

export function hasFullAccess(
  status: MembershipStatus,
  now: Date,
  accessUntil?: Date | null,
  graceEndsAt?: Date | null
): boolean {
  if (FULL_ACCESS.includes(status)) return true;
  if (status === "cancelled") return !!accessUntil && now < accessUntil;
  if (status === "past_due") return !!graceEndsAt && now < graceEndsAt;
  return false;
}
