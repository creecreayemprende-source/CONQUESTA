import { Lock, Crown } from "lucide-react";

export type EstadoSello = "bloqueado" | "requierePro" | "desbloqueado" | "conquistado";

/** Sello de pasaporte para un país: 4 estados reales —
 * bloqueado (aún no le toca en secuencia), requierePro (le toca pero es Pro y
 * no está en trial/Pro), desbloqueado (jugable ahora, pendiente de conquistar)
 * y conquistado (Reto Final aprobado, sello de tinta real). */
export function PassportStamp({ codigo, estado }: { codigo: string; estado: EstadoSello }) {
  if (estado === "bloqueado") {
    return (
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-surface-secondary text-txt-tertiary">
        <Lock className="h-4 w-4" strokeWidth={2.2} />
      </span>
    );
  }

  if (estado === "requierePro") {
    return (
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gold-soft text-gold">
        <Crown className="h-5 w-5" strokeWidth={2.2} />
      </span>
    );
  }

  if (estado === "desbloqueado") {
    return (
      <span className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-dashed border-brand-primary/50 text-brand-primary">
        <span className="font-display text-xs font-bold">{codigo}</span>
      </span>
    );
  }

  const filterId = `sello-rugosidad-${codigo}`;

  return (
    <span className="relative flex h-14 w-14 items-center justify-center" style={{ transform: "rotate(-8deg)" }}>
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" style={{ mixBlendMode: "multiply" }}>
        <defs>
          <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency={0.85} numOctaves={2} seed={codigo.charCodeAt(0)} result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale={3.5} />
          </filter>
          <path id={`arco-sup-${codigo}`} d="M 14,54 A 36,36 0 1 1 86,54" fill="none" />
        </defs>
        <g filter={`url(#${filterId})`} stroke="var(--status-success)" fill="none">
          <circle cx="50" cy="50" r="45" strokeWidth="5" />
          <circle cx="50" cy="50" r="35" strokeWidth="1.5" />
        </g>
        <text fill="var(--status-success)" fontSize="8.5" fontWeight="700" letterSpacing="1.5">
          <textPath href={`#arco-sup-${codigo}`} startOffset="50%" textAnchor="middle">
            ★ AMÉRICA ★
          </textPath>
        </text>
      </svg>
      <span className="relative font-display text-base font-extrabold text-status-success">{codigo}</span>
    </span>
  );
}
