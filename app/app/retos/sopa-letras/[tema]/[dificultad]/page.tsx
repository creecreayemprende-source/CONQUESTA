"use client";

import { use, useEffect, useRef, useState } from "react";
import { useRouter, notFound } from "next/navigation";
import { ChevronLeft, Trophy, RotateCcw, Lightbulb } from "lucide-react";
import { useAppState } from "@/lib/app-state-context";
import { useSound } from "@/lib/use-sound";
import { SaldoMonedas } from "@/components/app/SaldoMonedas";
import { Confetti } from "@/components/app/Confetti";
import { CountUp } from "@/components/app/CountUp";
import { temaDePais } from "@/lib/sopa-letras-data";
import {
  generarSopa,
  palabrasPorNivel,
  celdasEntre,
  coincideSeleccion,
  SOPA_NIVELES,
  type NivelSopa,
  type SopaGenerada,
  type Celda,
} from "@/lib/sopa-letras-generador";

const RECOMPENSA_POR_NIVEL: Record<NivelSopa, number> = { Explorador: 20, Descubridor: 30, Experto: 50 };

function clave(c: Celda): string {
  return `${c.fila},${c.col}`;
}

export default function SopaLetrasJuegoPage({
  params,
}: {
  params: Promise<{ tema: string; dificultad: string }>;
}) {
  const { tema: temaParam, dificultad } = use(params);
  const pais = decodeURIComponent(temaParam);
  const nivel = dificultad as NivelSopa;
  const router = useRouter();
  const { state, setState, guardarAhora } = useAppState();
  const { playCorrect, playIncorrect, playVictoria, playTiempoAgotado, playTick } = useSound();

  const tema = temaDePais(pais);
  const cfg = tema && nivel in SOPA_NIVELES ? SOPA_NIVELES[nivel] : null;

  const [sopa, setSopa] = useState<SopaGenerada | null>(null);
  const [palabras, setPalabras] = useState<string[]>([]);
  const [encontradas, setEncontradas] = useState<Set<string>>(new Set());
  const [celdasOk, setCeldasOk] = useState<Set<string>>(new Set());
  const [inicio, setInicio] = useState<Celda | null>(null);
  const [celdasError, setCeldasError] = useState<Set<string>>(new Set());
  const [tiempo, setTiempo] = useState(cfg?.segundos ?? 90);
  const [terminado, setTerminado] = useState(false);
  const [gano, setGano] = useState(false);
  const recompensaRef = useRef(false);
  const erroresTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Se genera SOLO en el cliente (Math.random) para que el HTML del servidor
  // y el del cliente coincidan en la primera pintura.
  useEffect(() => {
    if (!tema || !cfg) return;
    const ps = palabrasPorNivel(tema.palabras, nivel);
    setPalabras(ps);
    setSopa(generarSopa(ps, nivel));
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
      const monedas = RECOMPENSA_POR_NIVEL[nivel];
      setState((s) => {
        const nuevo = { ...s, coins: s.coins + monedas, monedasGanadasTotal: s.monedasGanadasTotal + monedas };
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

  function tocarCelda(celda: Celda) {
    if (terminado || !sopa) return;
    if (!inicio) {
      setInicio(celda);
      return;
    }
    if (inicio.fila === celda.fila && inicio.col === celda.col) {
      setInicio(null);
      return;
    }
    const camino = celdasEntre(inicio, celda);
    setInicio(null);
    if (!camino) {
      marcarError([inicio, celda]);
      return;
    }

    const palabraEncontrada = palabras.find((p) => !encontradas.has(p) && coincideSeleccion(camino, sopa.posiciones[p]));
    if (!palabraEncontrada) {
      playIncorrect();
      marcarError(camino);
      return;
    }

    playCorrect();
    const nuevasEncontradas = new Set(encontradas);
    nuevasEncontradas.add(palabraEncontrada);
    setEncontradas(nuevasEncontradas);
    setCeldasOk((prev) => {
      const next = new Set(prev);
      camino.forEach((c) => next.add(clave(c)));
      return next;
    });
    if (nuevasEncontradas.size === palabras.length) finalizar(true);
  }

  function reiniciar() {
    if (!tema) return;
    recompensaRef.current = false;
    setTerminado(false);
    setGano(false);
    setEncontradas(new Set());
    setCeldasOk(new Set());
    setCeldasError(new Set());
    setInicio(null);
    setTiempo(cfg?.segundos ?? 90);
    const ps = palabrasPorNivel(tema.palabras, nivel);
    setPalabras(ps);
    setSopa(generarSopa(ps, nivel));
  }

  if (!tema || !cfg) notFound();

  if (!sopa) {
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
          Encontraste {encontradas.size} de {palabras.length} palabras
        </p>
        {gano && (
          <>
            <span className="rounded-full bg-surface-secondary px-4 py-2 text-sm font-semibold text-txt-primary">
              +<CountUp value={RECOMPENSA_POR_NIVEL[nivel]} /> monedas
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
          <button
            type="button"
            onClick={reiniciar}
            className="flex h-14 items-center justify-center gap-2 rounded-lg border border-border-strong font-display text-base font-bold text-txt-primary"
          >
            <RotateCcw className="h-4 w-4" strokeWidth={2.2} />
            Intentar de nuevo
          </button>
          <button
            type="button"
            onClick={() => router.push(`/app/retos/sopa-letras/${encodeURIComponent(pais)}`)}
            className="flex h-14 items-center justify-center rounded-lg bg-brand-primary font-display text-base font-bold text-white transition-transform duration-200 ease-out hover:-translate-y-0.5"
          >
            Volver a {pais}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col px-4 pt-4">
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => router.push(`/app/retos/sopa-letras/${encodeURIComponent(pais)}`)}
          aria-label="Volver"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-txt-secondary"
        >
          <ChevronLeft className="h-5 w-5" strokeWidth={2.4} />
        </button>
        <p className="flex-1 text-center text-xs font-semibold uppercase tracking-wide text-txt-tertiary">
          {pais} · {nivel} · {encontradas.size}/{palabras.length}
        </p>
        <SaldoMonedas monedas={state.coins} />
      </div>

      <p className="mt-2 text-center font-display text-2xl font-extrabold tabular text-txt-primary">{tiempo}s</p>

      <div className="mt-3 flex justify-center">
        <div
          className="grid gap-0.5"
          style={{ gridTemplateColumns: `repeat(${sopa.tamano}, minmax(0, 1fr))`, width: "100%", maxWidth: 360 }}
        >
          {sopa.grid.map((fila, f) =>
            fila.map((letra, c) => {
              const k = clave({ fila: f, col: c });
              const seleccionada = inicio !== null && inicio.fila === f && inicio.col === c;
              const ok = celdasOk.has(k);
              const error = celdasError.has(k);
              return (
                <button
                  key={k}
                  type="button"
                  onClick={() => tocarCelda({ fila: f, col: c })}
                  className={`flex aspect-square items-center justify-center rounded-sm font-display text-xs font-bold uppercase transition-colors duration-150 ${
                    ok
                      ? "bg-status-success-soft text-status-success"
                      : error
                        ? "bg-status-error-soft text-status-error"
                        : seleccionada
                          ? "bg-brand-primary text-white"
                          : "bg-surface-secondary text-txt-primary"
                  }`}
                >
                  {letra}
                </button>
              );
            })
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap justify-center gap-2 pb-4">
        {palabras.map((p) => (
          <span
            key={p}
            className={`rounded-full border px-3 py-1 text-xs font-semibold ${
              encontradas.has(p)
                ? "border-status-success bg-status-success-soft text-status-success line-through"
                : "border-border-default bg-surface-primary text-txt-primary"
            }`}
          >
            {p}
          </span>
        ))}
      </div>
    </div>
  );
}
