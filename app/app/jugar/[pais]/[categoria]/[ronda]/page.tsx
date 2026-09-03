"use client";

import { use, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X as XIcon, RotateCcw, Scissors, Clock3, Lightbulb, ChevronLeft } from "lucide-react";
import { useAppState } from "@/lib/app-state-context";
import { registrarActividad, rondaAprobada, progresoDePais } from "@/lib/app-state";
import { AYUDAS_CONFIG } from "@/lib/ayudas";
import { CATEGORIA_COLOR } from "@/lib/category-style";
import { preguntasParaRonda, RONDAS, type RondaId } from "@/lib/trivia-bank";
import type { PreguntaTrivia } from "@/lib/onboarding-data";
import { useSound } from "@/lib/use-sound";
import { Confetti } from "@/components/app/Confetti";
import { CountUp } from "@/components/app/CountUp";
import type { Categoria } from "@/lib/onboarding-data";

export default function JugarRondaPage({
  params,
}: {
  params: Promise<{ pais: string; categoria: string; ronda: string }>;
}) {
  const { pais: paisParam, categoria: categoriaParam, ronda: rondaParam } = use(params);
  const pais = decodeURIComponent(paisParam);
  const categoria = decodeURIComponent(categoriaParam) as Categoria;
  const ronda = rondaParam as RondaId;
  const cfg = RONDAS[ronda];

  const router = useRouter();
  const { state, setState } = useAppState();
  const { playCorrect, playIncorrect, playVictoria, playTiempoAgotado, playTick } = useSound();

  // El banco se baraja con Math.random() — se genera SOLO en el cliente (efecto,
  // no en el initializer de useState) para que el HTML del servidor y el del
  // cliente coincidan en la primera pintura y no haya error de hidratación.
  const [preguntas, setPreguntas] = useState<PreguntaTrivia[] | null>(null);
  useEffect(() => {
    setPreguntas(preguntasParaRonda(pais, categoria, ronda));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [aciertos, setAciertos] = useState(0);
  const [terminado, setTerminado] = useState(false);
  const [tiempo, setTiempo] = useState(cfg.segundos);
  const [ocultas, setOcultas] = useState<number[]>([]);
  const [pistaActiva, setPistaActiva] = useState(false);
  const respondiendoRef = useRef(false);
  const terminadoRef = useRef(false);
  // Refs espejo — el intervalo del cronómetro se crea UNA vez, así que necesita
  // leer los valores MÁS RECIENTES sin depender de closures obsoletas.
  const aciertosRef = useRef(0);
  const indexRef = useRef(0);

  function finalizar(aciertosFinal: number, respondidas: number) {
    if (!preguntas) return;
    if (terminadoRef.current) return;
    terminadoRef.current = true;
    const aprobado = rondaAprobada(aciertosFinal, preguntas.length);
    const hoy = new Date().toISOString().slice(0, 10);

    setState((s) => {
      const conRacha = registrarActividad(s, hoy);
      const progreso = progresoDePais(conRacha, pais);
      const progresoCategoria = progreso.categorias[categoria];
      const nuevaRonda = { completado: aprobado, aciertos: aciertosFinal, total: preguntas.length };
      return {
        ...conRacha,
        coins: conRacha.coins + aciertosFinal * 5,
        progresoPorPais: {
          ...conRacha.progresoPorPais,
          [pais]: {
            ...progreso,
            categorias: {
              ...progreso.categorias,
              [categoria]: { rondas: { ...progresoCategoria.rondas, [ronda]: nuevaRonda } },
            },
          },
        },
      };
    });

    setAciertos(aciertosFinal);
    setTerminado(true);
    if (aprobado) playVictoria();
    else playTiempoAgotado();
  }

  function reiniciar() {
    terminadoRef.current = false;
    respondiendoRef.current = false;
    aciertosRef.current = 0;
    indexRef.current = 0;
    setSelected(null);
    setAciertos(0);
    setIndex(0);
    setOcultas([]);
    setPistaActiva(false);
    setTerminado(false);
    setTiempo(cfg.segundos);
    setPreguntas(preguntasParaRonda(pais, categoria, ronda));
  }

  // Cada pregunta nueva empieza sin 50/50 ni pista aplicados.
  useEffect(() => {
    setOcultas([]);
    setPistaActiva(false);
  }, [index]);

  // Cronómetro total de la ronda — 30s para responder TODAS las preguntas del lote.
  useEffect(() => {
    if (terminado) return;
    const interval = setInterval(() => {
      setTiempo((t) => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [terminado]);

  // Se acabó el tiempo → cierra la ronda (efecto separado, nunca dentro del
  // updater de setTiempo — llamar setState de otro componente ahí rompe React).
  useEffect(() => {
    if (!terminado && tiempo === 0) {
      finalizar(aciertosRef.current, indexRef.current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tiempo]);

  // Últimos 5 segundos: tic-tac de presión.
  useEffect(() => {
    if (!terminado && tiempo > 0 && tiempo <= 5) playTick();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tiempo]);

  /** Si ya la tiene comprada la descuenta del inventario; si no, la compra al instante
   * con monedas/gemas (si le alcanza) y la usa de una vez — no hay que ir a la Tienda primero. */
  function puedeUsar(id: keyof typeof AYUDAS_CONFIG): boolean {
    if (state.inventario[id] > 0) return true;
    const cfg = AYUDAS_CONFIG[id];
    return (cfg.moneda === "coins" ? state.coins : state.gems) >= cfg.costo;
  }

  function consumirAyuda(id: keyof typeof AYUDAS_CONFIG) {
    setState((s) => {
      if (s.inventario[id] > 0) {
        return { ...s, inventario: { ...s.inventario, [id]: s.inventario[id] - 1 } };
      }
      const cfg = AYUDAS_CONFIG[id];
      return cfg.moneda === "coins" ? { ...s, coins: s.coins - cfg.costo } : { ...s, gems: s.gems - cfg.costo };
    });
  }

  function usarCincuenta() {
    if (!preguntas || !puedeUsar("cincuenta") || ocultas.length > 0 || terminadoRef.current) return;
    const correcta = preguntas[index].correctaIndex;
    const incorrectas = preguntas[index].opciones.map((_, i) => i).filter((i) => i !== correcta);
    const aOcultar = incorrectas.sort(() => Math.random() - 0.5).slice(0, 2);
    setOcultas(aOcultar);
    consumirAyuda("cincuenta");
  }

  function usarPista() {
    if (!puedeUsar("pista") || pistaActiva || terminadoRef.current) return;
    setPistaActiva(true);
    consumirAyuda("pista");
  }

  function usarTiempoExtra() {
    if (!puedeUsar("tiempoExtra") || terminadoRef.current) return;
    setTiempo((t) => t + 10);
    consumirAyuda("tiempoExtra");
  }

  function responder(i: number) {
    if (!preguntas || respondiendoRef.current || terminadoRef.current) return;
    respondiendoRef.current = true;
    setSelected(i);
    const correcta = i === preguntas[index].correctaIndex;
    if (correcta) playCorrect();
    else playIncorrect();

    setTimeout(() => {
      respondiendoRef.current = false;
      setSelected(null);
      const nuevosAciertos = aciertos + (correcta ? 1 : 0);
      if (index < preguntas.length - 1) {
        setAciertos(nuevosAciertos);
        aciertosRef.current = nuevosAciertos;
        setIndex((idx) => idx + 1);
        indexRef.current = index + 1;
      } else {
        finalizar(nuevosAciertos, preguntas.length);
      }
    }, 700);
  }

  if (!preguntas) {
    return (
      <div className="flex min-h-dvh flex-col gap-3 px-4 pt-4">
        <div className="h-1 w-full animate-pulse rounded-full bg-surface-secondary" />
        <div className="mt-10 h-8 w-2/3 animate-pulse rounded-lg bg-surface-secondary" />
        <div className="h-40 animate-pulse rounded-lg bg-surface-secondary" />
      </div>
    );
  }

  if (terminado) {
    const aprobado = rondaAprobada(aciertos, preguntas.length);
    return (
      <div className="relative flex min-h-dvh flex-col items-center justify-center gap-6 overflow-hidden px-6 text-center">
        {aprobado && <Confetti />}
        {
          // eslint-disable-next-line @next/next/no-img-element -- GIF animado: next/image reprocesa el formato y le quita la animación.
          <img
            src={aprobado ? "/gifs/congrats.gif" : "/gifs/casi-lo-logras.gif"}
            alt=""
            aria-hidden="true"
            className="h-28 w-28 object-contain"
          />
        }
        <h1 className="font-display text-2xl font-bold text-txt-primary">
          {aprobado ? `¡Ronda ${ronda} superada!` : "Casi lo logras"}
        </h1>
        <p className="text-sm text-txt-secondary">
          Acertaste {aciertos} de {preguntas.length}
          {!aprobado && " — necesitas al menos 80% para aprobar"}
        </p>
        {aprobado && (
          <div className="flex gap-3 text-sm font-semibold text-txt-primary">
            <span className="rounded-full bg-surface-secondary px-3 py-1.5">
              +<CountUp value={aciertos * 5} /> monedas
            </span>
          </div>
        )}
        <div className="flex w-full max-w-xs flex-col gap-3">
          {!aprobado && (
            <button
              type="button"
              onClick={reiniciar}
              className="flex h-14 items-center justify-center gap-2 rounded-lg border border-border-strong font-display text-base font-bold text-txt-primary"
            >
              <RotateCcw className="h-4 w-4" strokeWidth={2.2} />
              Intentar de nuevo
            </button>
          )}
          <button
            type="button"
            onClick={() => router.push(`/app/pais/${encodeURIComponent(pais)}/categoria/${encodeURIComponent(categoria)}`)}
            className="flex h-14 items-center justify-center rounded-lg bg-brand-primary font-display text-base font-bold text-white transition-transform duration-200 ease-out hover:-translate-y-0.5"
          >
            Volver a {categoria}
          </button>
        </div>
      </div>
    );
  }

  const pregunta = preguntas[index];
  const pctTiempo = (tiempo / cfg.segundos) * 100;

  return (
    <div className="flex min-h-dvh flex-col px-4 pt-4">
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => router.push(`/app/pais/${encodeURIComponent(pais)}/categoria/${encodeURIComponent(categoria)}`)}
          aria-label="Volver a las categorías"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-txt-secondary"
        >
          <ChevronLeft className="h-5 w-5" strokeWidth={2.4} />
        </button>
        <p className="flex-1 text-center text-xs font-semibold uppercase tracking-wide text-txt-tertiary">
          {ronda} · {categoria} · {index + 1}/{preguntas.length}
        </p>
        <div className="relative flex h-16 w-16 shrink-0 items-center justify-center">
          <svg width="64" height="64" className="-rotate-90">
            <circle cx="32" cy="32" r="27" stroke="var(--border-default)" strokeWidth="5" fill="none" />
            <circle
              cx="32"
              cy="32"
              r="27"
              stroke={tiempo <= 8 ? "var(--status-error)" : CATEGORIA_COLOR[categoria]}
              strokeWidth="5"
              fill="none"
              strokeDasharray={170}
              strokeDashoffset={170 - (170 * pctTiempo) / 100}
              strokeLinecap="round"
              className="transition-[stroke-dashoffset] duration-1000 ease-linear"
            />
          </svg>
          <span className="absolute font-display text-xl font-extrabold tabular text-txt-primary">{tiempo}</span>
        </div>
      </div>

      {/* Barra de ayudas — si ya la compraste se usa gratis; si no, se compra al
          instante con tus monedas/gemas, sin tener que pasar por la Tienda. */}
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={usarCincuenta}
          disabled={!puedeUsar("cincuenta") || ocultas.length > 0}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border-default bg-surface-primary py-2 text-xs font-semibold text-txt-primary disabled:opacity-40"
        >
          <Scissors className="h-3.5 w-3.5" strokeWidth={2.2} />
          50/50 {state.inventario.cincuenta > 0 ? `(${state.inventario.cincuenta})` : `· ${AYUDAS_CONFIG.cincuenta.costo}`}
        </button>
        <button
          type="button"
          onClick={usarTiempoExtra}
          disabled={!puedeUsar("tiempoExtra")}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border-default bg-surface-primary py-2 text-xs font-semibold text-txt-primary disabled:opacity-40"
        >
          <Clock3 className="h-3.5 w-3.5" strokeWidth={2.2} />
          +10s {state.inventario.tiempoExtra > 0 ? `(${state.inventario.tiempoExtra})` : `· ${AYUDAS_CONFIG.tiempoExtra.costo}`}
        </button>
        <button
          type="button"
          onClick={usarPista}
          disabled={!puedeUsar("pista") || pistaActiva}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border-default bg-surface-primary py-2 text-xs font-semibold text-txt-primary disabled:opacity-40"
        >
          <Lightbulb className="h-3.5 w-3.5" strokeWidth={2.2} />
          Pista {state.inventario.pista > 0 ? `(${state.inventario.pista})` : `· ${AYUDAS_CONFIG.pista.costo}`}
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-6 pb-6 pt-8">
        <h1 className="text-balance font-display text-2xl font-bold leading-tight text-txt-primary">
          {pregunta.pregunta}
        </h1>
        <div className="flex flex-col gap-3">
          {pregunta.opciones.map((op, i) => {
            if (ocultas.includes(i)) return null;
            const showState = selected !== null;
            const isCorrect = i === pregunta.correctaIndex;
            const isSelected = selected === i;
            return (
              <button
                key={op}
                type="button"
                onClick={() => responder(i)}
                disabled={selected !== null}
                className={`flex h-14 w-full items-center justify-between rounded-lg border px-4 text-left font-body text-base font-medium transition-colors duration-200 ease-out active:scale-[0.98] ${
                  showState && isCorrect
                    ? "border-status-success bg-status-success-soft text-txt-primary"
                    : showState && isSelected
                      ? "border-status-error bg-status-error-soft text-txt-primary"
                      : pistaActiva && isCorrect
                        ? "border-gold bg-surface-primary text-txt-primary ring-2 ring-gold"
                        : "border-border-default bg-surface-primary text-txt-primary shadow-sm"
                }`}
              >
                {op}
                {showState && isCorrect && <Check className="h-5 w-5 text-status-success" strokeWidth={2.6} />}
                {showState && isSelected && !isCorrect && <XIcon className="h-5 w-5 text-status-error" strokeWidth={2.6} />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
