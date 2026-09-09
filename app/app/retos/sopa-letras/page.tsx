"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Trophy, RotateCcw, Lightbulb, ArrowRight } from "lucide-react";
import { useAppState } from "@/lib/app-state-context";
import { useSound } from "@/lib/use-sound";
import { SaldoMonedas } from "@/components/app/SaldoMonedas";
import { Confetti } from "@/components/app/Confetti";
import { CountUp } from "@/components/app/CountUp";
import { TEMAS_SOPA_LETRAS, type TemaSopaLetras } from "@/lib/sopa-letras-data";
import { generarSopa, celdasEntre, coincideSeleccion, type SopaGenerada, type Celda } from "@/lib/sopa-letras-generador";

const SOPA_SEGUNDOS = 80;
const SOPA_MONEDAS = 40;

// Una paleta de colores YA existente en el sistema de diseño (las 6 categorías
// + acento + dorado) — cada palabra encontrada toma el siguiente color de la
// lista, así no hay que inventar hex nuevos.
const PALETA_COLORES = [
  "var(--cat-geografia)",
  "var(--cat-historia)",
  "var(--cat-cultura)",
  "var(--cat-gastronomia)",
  "var(--cat-naturaleza)",
  "var(--cat-deportes)",
  "var(--brand-primary)",
  "var(--gold)",
];

function clave(c: Celda): string {
  return `${c.fila},${c.col}`;
}

function temaAleatorio(excluir?: string): TemaSopaLetras {
  const pool = excluir ? TEMAS_SOPA_LETRAS.filter((t) => t.tema !== excluir) : TEMAS_SOPA_LETRAS;
  return pool[Math.floor(Math.random() * pool.length)];
}

export default function SopaLetrasPage() {
  const router = useRouter();
  const { state, setState, guardarAhora } = useAppState();
  const { playCorrect, playIncorrect, playVictoria, playTiempoAgotado, playTick } = useSound();

  const [tema, setTema] = useState<TemaSopaLetras | null>(null);
  const [sopa, setSopa] = useState<SopaGenerada | null>(null);
  const [encontradas, setEncontradas] = useState<Map<string, string>>(new Map());
  const [caminoActual, setCaminoActual] = useState<Celda[]>([]);
  const [celdasError, setCeldasError] = useState<Set<string>>(new Set());
  const [tiempo, setTiempo] = useState(SOPA_SEGUNDOS);
  const [terminado, setTerminado] = useState(false);
  const [gano, setGano] = useState(false);
  const arrastrandoRef = useRef(false);
  const inicioRef = useRef<Celda | null>(null);
  const recompensaRef = useRef(false);
  const erroresTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Se elige SOLO en el cliente (Math.random) para que el HTML del servidor
  // y el del cliente coincidan en la primera pintura.
  useEffect(() => {
    const t = temaAleatorio();
    setTema(t);
    setSopa(generarSopa(t.palabras));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (terminado || !sopa) return;
    const interval = setInterval(() => setTiempo((t) => (t > 0 ? t - 1 : 0)), 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [terminado, sopa]);

  useEffect(() => {
    if (!terminado && sopa && tiempo === 0) finalizar(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tiempo]);

  useEffect(() => {
    if (!terminado && tiempo > 0 && tiempo <= 5) playTick();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tiempo]);

  function finalizar(completo: boolean) {
    if (recompensaRef.current) return;
    recompensaRef.current = true;
    setTerminado(true);
    setGano(completo);
    if (completo) {
      setState((s) => {
        const nuevo = { ...s, coins: s.coins + SOPA_MONEDAS, monedasGanadasTotal: s.monedasGanadasTotal + SOPA_MONEDAS };
        void guardarAhora(nuevo);
        return nuevo;
      });
      playVictoria();
    } else {
      playTiempoAgotado();
    }
  }

  function marcarError(celdas: Celda[]) {
    if (erroresTimeoutRef.current) clearTimeout(erroresTimeoutRef.current);
    setCeldasError(new Set(celdas.map(clave)));
    erroresTimeoutRef.current = setTimeout(() => setCeldasError(new Set()), 400);
  }

  function celdaDesdeEvento(e: { clientX: number; clientY: number }): Celda | null {
    const el = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null;
    const objetivo = el?.closest("[data-fila]") as HTMLElement | null;
    if (!objetivo) return null;
    return { fila: Number(objetivo.dataset.fila), col: Number(objetivo.dataset.col) };
  }

  function iniciarArrastre(e: React.PointerEvent) {
    if (terminado || !sopa) return;
    const celda = celdaDesdeEvento(e);
    if (!celda) return;
    arrastrandoRef.current = true;
    inicioRef.current = celda;
    setCaminoActual([celda]);
  }

  function continuarArrastre(e: React.PointerEvent) {
    if (!arrastrandoRef.current || !inicioRef.current) return;
    const celda = celdaDesdeEvento(e);
    if (!celda) return;
    const camino = celdasEntre(inicioRef.current, celda);
    if (camino) setCaminoActual(camino);
  }

  function soltarArrastre() {
    if (!arrastrandoRef.current || !sopa || !tema) {
      arrastrandoRef.current = false;
      inicioRef.current = null;
      setCaminoActual([]);
      return;
    }
    arrastrandoRef.current = false;
    inicioRef.current = null;

    const camino = caminoActual;
    setCaminoActual([]);
    if (camino.length < 2) return;

    const palabraEncontrada = tema.palabras.find(
      (p) => !encontradas.has(p) && coincideSeleccion(camino, sopa.posiciones[p])
    );
    if (!palabraEncontrada) {
      playIncorrect();
      marcarError(camino);
      return;
    }

    playCorrect();
    const color = PALETA_COLORES[encontradas.size % PALETA_COLORES.length];
    const nuevasEncontradas = new Map(encontradas);
    nuevasEncontradas.set(palabraEncontrada, color);
    setEncontradas(nuevasEncontradas);
    if (nuevasEncontradas.size === tema.palabras.length) finalizar(true);
  }

  function cancelarArrastre() {
    arrastrandoRef.current = false;
    inicioRef.current = null;
    setCaminoActual([]);
  }

  function empezarSopa(t: TemaSopaLetras) {
    recompensaRef.current = false;
    setTerminado(false);
    setGano(false);
    setEncontradas(new Map());
    setCaminoActual([]);
    setCeldasError(new Set());
    setTiempo(SOPA_SEGUNDOS);
    setTema(t);
    setSopa(generarSopa(t.palabras));
  }

  function reintentar() {
    if (!tema) return;
    empezarSopa(tema);
  }

  function siguienteSopa() {
    empezarSopa(temaAleatorio(tema?.tema));
  }

  if (!tema || !sopa) {
    return (
      <div className="flex min-h-dvh flex-col gap-3 px-4 pt-4">
        <div className="h-8 w-40 animate-pulse rounded-lg bg-surface-secondary" />
        <div className="mt-6 h-72 animate-pulse rounded-2xl bg-surface-secondary" />
      </div>
    );
  }

  if (terminado) {
    return (
      <div className="relative flex min-h-dvh flex-col items-center justify-center gap-5 overflow-hidden px-6 text-center">
        {gano && <Confetti />}
        <Trophy className={`h-14 w-14 ${gano ? "text-gold" : "text-txt-tertiary"}`} strokeWidth={1.8} />
        <h1 className="font-display text-2xl font-bold text-txt-primary">
          {gano ? "¡Sopa completada!" : "Se acabó el tiempo"}
        </h1>
        <p className="text-sm text-txt-secondary">
          Encontraste {encontradas.size} de {tema.palabras.length} palabras
        </p>
        {gano && (
          <>
            <span className="rounded-full bg-surface-secondary px-4 py-2 text-sm font-semibold text-txt-primary">
              +<CountUp value={SOPA_MONEDAS} /> monedas
            </span>
            <div className="flex max-w-xs items-start gap-2 rounded-xl bg-gold-soft px-4 py-3 text-left text-xs font-medium text-txt-primary">
              <Lightbulb className="h-4 w-4 shrink-0 text-gold" strokeWidth={2.2} />
              <p>
                <span className="font-bold">¿Sabías que?</span> {tema.sabiasQue}
              </p>
            </div>
          </>
        )}
        <div className="flex w-full max-w-xs flex-col gap-3">
          {gano ? (
            <button
              type="button"
              onClick={siguienteSopa}
              className="flex h-14 items-center justify-center gap-2 rounded-lg bg-brand-primary font-display text-base font-bold text-white transition-transform duration-200 ease-out hover:-translate-y-0.5"
            >
              Continuar
              <ArrowRight className="h-4 w-4" strokeWidth={2.2} />
            </button>
          ) : (
            <button
              type="button"
              onClick={reintentar}
              className="flex h-14 items-center justify-center gap-2 rounded-lg bg-brand-primary font-display text-base font-bold text-white transition-transform duration-200 ease-out hover:-translate-y-0.5"
            >
              <RotateCcw className="h-4 w-4" strokeWidth={2.2} />
              Intentar de nuevo
            </button>
          )}
          <button
            type="button"
            onClick={() => router.push("/app/retos")}
            className="text-center text-sm font-semibold text-txt-secondary"
          >
            Volver a Retos
          </button>
        </div>
      </div>
    );
  }

  // Color de cada celda que ya forma parte de una palabra encontrada (una
  // palabra = un color, tomado de encontradas). Superposiciones entre
  // palabras se resuelven con la última encontrada.
  const celdaColor: Record<string, string> = {};
  encontradas.forEach((color, palabra) => {
    sopa.posiciones[palabra].forEach((c) => {
      celdaColor[clave(c)] = color;
    });
  });

  return (
    <div className="flex min-h-dvh flex-col px-4 pt-4">
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => router.push("/app/retos")}
          aria-label="Volver a Retos"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-txt-secondary"
        >
          <ChevronLeft className="h-5 w-5" strokeWidth={2.4} />
        </button>
        <p className="flex-1 text-center text-xs font-semibold uppercase tracking-wide text-txt-tertiary">
          {tema.tema} · {encontradas.size}/{tema.palabras.length}
        </p>
        <SaldoMonedas monedas={state.coins} />
      </div>

      <p className="mt-2 text-center font-display text-2xl font-extrabold tabular text-txt-primary">{tiempo}s</p>

      <div className="mt-3 flex justify-center">
        <div
          className="grid touch-none select-none gap-0.5"
          style={{ gridTemplateColumns: `repeat(${sopa.tamano}, minmax(0, 1fr))`, width: "100%", maxWidth: 360 }}
          onPointerDown={iniciarArrastre}
          onPointerMove={continuarArrastre}
          onPointerUp={soltarArrastre}
          onPointerCancel={cancelarArrastre}
        >
          {sopa.grid.map((fila, f) =>
            fila.map((letra, c) => {
              const k = clave({ fila: f, col: c });
              const color = celdaColor[k];
              const enCamino = caminoActual.some((cc) => cc.fila === f && cc.col === c);
              const error = celdasError.has(k);
              return (
                <div
                  key={k}
                  data-fila={f}
                  data-col={c}
                  className={`flex aspect-square items-center justify-center rounded-sm font-display text-xs font-bold uppercase transition-colors duration-150 ${
                    color
                      ? "text-white"
                      : error
                        ? "bg-status-error-soft text-status-error"
                        : enCamino
                          ? "bg-brand-primary text-white"
                          : "bg-surface-secondary text-txt-primary"
                  }`}
                  style={color ? { backgroundColor: color } : undefined}
                >
                  {letra}
                </div>
              );
            })
          )}
        </div>
      </div>

      <p className="mt-2 text-center text-xs text-txt-tertiary">Desliza el dedo sobre las letras para marcarlas</p>

      <div className="mt-3 flex flex-wrap justify-center gap-2 pb-4">
        {tema.palabras.map((p) => {
          const color = encontradas.get(p);
          return (
            <span
              key={p}
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${
                color ? "border-border-default bg-surface-primary text-txt-tertiary line-through" : "border-border-default bg-surface-primary text-txt-primary"
              }`}
            >
              {color && <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: color }} />}
              {p}
            </span>
          );
        })}
      </div>
    </div>
  );
}
