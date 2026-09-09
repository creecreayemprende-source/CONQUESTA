"use client";

import { Flame } from "lucide-react";
import { useAppState } from "@/lib/app-state-context";
import { HITOS_RACHA, limpiarHitoRachaPendiente } from "@/lib/app-state";
import { Confetti } from "@/components/app/Confetti";
import { CountUp } from "@/components/app/CountUp";

/** Celebración del hito de racha (7/14/30 días) — vive en el layout de /app
 * para poder aparecer sin importar en qué pantalla el usuario haya sido
 * activo hoy (el hito lo otorga `registrarActividad`, que se llama desde
 * cualquier reto/ronda). Se muestra una sola vez y se limpia al cerrarla. */
export function RachaMilestoneModal() {
  const { state, setState, guardarAhora } = useAppState();
  const dias = state.hitoRachaPendienteDeMostrar;
  const hito = dias != null ? HITOS_RACHA.find((h) => h.dias === dias) : null;

  if (!hito) return null;

  function cerrar() {
    setState((s) => {
      const nuevo = limpiarHitoRachaPendiente(s);
      void guardarAhora(nuevo);
      return nuevo;
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6">
      <div className="relative flex w-full max-w-xs flex-col items-center gap-4 overflow-hidden rounded-2xl bg-surface-primary p-6 text-center shadow-xl">
        <Confetti />
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gold-soft text-gold">
          <Flame className="h-8 w-8" strokeWidth={2} />
        </span>
        <h2 className="font-display text-xl font-bold text-txt-primary">¡Racha de {hito.dias} días!</h2>
        <p className="text-sm text-txt-secondary">Volviste a jugar {hito.dias} días seguidos — aquí tu premio:</p>
        <div className="flex gap-3 text-sm font-semibold text-txt-primary">
          <span className="rounded-full bg-surface-secondary px-4 py-2">
            +<CountUp value={hito.monedas} /> monedas
          </span>
          <span className="rounded-full bg-surface-secondary px-4 py-2">+{hito.gemas} gemas</span>
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
