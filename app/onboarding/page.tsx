"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X, Compass, Plane, Brain, Trophy, Bell, Mail, Radar as RadarIcon, Coins } from "lucide-react";
import { ProgressHeader } from "@/components/app/onboarding/ProgressHeader";
import { OptionChip } from "@/components/app/onboarding/OptionChip";
import { IconOptionCard } from "@/components/app/onboarding/IconOptionCard";
import { RouteBoardingPassCard } from "@/components/app/RouteBoardingPassCard";
import { Confetti } from "@/components/app/Confetti";
import { CountUp } from "@/components/app/CountUp";
import { useSound } from "@/lib/use-sound";
import { AppStateProvider, useAppState } from "@/lib/app-state-context";
import { aplicarRecompensaOnboarding } from "@/lib/app-state";
import { RUTAS_AMERICA } from "@/lib/rutas-data";
import { CATEGORIA_ICONO, CATEGORIA_COLOR } from "@/lib/category-style";
import { BANCO_COLOMBIA } from "@/lib/trivia-content-colombia";
import { shuffle, shuffleOpciones } from "@/lib/trivia-bank";
import {
  CATEGORIAS,
  loadOnboardingState,
  saveOnboardingState,
  type Categoria,
  type Motivacion,
  type OnboardingState,
  type PreguntaTrivia,
} from "@/lib/onboarding-data";

const TOTAL_STEPS = 7;
const MONEDAS_POR_ACIERTO = 5;

/** 1 pregunta real por categoría (la más fácil de cada una) — antes el hook era
 * una sola pregunta de Geografía; el usuario pidió mostrar las 6 categorías
 * desde el primer minuto para despertar más interés. */
function preguntasHook(): PreguntaTrivia[] {
  return shuffle(CATEGORIAS.map((cat) => shuffleOpciones(BANCO_COLOMBIA[cat].Explorador[0])));
}

const MOTIVACIONES: { id: Motivacion; label: string; icon: typeof Plane }[] = [
  { id: "viajar", label: "Preparar mi próximo viaje", icon: Plane },
  { id: "mente", label: "Poner a prueba mi mente", icon: Brain },
  { id: "competir", label: "Desafiar a mis amigos", icon: Trophy },
];

const MINUTOS_OPCIONES: { valor: 3 | 5 | 10; label: string; detalle: string }[] = [
  { valor: 3, label: "3 min/día", detalle: "Explorador casual" },
  { valor: 5, label: "5 min/día", detalle: "Viajero frecuente" },
  { valor: 10, label: "10 min/día", detalle: "Mente maestra" },
];

export default function OnboardingPage() {
  return (
    <AppStateProvider>
      <OnboardingFlow />
    </AppStateProvider>
  );
}

function OnboardingFlow() {
  const router = useRouter();
  const { setState: setAppState } = useAppState();
  const { playCorrect, playIncorrect, playVictoria } = useSound();
  const [step, setStep] = useState(0);
  const [state, setState] = useState<OnboardingState>({ v: 2 });

  useEffect(() => {
    setState(loadOnboardingState());
  }, []);
  useEffect(() => {
    saveOnboardingState(state);
  }, [state]);

  const pct = useMemo(() => Math.min(((step + 1) / TOTAL_STEPS) * 100, 100), [step]);

  function next() {
    setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  }
  function back() {
    setStep((s) => Math.max(s - 1, 0));
  }

  function terminarOnboarding() {
    setAppState((s) =>
      aplicarRecompensaOnboarding(s, {
        monedasGanadas: state.monedasGanadas ?? 0,
        categoriasFavoritas: state.categoriasFavoritas ?? [],
      })
    );
    router.push("/app");
  }

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-sm flex-col bg-surface-base">
      <ProgressHeader pct={pct} onBack={step > 0 && step < TOTAL_STEPS - 1 ? back : undefined} />
      <div className="flex flex-1 flex-col justify-center px-4 py-6">
        {step === 0 && (
          <HookScreen
            onDone={(monedasGanadas, aciertos) => {
              playVictoria();
              setState((s) => ({ ...s, hookAcertado: aciertos > 0, monedasGanadas }));
              setTimeout(next, 1200);
            }}
            playCorrect={playCorrect}
            playIncorrect={playIncorrect}
          />
        )}

        {step === 1 && (
          <QuestionScreen title="¿Qué te mueve a explorar el mundo hoy?">
            <div className="flex flex-col gap-3">
              {MOTIVACIONES.map((m) => (
                <OptionChip
                  key={m.id}
                  label={m.label}
                  selected={state.motivacion === m.id}
                  onClick={() => {
                    setState((s) => ({ ...s, motivacion: m.id }));
                    setTimeout(next, 300);
                  }}
                />
              ))}
            </div>
          </QuestionScreen>
        )}

        {step === 2 && (
          <CategoriasScreen
            seleccionadas={state.categoriasFavoritas ?? []}
            onChange={(cats) => setState((s) => ({ ...s, categoriasFavoritas: cats }))}
            onContinue={next}
          />
        )}

        {step === 3 && (
          <QuestionScreen title="¿Cuánto tiempo quieres dedicarle a tu expedición diaria?">
            <div className="flex flex-col gap-3">
              {MINUTOS_OPCIONES.map((m) => (
                <OptionChip
                  key={m.valor}
                  label={`${m.label} — ${m.detalle}`}
                  selected={state.minutosDia === m.valor}
                  onClick={() => {
                    setState((s) => ({ ...s, minutosDia: m.valor }));
                    setTimeout(next, 300);
                  }}
                />
              ))}
            </div>
          </QuestionScreen>
        )}

        {step === 4 && <RutaGeneradaScreen state={state} onDone={next} />}

        {step === 5 && (
          <RecordatorioScreen
            state={state}
            setState={setState}
            onContinue={next}
          />
        )}

        {step === 6 && (
          <RegistroScreen state={state} onContinuar={terminarOnboarding} />
        )}
      </div>
    </div>
  );
}

function QuestionScreen({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-balance font-display text-2xl font-bold leading-tight text-txt-primary">{title}</h1>
      {children}
    </div>
  );
}

/** Pantalla 1 — Hook interactivo: una pregunta real, fácil, con recompensa
 * inmediata (monedas + confetti) ANTES de pedir cualquier dato personal. */
function HookScreen({
  onDone,
  playCorrect,
  playIncorrect,
}: {
  onDone: (monedasGanadas: number, aciertos: number) => void;
  playCorrect: () => void;
  playIncorrect: () => void;
}) {
  // Las preguntas se barajan con Math.random() — se generan SOLO en el cliente
  // (efecto, no en el initializer de useState) para evitar el error de
  // hidratación servidor/cliente, mismo patrón que el resto del juego.
  const [preguntas, setPreguntas] = useState<PreguntaTrivia[] | null>(null);
  useEffect(() => {
    setPreguntas(preguntasHook());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [aciertos, setAciertos] = useState(0);

  if (!preguntas) {
    return <div className="h-64 animate-pulse rounded-2xl bg-surface-secondary" />;
  }

  const pregunta = preguntas[index];
  const acerto = selected !== null && selected === pregunta.correctaIndex;

  function responder(i: number) {
    if (!preguntas || selected !== null) return;
    setSelected(i);
    const ok = i === pregunta.correctaIndex;
    if (ok) playCorrect();
    else playIncorrect();

    setTimeout(() => {
      const nuevosAciertos = aciertos + (ok ? 1 : 0);
      if (index < preguntas.length - 1) {
        setAciertos(nuevosAciertos);
        setSelected(null);
        setIndex((i2) => i2 + 1);
      } else {
        onDone(nuevosAciertos * MONEDAS_POR_ACIERTO, nuevosAciertos);
      }
    }, 700);
  }

  return (
    <div className="relative flex flex-col items-center gap-6 overflow-hidden text-center">
      {selected !== null && acerto && <Confetti />}
      <span
        className="flex h-14 w-14 items-center justify-center rounded-full text-white"
        style={{ backgroundColor: CATEGORIA_COLOR[pregunta.categoria] }}
      >
        <Compass className="h-7 w-7" strokeWidth={2} />
      </span>
      <p className="text-xs font-semibold uppercase tracking-wide text-txt-tertiary">
        {pregunta.categoria} · Pregunta {index + 1} de {preguntas.length}
      </p>
      <h1 className="text-balance font-display text-2xl font-bold leading-tight text-txt-primary">
        {pregunta.pregunta}
      </h1>
      <div className="flex w-full flex-col gap-3">
        {pregunta.opciones.map((op, i) => {
          const showState = selected !== null;
          const isCorrect = i === pregunta.correctaIndex;
          const isSelected = selected === i;
          return (
            <button
              key={op}
              type="button"
              onClick={() => responder(i)}
              disabled={selected !== null}
              className={`flex h-14 w-full items-center justify-between rounded-lg border px-4 text-left font-body text-base font-medium shadow-sm transition-colors duration-200 ease-out active:scale-[0.98] ${
                showState && isCorrect
                  ? "border-status-success bg-status-success-soft text-txt-primary"
                  : showState && isSelected
                    ? "border-status-error bg-status-error-soft text-txt-primary"
                    : "border-border-default bg-surface-primary text-txt-primary"
              }`}
            >
              {op}
              {showState && isCorrect && <Check className="h-5 w-5 text-status-success" strokeWidth={2.6} />}
              {showState && isSelected && !isCorrect && <X className="h-5 w-5 text-status-error" strokeWidth={2.6} />}
            </button>
          );
        })}
      </div>
      {selected !== null && (
        <p className={`font-display text-base font-bold ${acerto ? "text-status-success" : "text-txt-secondary"}`}>
          {acerto ? `¡Bien! +${MONEDAS_POR_ACIERTO} monedas 🎉` : "Casi — sigamos"}
        </p>
      )}
    </div>
  );
}

function CategoriasScreen({
  seleccionadas,
  onChange,
  onContinue,
}: {
  seleccionadas: Categoria[];
  onChange: (cats: Categoria[]) => void;
  onContinue: () => void;
}) {
  function toggle(cat: Categoria) {
    if (seleccionadas.includes(cat)) {
      onChange(seleccionadas.filter((c) => c !== cat));
      return;
    }
    if (seleccionadas.length >= 2) return;
    const nuevas = [...seleccionadas, cat];
    onChange(nuevas);
    if (nuevas.length === 2) setTimeout(onContinue, 350);
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-balance font-display text-2xl font-bold leading-tight text-txt-primary">
          Elige tus 2 categorías favoritas
        </h1>
        <p className="mt-1 text-sm text-txt-secondary">Personalizan tu primer viaje ({seleccionadas.length}/2)</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {CATEGORIAS.map((cat) => {
          const Icon = CATEGORIA_ICONO[cat];
          return (
            <IconOptionCard
              key={cat}
              icon={Icon}
              label={cat}
              selected={seleccionadas.includes(cat)}
              onClick={() => toggle(cat)}
              colorVar={CATEGORIA_COLOR[cat]}
            />
          );
        })}
      </div>
    </div>
  );
}

/** Pantalla 3 — animación tipo radar/mapa + revelación del Tiquete de la Ruta 1
 * ya "personalizada" según las categorías elegidas. */
function RutaGeneradaScreen({ state, onDone }: { state: OnboardingState; onDone: () => void }) {
  const lineas = [
    "Sellando tu pasaporte de explorador…",
    `Priorizando ${(state.categoriasFavoritas ?? []).join(" y ") || "tus categorías"}…`,
    "Generando tu primera ruta personalizada…",
  ];
  const [visibles, setVisibles] = useState(0);
  const [listo, setListo] = useState(false);

  useEffect(() => {
    if (visibles >= lineas.length) {
      const t = setTimeout(() => setListo(true), 500);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setVisibles((v) => v + 1), 700);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibles]);

  const pctCarga = Math.round((visibles / lineas.length) * 100);
  const ruta = RUTAS_AMERICA[0];

  if (listo) {
    return (
      <div className="flex flex-col items-center gap-6 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-status-success text-white">
          <Check className="h-7 w-7" strokeWidth={2.4} />
        </span>
        <h1 className="font-display text-2xl font-bold text-txt-primary">Tu ruta está lista</h1>
        <p className="max-w-xs text-sm text-txt-secondary">
          Empiezas en <strong className="text-txt-primary">{ruta.paises[0]}</strong>, priorizando{" "}
          {(state.categoriasFavoritas ?? []).join(" y ") || "todas las categorías"}.
        </p>
        <div className="w-full">
          <RouteBoardingPassCard ruta={ruta} indice={0} pct={0} desbloqueada completa={false} ganada={false} />
        </div>
        <button
          type="button"
          onClick={onDone}
          className="mt-2 flex h-14 w-full items-center justify-center rounded-lg bg-brand-primary font-display text-base font-bold text-white transition-transform duration-200 ease-out hover:-translate-y-0.5"
        >
          Continuar
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-8 text-center" aria-live="polite" aria-busy>
      <div className="relative flex h-28 w-28 items-center justify-center">
        <svg width="112" height="112" className="-rotate-90">
          <circle cx="56" cy="56" r="46" stroke="var(--border-default)" strokeWidth="9" fill="none" />
          <circle
            cx="56"
            cy="56"
            r="46"
            stroke="var(--brand-primary)"
            strokeWidth="9"
            fill="none"
            strokeDasharray={289}
            strokeDashoffset={289 - (289 * pctCarga) / 100}
            strokeLinecap="round"
            className="transition-[stroke-dashoffset] duration-500 ease-out"
          />
        </svg>
        <RadarIcon className="absolute h-9 w-9 text-brand-primary" strokeWidth={1.8} />
      </div>
      <h1 className="font-display text-xl font-bold text-txt-primary">Configurando tu expedición…</h1>
      <ul className="flex w-full max-w-xs flex-col gap-3 text-left">
        {lineas.map((linea, i) => (
          <li
            key={linea}
            className={`flex items-center gap-3 text-sm ${i < visibles ? "text-txt-primary" : "text-txt-tertiary opacity-50"}`}
          >
            {i < visibles ? (
              <Check className="h-5 w-5 shrink-0 text-status-success" strokeWidth={2.6} />
            ) : (
              <span className="h-5 w-5 shrink-0 rounded-full border border-border-strong" />
            )}
            {linea}
          </li>
        ))}
      </ul>
    </div>
  );
}

const HORAS_SUGERIDAS = ["8:00 AM", "1:00 PM", "8:00 PM"];

function RecordatorioScreen({
  state,
  setState,
  onContinue,
}: {
  state: OnboardingState;
  setState: React.Dispatch<React.SetStateAction<OnboardingState>>;
  onContinue: () => void;
}) {
  const hora = state.horaRecordatorio ?? "8:00 PM";

  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-flame-soft text-flame">
        <Bell className="h-8 w-8" strokeWidth={2} />
      </span>
      <h1 className="font-display text-2xl font-bold text-txt-primary">
        Los grandes exploradores no pierden su racha
      </h1>
      <p className="max-w-xs text-sm text-txt-secondary">¿A qué hora te recordamos hacer tu trivia diaria?</p>
      <div className="flex flex-wrap justify-center gap-2">
        {HORAS_SUGERIDAS.map((h) => (
          <button
            key={h}
            type="button"
            onClick={() => setState((s) => ({ ...s, horaRecordatorio: h }))}
            className={`rounded-full border px-4 py-2 text-sm font-semibold shadow-sm transition-colors duration-200 ease-out ${
              hora === h ? "border-brand-primary bg-brand-primary-soft text-brand-primary" : "border-border-default bg-surface-primary text-txt-primary"
            }`}
          >
            {h}
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={() => {
          setState((s) => ({ ...s, recordatorioActivado: true }));
          onContinue();
        }}
        className="mt-2 flex h-14 w-full max-w-xs items-center justify-center gap-2 rounded-lg bg-brand-primary font-display text-base font-bold text-white transition-transform duration-200 ease-out hover:-translate-y-0.5"
      >
        <Bell className="h-4 w-4" strokeWidth={2.2} />
        Activar mi recordatorio diario
      </button>
      <button
        type="button"
        onClick={onContinue}
        className="text-sm font-semibold text-txt-secondary"
      >
        Ahora no
      </button>
    </div>
  );
}

function RegistroScreen({ state, onContinuar }: { state: OnboardingState; onContinuar: () => void }) {
  const monedas = state.monedasGanadas ?? 0;

  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gold text-white">
        <Coins className="h-8 w-8" strokeWidth={2} />
      </span>
      <h1 className="font-display text-2xl font-bold text-txt-primary">¡Tu pasaporte está listo!</h1>
      <p className="max-w-xs text-sm text-txt-secondary">
        Guarda tus <strong className="text-txt-primary">
          <CountUp value={monedas} /> monedas
        </strong>{" "}
        iniciales y tu avance de hoy para no perderlos.
      </p>

      <div className="flex w-full max-w-xs flex-col gap-3">
        <button
          type="button"
          onClick={onContinuar}
          className="flex h-14 w-full items-center justify-center rounded-lg bg-brand-primary font-display text-base font-bold text-white shadow-md transition-transform duration-200 ease-out hover:-translate-y-0.5"
        >
          Continuar con Google
        </button>
        <button
          type="button"
          onClick={onContinuar}
          className="flex h-14 w-full items-center justify-center rounded-lg border border-border-strong bg-surface-primary font-display text-base font-bold text-txt-primary shadow-sm"
        >
          Continuar con Apple
        </button>
        <button
          type="button"
          onClick={onContinuar}
          className="flex h-14 w-full items-center justify-center gap-2 rounded-lg border border-border-strong bg-surface-primary font-display text-base font-bold text-txt-primary shadow-sm"
        >
          <Mail className="h-4 w-4" strokeWidth={2.2} />
          Registrarse con correo
        </button>
        <button type="button" onClick={onContinuar} className="text-sm font-semibold text-txt-secondary">
          Continuar como invitado
        </button>
      </div>
    </div>
  );
}
