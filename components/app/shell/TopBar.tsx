"use client";

import Link from "next/link";
import { Flame, Gem, Coins, Crown, ChevronRight, Volume2, VolumeX } from "lucide-react";
import type { AppState } from "@/lib/app-state";
import { estaEnTrial, diaDeTrial } from "@/lib/app-state";
import { useAppState } from "@/lib/app-state-context";

const DURACION_TRIAL_DIAS = 7;

export function TopBar({ state }: { state: AppState }) {
  const { setState } = useAppState();

  return (
    <div className="flex flex-col gap-2 px-4 pb-2 pt-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand-primary font-display text-sm font-bold text-white">
            {state.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element -- foto subida por el usuario, no un asset local optimizable.
              <img src={state.avatarUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              state.nombre.charAt(0)
            )}
          </span>
          <span className="font-display text-base font-bold text-txt-primary">Hola, {state.nombre}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 rounded-full bg-flame-soft px-2.5 py-1 text-xs font-bold tabular text-txt-primary">
            <Flame className="h-3.5 w-3.5 text-flame" strokeWidth={2.4} />
            {state.currentStreak}
          </span>
          <span className="flex items-center gap-1 rounded-full bg-gold-soft px-2.5 py-1 text-xs font-bold tabular text-txt-primary">
            <Coins className="h-3.5 w-3.5 text-gold" strokeWidth={2.4} />
            {state.coins}
          </span>
          <span className="flex items-center gap-1 rounded-full bg-brand-primary-soft px-2.5 py-1 text-xs font-bold tabular text-txt-primary">
            <Gem className="h-3.5 w-3.5 text-brand-primary" strokeWidth={2.4} />
            {state.gems}
          </span>
          <button
            type="button"
            onClick={() => setState((s) => ({ ...s, musicaSilenciada: !s.musicaSilenciada }))}
            aria-label={state.musicaSilenciada ? "Activar sonido" : "Silenciar sonido"}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-surface-secondary text-txt-secondary"
          >
            {state.musicaSilenciada ? (
              <VolumeX className="h-3.5 w-3.5" strokeWidth={2.4} />
            ) : (
              <Volume2 className="h-3.5 w-3.5" strokeWidth={2.4} />
            )}
          </button>
        </div>
      </div>

      {/* Indicador de prueba Pro — neutro, nunca countdown de alarma (02C: el
          aviso pre-cobro va en un día específico, no como presión constante). */}
      {estaEnTrial(state) && (
        <Link
          href="/paywall"
          className="flex items-center justify-between rounded-lg bg-surface-secondary px-3 py-1.5 text-xs font-semibold text-txt-secondary"
        >
          <span className="flex items-center gap-1.5">
            <Crown className="h-3.5 w-3.5 text-gold" strokeWidth={2.2} />
            Prueba Pro · Día {diaDeTrial(state)} de {DURACION_TRIAL_DIAS}
          </span>
          <span className="flex items-center gap-0.5 text-brand-primary">
            Ver plan
            <ChevronRight className="h-3.5 w-3.5" strokeWidth={2.4} />
          </span>
        </Link>
      )}
    </div>
  );
}
