"use client";

import { Gift, Gem } from "lucide-react";
import { useAppState } from "@/lib/app-state-context";
import { limpiarMedallaSemanalPendiente } from "@/lib/app-state";
import { esMedallaSemanal, MEDALLAS_SEMANALES } from "@/lib/medallas-semanales";
import { Confetti } from "@/components/app/Confetti";

/** Celebración del cofre semanal (top 3 del Ranking) — la otorga el cron del
 * servidor `cerrar_semana_ranking`, nunca el cliente; esta pantalla solo
 * MUESTRA lo que ya se otorgó y limpia la bandera de pendiente al cerrarla.
 * Mismo patrón que `RachaMilestoneModal`, vive en el layout de /app. */
export function CofreSemanalModal() {
  const { state, setState, guardarAhora } = useAppState();
  const pendiente = state.medallaSemanalPendiente;
  if (!pendiente || !esMedallaSemanal(pendiente)) return null;
  const medalla = MEDALLAS_SEMANALES[pendiente];

  function cerrar() {
    setState((s) => {
      const nuevo = limpiarMedallaSemanalPendiente(s);
      void guardarAhora(nuevo);
      return nuevo;
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6">
      <div className="relative flex w-full max-w-xs flex-col items-center gap-4 overflow-hidden rounded-2xl bg-surface-primary p-6 text-center shadow-xl">
        <Confetti />
        <span
          className="flex h-16 w-16 items-center justify-center rounded-full"
          style={{ backgroundColor: `color-mix(in srgb, ${medalla.colorVar} 18%, transparent)`, color: medalla.colorVar }}
        >
          <Gift className="h-8 w-8" strokeWidth={2} />
        </span>
        <h2 className="font-display text-xl font-bold text-txt-primary">¡Cofre semanal abierto!</h2>
        <p className="text-sm text-txt-secondary">
          Cerraste la semana en <strong className="text-txt-primary">{medalla.puesto}</strong> del Ranking Semanal.
        </p>
        <div className="flex flex-col items-center gap-1 rounded-xl bg-surface-secondary px-4 py-3">
          <span className="text-sm font-bold text-txt-primary">{medalla.nombre}</span>
          <span className="flex items-center gap-1 text-xs font-semibold" style={{ color: medalla.colorVar }}>
            <Gem className="h-3.5 w-3.5" strokeWidth={2.4} />
            +{medalla.gemas} gemas
          </span>
        </div>
        <button
          type="button"
          onClick={cerrar}
          className="mt-1 flex h-12 w-full items-center justify-center rounded-lg bg-brand-primary font-display text-sm font-bold text-white"
        >
          ¡Genial!
        </button>
      </div>
    </div>
  );
}
