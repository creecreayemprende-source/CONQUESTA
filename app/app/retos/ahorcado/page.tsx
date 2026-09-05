"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, RotateCcw, Lightbulb } from "lucide-react";
import { normalizarLetra, palabraAleatoria, type PalabraAhorcado } from "@/lib/ahorcado-data";
import { useAppState } from "@/lib/app-state-context";
import { useSound } from "@/lib/use-sound";
import { Confetti } from "@/components/app/Confetti";

const ERRORES_MAX = 6;
const RECOMPENSA_MONEDAS = 15;
const TECLADO = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

/** Dibujo clásico del ahorcado — cada error revela una parte más. */
function DibujoAhorcado({ errores }: { errores: number }) {
  return (
    <svg viewBox="0 0 120 120" className="h-24 w-24" aria-hidden="true">
      {/* Base y poste — siempre visibles */}
      <line x1="10" y1="110" x2="70" y2="110" stroke="var(--text-tertiary)" strokeWidth="4" strokeLinecap="round" />
      <line x1="30" y1="110" x2="30" y2="10" stroke="var(--text-tertiary)" strokeWidth="4" strokeLinecap="round" />
      <line x1="30" y1="10" x2="80" y2="10" stroke="var(--text-tertiary)" strokeWidth="4" strokeLinecap="round" />
      <line x1="80" y1="10" x2="80" y2="24" stroke="var(--text-tertiary)" strokeWidth="4" strokeLinecap="round" />
      {errores >= 1 && <circle cx="80" cy="34" r="10" stroke="var(--status-error)" strokeWidth="4" fill="none" />}
      {errores >= 2 && (
        <line x1="80" y1="44" x2="80" y2="75" stroke="var(--status-error)" strokeWidth="4" strokeLinecap="round" />
      )}
      {errores >= 3 && (
        <line x1="80" y1="52" x2="65" y2="65" stroke="var(--status-error)" strokeWidth="4" strokeLinecap="round" />
      )}
      {errores >= 4 && (
        <line x1="80" y1="52" x2="95" y2="65" stroke="var(--status-error)" strokeWidth="4" strokeLinecap="round" />
      )}
      {errores >= 5 && (
        <line x1="80" y1="75" x2="68" y2="95" stroke="var(--status-error)" strokeWidth="4" strokeLinecap="round" />
      )}
      {errores >= 6 && (
        <line x1="80" y1="75" x2="92" y2="95" stroke="var(--status-error)" strokeWidth="4" strokeLinecap="round" />
      )}
    </svg>
  );
}

export default function AhorcadoPage() {
  const router = useRouter();
  const { setState } = useAppState();
  const { playCorrect, playIncorrect, playVictoria } = useSound();

  const [palabra, setPalabra] = useState<PalabraAhorcado | null>(null);
  const [letras, setLetras] = useState<string[]>([]);
  const [recompensaAplicada, setRecompensaAplicada] = useState(false);

  // Igual que el resto del juego: Math.random() solo corre en el cliente,
  // nunca en el inicializador de useState (evita error de hidratación).
  useEffect(() => {
    setPalabra(palabraAleatoria());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const letrasRespuesta = useMemo(() => {
    if (!palabra) return [];
    return Array.from(new Set(normalizarLetra(palabra.respuesta).replace(/[^A-Z]/g, "")));
  }, [palabra]);

  const errores = letras.filter((l) => !letrasRespuesta.includes(l)).length;
  const ganado = palabra !== null && letrasRespuesta.every((l) => letras.includes(l));
  const perdido = errores >= ERRORES_MAX;
  const terminado = ganado || perdido;

  useEffect(() => {
    if (ganado && !recompensaAplicada) {
      setRecompensaAplicada(true);
      playVictoria();
      setState((s) => ({
        ...s,
        coins: s.coins + RECOMPENSA_MONEDAS,
        monedasGanadasTotal: s.monedasGanadasTotal + RECOMPENSA_MONEDAS,
      }));
    }
  }, [ganado, recompensaAplicada, playVictoria, setState]);

  function elegirLetra(letra: string) {
    if (terminado || letras.includes(letra)) return;
    setLetras((prev) => [...prev, letra]);
    if (letrasRespuesta.includes(letra)) playCorrect();
    else playIncorrect();
  }

  function reiniciar() {
    setLetras([]);
    setRecompensaAplicada(false);
    setPalabra(palabraAleatoria());
  }

  if (!palabra) {
    return (
      <div className="flex min-h-dvh flex-col gap-3 px-4 pt-4">
        <div className="h-8 w-40 animate-pulse rounded-lg bg-surface-secondary" />
        <div className="mt-10 h-24 w-24 animate-pulse rounded-full bg-surface-secondary" />
        <div className="h-10 w-full animate-pulse rounded-lg bg-surface-secondary" />
      </div>
    );
  }

  if (terminado) {
    return (
      <div className="relative flex min-h-dvh flex-col items-center justify-center gap-6 overflow-hidden px-6 text-center">
        {ganado && <Confetti />}
        {
          // eslint-disable-next-line @next/next/no-img-element -- GIF animado: next/image le quita la animación.
          <img
            src={ganado ? "/gifs/congrats.gif" : "/gifs/casi-lo-logras.gif"}
            alt=""
            aria-hidden="true"
            className="h-28 w-28 object-contain"
          />
        }
        <h1 className="font-display text-2xl font-bold text-txt-primary">
          {ganado ? "¡La adivinaste!" : "Casi lo logras"}
        </h1>
        <p className="font-display text-xl font-extrabold tracking-wide text-txt-primary">{palabra.respuesta}</p>
        <p className="max-w-xs text-sm text-txt-secondary">{palabra.pista}</p>
        {ganado && (
          <span className="rounded-full bg-gold-soft px-4 py-2 text-sm font-bold text-txt-primary">
            +{RECOMPENSA_MONEDAS} monedas
          </span>
        )}

        <div className="flex w-full max-w-xs flex-col gap-3">
          <button
            type="button"
            onClick={reiniciar}
            className="flex h-14 items-center justify-center gap-2 rounded-lg bg-brand-primary font-display text-base font-bold text-white transition-transform duration-200 ease-out hover:-translate-y-0.5"
          >
            <RotateCcw className="h-4 w-4" strokeWidth={2.2} />
            Jugar otra ciudad
          </button>
          <button
            type="button"
            onClick={() => router.push("/app/retos")}
            className="text-sm font-semibold text-txt-secondary"
          >
            Volver a Retos
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
          onClick={() => router.push("/app/retos")}
          aria-label="Volver"
          className="flex h-11 w-11 items-center justify-center rounded-full text-txt-secondary"
        >
          <ChevronLeft className="h-5 w-5" strokeWidth={2.4} />
        </button>
        <p className="text-xs font-semibold uppercase tracking-wide text-txt-tertiary">Ahorcado de Capitales</p>
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-surface-secondary text-sm font-bold tabular text-txt-primary">
          {ERRORES_MAX - errores}
        </span>
      </div>

      <div className="mt-6 flex flex-col items-center gap-4">
        <DibujoAhorcado errores={errores} />

        <div className="flex items-start gap-2 rounded-xl bg-brand-primary-soft px-4 py-3 text-left">
          <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary" strokeWidth={2.2} />
          <p className="text-sm text-txt-primary">{palabra.pista}</p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 px-2">
          {normalizarLetra(palabra.respuesta)
            .split("")
            .map((ch, i) =>
              ch === " " ? (
                <span key={i} className="w-3" />
              ) : (
                <span
                  key={i}
                  className="flex h-10 w-8 items-center justify-center border-b-2 border-txt-tertiary font-display text-lg font-bold text-txt-primary"
                >
                  {letras.includes(ch) ? palabra.respuesta[i] : ""}
                </span>
              )
            )}
        </div>
      </div>

      <div className="mt-auto grid grid-cols-7 gap-1.5 pb-6 pt-6">
        {TECLADO.map((letra) => {
          const usada = letras.includes(letra);
          const acierto = usada && letrasRespuesta.includes(letra);
          return (
            <button
              key={letra}
              type="button"
              onClick={() => elegirLetra(letra)}
              disabled={usada || terminado}
              className={`flex h-10 items-center justify-center rounded-lg text-sm font-bold transition-colors duration-150 ease-out ${
                !usada
                  ? "bg-surface-secondary text-txt-primary active:scale-95"
                  : acierto
                    ? "bg-status-success text-white"
                    : "bg-status-error/30 text-txt-tertiary"
              }`}
            >
              {letra}
            </button>
          );
        })}
      </div>
    </div>
  );
}
