"use client";

import { use, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X as XIcon, RotateCcw, Scissors, Clock3, Lightbulb, ChevronLeft, Crown, Gift } from "lucide-react";
import { SaldoMonedas } from "@/components/app/SaldoMonedas";
import { CompletarPalabra } from "@/components/app/CompletarPalabra";
import { formatosDeRonda, type FormatoPregunta } from "@/lib/formato-pregunta";
import { souvenirDePais } from "@/lib/souvenirs-data";
import { useAppState } from "@/lib/app-state-context";
import { registrarActividad, progresoDePais, otorgarInsigniaSiCorresponde, esPro } from "@/lib/app-state";
import { AYUDAS_CONFIG } from "@/lib/ayudas";
import { CATEGORIA_COLOR } from "@/lib/category-style";
import { preguntasRetoFinal, RETO_FINAL_CONFIG } from "@/lib/trivia-bank";
import { categoriasDelPais } from "@/lib/countries-data";
import { useSound } from "@/lib/use-sound";
import { Confetti } from "@/components/app/Confetti";
import { CountUp } from "@/components/app/CountUp";
import type { PreguntaTrivia } from "@/lib/onboarding-data";

const UMBRAL_CONQUISTA = 0.7; // 70% de aciertos conquista el país

export default function RetoFinalPage({ params }: { params: Promise<{ pais: string }> }) {
  const { pais: paisParam } = use(params);
  const pais = decodeURIComponent(paisParam);
  const router = useRouter();
  const { state, setState, guardarAhora } = useAppState();
  const { playCorrect, playIncorrect, playVictoria, playTiempoAgotado, playTick } = useSound();

  // El banco se baraja con Math.random() — se genera SOLO en el cliente (efecto,
  // no en el initializer de useState) para que el HTML del servidor y el del
  // cliente coincidan en la primera pintura y no haya error de hidratación.
  const [preguntas, setPreguntas] = useState<PreguntaTrivia[] | null>(null);
  const [formatos, setFormatos] = useState<FormatoPregunta[] | null>(null);
  useEffect(() => {
    const qs = preguntasRetoFinal(pais, categoriasDelPais());
    setPreguntas(qs);
    setFormatos(formatosDeRonda(qs));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [aciertos, setAciertos] = useState(0);
  const [terminado, setTerminado] = useState(false);
  const [tiempo, setTiempo] = useState(RETO_FINAL_CONFIG.segundos);
  const [ocultas, setOcultas] = useState<number[]>([]);
  const [pistaActiva, setPistaActiva] = useState(false);
  const respondiendoRef = useRef(false);
  const terminadoRef = useRef(false);
  const aciertosRef = useRef(0);
  const indexRef = useRef(0);

  function finalizar(aciertosFinal: number) {
    if (!preguntas) return;
    if (terminadoRef.current) return;
    terminadoRef.current = true;
    const conquistado = aciertosFinal / preguntas.length >= UMBRAL_CONQUISTA;
    const hoy = new Date().toISOString().slice(0, 10);

    setState((s) => {
      const conRacha = registrarActividad(s, hoy);
      const progreso = progresoDePais(conRacha, pais);
      const conProgreso: typeof conRacha = {
        ...conRacha,
        coins: conRacha.coins + aciertosFinal * 5,
        monedasGanadasTotal: conRacha.monedasGanadasTotal + aciertosFinal * 5,
        gems: conquistado ? conRacha.gems + 3 : conRacha.gems,
        progresoPorPais: {
          ...conRacha.progresoPorPais,
          [pais]: { ...progreso, retoFinalCompletado: conquistado || progreso.retoFinalCompletado },
        },
      };
      const nuevo = conquistado ? otorgarInsigniaSiCorresponde(conProgreso, pais) : conProgreso;
      // Conquistar un país es un hito real que no se puede dar el lujo de
      // perder si el usuario cierra la app justo después de terminar (bug
      // real reportado: el guardado normal espera 800ms y no reintenta si no
      // hay ningún cambio de estado posterior) — se guarda de inmediato.
      if (conquistado) void guardarAhora(nuevo);
      return nuevo;
    });

    setAciertos(aciertosFinal);
    setTerminado(true);
    if (conquistado) playVictoria();
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
    setTiempo(RETO_FINAL_CONFIG.segundos);
    const qs = preguntasRetoFinal(pais, categoriasDelPais());
    setPreguntas(qs);
    setFormatos(formatosDeRonda(qs));
  }

  // Cada pregunta nueva empieza sin 50/50 ni pista aplicados.
  useEffect(() => {
    setOcultas([]);
    setPistaActiva(false);
  }, [index]);

  useEffect(() => {
    if (terminado) return;
    const interval = setInterval(() => {
      setTiempo((t) => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [terminado]);

  // Se acabó el tiempo → cierra el reto (efecto separado, nunca dentro del
  // updater de setTiempo — llamar setState de otro componente ahí rompe React).
  useEffect(() => {
    if (!terminado && tiempo === 0) {
      finalizar(aciertosRef.current);
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

  function avanzar(correcta: boolean) {
    if (!preguntas) return;
    const nuevosAciertos = aciertos + (correcta ? 1 : 0);
    if (index < preguntas.length - 1) {
      setAciertos(nuevosAciertos);
      aciertosRef.current = nuevosAciertos;
      setIndex((idx) => idx + 1);
      indexRef.current = index + 1;
    } else {
      finalizar(nuevosAciertos);
    }
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
      avanzar(correcta);
    }, 600);
  }

  function responderCompletar(correcta: boolean) {
    if (!preguntas || respondiendoRef.current || terminadoRef.current) return;
    respondiendoRef.current = true;
    if (correcta) playCorrect();
    else playIncorrect();
    setTimeout(() => {
      respondiendoRef.current = false;
      avanzar(correcta);
    }, 400);
  }

  if (!preguntas || !formatos) {
    return (
      <div className="flex min-h-dvh flex-col gap-3 px-4 pt-4">
        <div className="h-1 w-full animate-pulse rounded-full bg-surface-secondary" />
        <div className="mt-10 h-8 w-2/3 animate-pulse rounded-lg bg-surface-secondary" />
        <div className="h-40 animate-pulse rounded-lg bg-surface-secondary" />
      </div>
    );
  }

  if (terminado) {
    const conquistado = aciertos / preguntas.length >= UMBRAL_CONQUISTA;
    // Colombia es el único país gratis — al conquistarlo, este es el momento
    // "aha" real (Cal AI/Noom): el paywall se ofrece como el paso siguiente
    // natural, no como una puerta forzada. Quien ya es Pro/trial no lo ve.
    const momentoPaywall = conquistado && pais === "Colombia" && !esPro(state);
    return (
      <div className="relative flex min-h-dvh flex-col items-center justify-center gap-6 overflow-hidden px-6 text-center">
        {conquistado && <Confetti />}
        {
          // eslint-disable-next-line @next/next/no-img-element -- GIF animado: next/image reprocesa el formato y le quita la animación.
          <img
            src={conquistado ? "/gifs/congrats.gif" : "/gifs/casi-lo-logras.gif"}
            alt=""
            aria-hidden="true"
            className="h-28 w-28 object-contain"
          />
        }
        <h1 className="font-display text-2xl font-bold text-txt-primary">
          {conquistado ? `¡${pais} conquistado!` : "Casi lo logras"}
        </h1>
        <p className="text-sm text-txt-secondary">
          Acertaste {aciertos} de {preguntas.length}
          {!conquistado && " — necesitas al menos 70% para conquistar el país"}
        </p>
        {conquistado && (
          <div className="flex gap-3 text-sm font-semibold text-txt-primary">
            <span className="rounded-full bg-surface-secondary px-3 py-1.5">
              +<CountUp value={aciertos * 5} /> monedas
            </span>
            <span className="rounded-full bg-surface-secondary px-3 py-1.5">+3 gemas</span>
          </div>
        )}
        {conquistado && souvenirDePais(pais) && (
          <div className="flex items-center gap-2 rounded-xl bg-gold-soft px-4 py-2.5 text-xs font-semibold text-txt-primary">
            <Gift className="h-4 w-4 shrink-0 text-gold" strokeWidth={2.2} />
            Nuevo souvenir: {souvenirDePais(pais)!.nombre} — véelo en tu Perfil
          </div>
        )}
        <div className="flex w-full max-w-xs flex-col gap-3">
          {!conquistado && (
            <button
              type="button"
              onClick={reiniciar}
              className="flex h-14 items-center justify-center gap-2 rounded-lg border border-border-strong font-display text-base font-bold text-txt-primary"
            >
              <RotateCcw className="h-4 w-4" strokeWidth={2.2} />
              Intentar de nuevo
            </button>
          )}
          {momentoPaywall ? (
            <>
              <button
                type="button"
                onClick={() => router.push("/paywall")}
                className="flex h-14 items-center justify-center gap-2 rounded-lg bg-brand-primary font-display text-base font-bold text-white transition-transform duration-200 ease-out hover:-translate-y-0.5"
              >
                <Crown className="h-4 w-4" strokeWidth={2.2} />
                Seguir mi conquista
              </button>
              <button
                type="button"
                onClick={() => router.push("/app")}
                className="text-center text-sm font-medium text-txt-secondary"
              >
                Volver al mapa
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => router.push("/app")}
              className="flex h-14 items-center justify-center rounded-lg bg-brand-primary font-display text-base font-bold text-white transition-transform duration-200 ease-out hover:-translate-y-0.5"
            >
              Volver al mapa
            </button>
          )}
        </div>
      </div>
    );
  }

  const pregunta = preguntas[index];
  const formato = formatos[index];
  const pctTiempo = (tiempo / RETO_FINAL_CONFIG.segundos) * 100;

  return (
    <div className="flex min-h-dvh flex-col px-4 pt-4">
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => router.push(`/app/pais/${encodeURIComponent(pais)}`)}
          aria-label="Volver al país"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-txt-secondary"
        >
          <ChevronLeft className="h-5 w-5" strokeWidth={2.4} />
        </button>
        <p className="flex-1 text-center text-xs font-semibold uppercase tracking-wide text-txt-tertiary">
          Reto final · {pais} · {index + 1}/{preguntas.length}
        </p>
        <SaldoMonedas monedas={state.coins} />
        <div className="relative flex h-16 w-16 shrink-0 items-center justify-center">
          <svg width="64" height="64" className="-rotate-90">
            <circle cx="32" cy="32" r="27" stroke="var(--border-default)" strokeWidth="5" fill="none" />
            <circle
              cx="32"
              cy="32"
              r="27"
              stroke={tiempo <= 20 ? "var(--status-error)" : "var(--brand-primary)"}
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
          disabled={formato === "completar" || !puedeUsar("cincuenta") || ocultas.length > 0}
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
          disabled={formato === "completar" || !puedeUsar("pista") || pistaActiva}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border-default bg-surface-primary py-2 text-xs font-semibold text-txt-primary disabled:opacity-40"
        >
          <Lightbulb className="h-3.5 w-3.5" strokeWidth={2.2} />
          Pista {state.inventario.pista > 0 ? `(${state.inventario.pista})` : `· ${AYUDAS_CONFIG.pista.costo}`}
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-6 pb-6 pt-8">
        <p className="text-xs font-semibold" style={{ color: CATEGORIA_COLOR[pregunta.categoria] }}>
          {pregunta.categoria}
        </p>
        <h1 className="text-balance font-display text-2xl font-bold leading-tight text-txt-primary">
          {pregunta.pregunta}
        </h1>
        {formato === "completar" ? (
          <CompletarPalabra key={index} respuesta={pregunta.opciones[pregunta.correctaIndex]} onResuelto={responderCompletar} />
        ) : (
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
        )}
      </div>
    </div>
  );
}
