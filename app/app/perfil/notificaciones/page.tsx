"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, Bell } from "lucide-react";
import { useAppState } from "@/lib/app-state-context";

const HORAS_SUGERIDAS = ["8:00 AM", "1:00 PM", "8:00 PM"];

export default function NotificacionesPage() {
  const router = useRouter();
  const { state, setState, ready } = useAppState();

  if (!ready) {
    return (
      <div className="flex flex-col gap-3 px-4 pt-4">
        <div className="h-8 w-40 animate-pulse rounded-lg bg-surface-secondary" />
        <div className="h-16 animate-pulse rounded-xl bg-surface-secondary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col px-4 pt-4">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => router.push("/app/perfil")}
          aria-label="Volver"
          className="flex h-11 w-11 items-center justify-center rounded-full text-txt-secondary"
        >
          <ChevronLeft className="h-5 w-5" strokeWidth={2.4} />
        </button>
        <h1 className="font-display text-lg font-bold text-txt-primary">Notificaciones</h1>
      </div>

      <div className="mt-4 flex items-center gap-3 rounded-xl border border-border-default bg-surface-primary p-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-primary-soft text-brand-primary">
          <Bell className="h-5 w-5" strokeWidth={2.2} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-txt-primary">Recordatorio diario</p>
          <p className="text-xs text-txt-secondary">Te avisamos para que no pierdas tu racha</p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={state.recordatorioDiario}
          onClick={() => setState((s) => ({ ...s, recordatorioDiario: !s.recordatorioDiario }))}
          className={`relative h-7 w-12 shrink-0 rounded-full transition-colors duration-200 ease-out ${
            state.recordatorioDiario ? "bg-brand-primary" : "bg-surface-secondary"
          }`}
        >
          <span
            className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ease-out ${
              state.recordatorioDiario ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>

      {state.recordatorioDiario && (
        <div className="mt-3 rounded-xl border border-border-default bg-surface-primary p-4">
          <p className="mb-3 text-sm font-semibold text-txt-primary">¿A qué hora te recordamos?</p>
          <div className="flex flex-wrap gap-2">
            {HORAS_SUGERIDAS.map((h) => (
              <button
                key={h}
                type="button"
                onClick={() => setState((s) => ({ ...s, horaRecordatorio: h }))}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors duration-200 ease-out ${
                  (state.horaRecordatorio ?? "8:00 PM") === h
                    ? "border-brand-primary bg-brand-primary-soft text-brand-primary"
                    : "border-border-default bg-surface-base text-txt-primary"
                }`}
              >
                {h}
              </button>
            ))}
          </div>
        </div>
      )}

      <p className="mt-3 px-1 text-xs leading-relaxed text-txt-tertiary">
        Por ahora esto guarda tu preferencia dentro de la app. Las notificaciones push reales (que
        te avisen aunque tengas Conquesta cerrada) llegan pronto — cuando estén listas, se
        activarán automáticamente a la hora que elegiste si dejaste este interruptor encendido.
      </p>
    </div>
  );
}
