"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Check, ShieldCheck, Flame } from "lucide-react";
import { AppStateProvider, useAppState } from "@/lib/app-state-context";
import { iniciarTrial } from "@/lib/app-state";
import { PAISES_AMERICA } from "@/lib/countries-data";

const BENEFICIOS = [
  "Todas las rutas y países de América",
  "Ayudas ilimitadas en cada reto",
  "Continentes nuevos sin costo extra al liberarse",
];

export default function PaywallPage() {
  return (
    <AppStateProvider>
      <PaywallContent />
    </AppStateProvider>
  );
}

function PaywallContent() {
  const router = useRouter();
  const { state, setState, ready } = useAppState();
  const [plan, setPlan] = useState<"anual" | "mensual">("anual");

  if (!ready) {
    return <div className="m-4 h-64 animate-pulse rounded-2xl bg-surface-secondary" />;
  }

  const paisesConquistados = PAISES_AMERICA.filter((p) => state.progresoPorPais[p.nombre]?.retoFinalCompletado).length;
  const yaConquistoColombia = state.progresoPorPais["Colombia"]?.retoFinalCompletado ?? false;

  function empezarPrueba(planElegido: "anual" | "mensual") {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("plan_elegido", planElegido);
    }
    setState((s) => iniciarTrial(s));
    router.push("/app");
  }

  function seguirGratis() {
    router.push("/app");
  }

  return (
    <div className="flex min-h-dvh flex-col bg-surface-base px-4 pb-8 pt-4">
      <button
        type="button"
        onClick={seguirGratis}
        aria-label="Cerrar"
        className="flex h-11 w-11 items-center justify-center rounded-full text-txt-secondary"
      >
        <X className="h-5 w-5" strokeWidth={2.2} />
      </button>

      <div className="mx-auto flex w-full max-w-sm flex-1 flex-col gap-6">
        <div>
          <h1 className="text-balance font-display text-3xl font-extrabold leading-tight text-txt-primary">
            {yaConquistoColombia ? "Colombia ya es tuyo — sigue a Perú" : "Tu pasaporte ya tiene su primer timbre"}
          </h1>
          <p className="mt-2 text-sm text-txt-secondary">
            No lo dejes en un solo país — con Pro conquistas todo el mapa de América.
          </p>
        </div>

        {/* Personalización real (02B regla 4): usa el progreso REAL del usuario,
            nunca una bienvenida genérica. */}
        {(paisesConquistados > 0 || state.currentStreak > 0) && (
          <div className="flex items-center gap-4 rounded-xl bg-surface-secondary px-4 py-3">
            <div className="flex items-center gap-1.5 text-sm font-bold text-txt-primary">
              <Flame className="h-4 w-4 text-flame" strokeWidth={2.4} />
              {state.currentStreak} días de racha
            </div>
            <div className="h-4 w-px bg-border-default" />
            <div className="text-sm font-bold text-txt-primary">
              {paisesConquistados} país{paisesConquistados === 1 ? "" : "es"} conquistado{paisesConquistados === 1 ? "" : "s"}
            </div>
          </div>
        )}

        <div className="rounded-2xl border border-border-default bg-surface-primary p-4">
          {BENEFICIOS.map((b) => (
            <div key={b} className="flex items-center gap-3 py-1.5 text-sm text-txt-primary">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-primary-soft text-brand-primary">
                <Check className="h-3.5 w-3.5" strokeWidth={3} />
              </span>
              {b}
            </div>
          ))}
        </div>

        {/* La objeción de oro de FICHA-AVATAR.md, explícita aquí — no solo en la
            landing. Es la ventaja competitiva real frente a apps que quitan el
            contenido pagado al cambiar de modelo. */}
        <div className="flex items-center gap-3 rounded-xl bg-gold-soft px-4 py-3">
          <ShieldCheck className="h-5 w-5 shrink-0 text-gold" strokeWidth={2.2} />
          <p className="text-xs font-semibold text-txt-primary">
            Lo que desbloqueas es tuyo para siempre — nunca te lo quitamos, ni si cambias de plan.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={() => setPlan("anual")}
            className={`relative rounded-lg border-2 p-4 text-left transition-colors duration-200 ease-out ${
              plan === "anual" ? "border-brand-primary bg-brand-primary-soft" : "border-border-default bg-surface-primary"
            }`}
          >
            <span className="absolute -top-3 left-4 rounded-full bg-brand-primary px-3 py-1 text-xs font-bold text-white">
              Más popular · ahorra 17%
            </span>
            <p className="font-display text-sm font-bold text-txt-primary">Anual</p>
            <p className="font-display text-2xl font-extrabold tabular text-txt-primary">
              $3.33<span className="text-sm font-medium text-txt-tertiary">/mes</span>
            </p>
            <p className="text-xs text-txt-tertiary">Se cobra $39.99/año · equivale a 2 meses gratis</p>
          </button>

          <button
            type="button"
            onClick={() => setPlan("mensual")}
            className={`rounded-lg border p-4 text-left transition-colors duration-200 ease-out ${
              plan === "mensual" ? "border-brand-primary bg-brand-primary-soft" : "border-border-default bg-surface-primary"
            }`}
          >
            <p className="font-display text-sm font-bold text-txt-primary">Mensual</p>
            <p className="font-display text-2xl font-extrabold tabular text-txt-primary">$3.99/mes</p>
          </button>
        </div>

        <div className="mt-auto flex flex-col gap-3">
          <button
            type="button"
            onClick={() => empezarPrueba(plan)}
            className="flex h-14 w-full items-center justify-center rounded-lg bg-brand-primary font-display text-base font-bold text-white shadow-md transition-transform duration-200 ease-out hover:-translate-y-0.5"
          >
            Empezar mi conquista — 7 días gratis
          </button>
          <p className="text-center text-xs text-txt-tertiary">
            Se cobra automáticamente al terminar el día 7 (te avisamos antes) · cancela cuando quieras
          </p>
          <button
            type="button"
            onClick={seguirGratis}
            className="text-center text-sm font-medium text-txt-secondary"
          >
            Ahora no, seguir explorando gratis
          </button>
          <p className="flex items-center justify-center gap-1.5 text-xs text-txt-tertiary">
            <ShieldCheck className="h-3.5 w-3.5" strokeWidth={2} />
            Garantía Hotmart de 7 días
          </p>
        </div>
      </div>
    </div>
  );
}
