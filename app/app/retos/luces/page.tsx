"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, RotateCcw, Trophy } from "lucide-react";
import { useAppState } from "@/lib/app-state-context";
import { useSound } from "@/lib/use-sound";
import { Confetti } from "@/components/app/Confetti";
import { CountUp } from "@/components/app/CountUp";

const RECOMPENSA_POR_NIVEL = 5;

const COLORES = [
  { id: "rojo", activo: "var(--status-error)", suave: "var(--status-error-soft)" },
  { id: "verde", activo: "var(--status-success)", suave: "var(--status-success-soft)" },
  { id: "azul", activo: "var(--brand-primary)", suave: "var(--brand-primary-soft)" },
  { id: "amarillo", activo: "var(--gold)", suave: "var(--gold-soft)" },
] as const;

type Fase = "mostrando" | "esperando" | "perdido";

function siguienteVelocidad(nivel: number): number {
  // Baja de 700ms a un piso de 350ms — más rápido a medida que sube el nivel,
  // sin llegar a ser imposible de seguir.
  return Math.max(350, 700 - nivel * 15);
}

export default function JuegoDeLucesPage() {
  const router = useRouter();
  const { state, setState, guardarAhora } = useAppState();
  const { playCorrect, playIncorrect, playVictoria } = useSound();

  const [secuencia, setSecuencia] = useState<number[]>([]);
  const [nivel, setNivel] = useState(1);
  const [fase, setFase] = useState<Fase>("mostrando");
  const [indiceMostrado, setIndiceMostrado] = useState(-1);
  const [indiceEsperado, setIndiceEsperado] = useState(0);
  const [activo, setActivo] = useState<number | null>(null);
  const [terminado, setTerminado] = useState(false);
  const [nuevoRecord, setNuevoRecord] = useState(false);
  const recompensaAplicadaRef = useRef(false);

  // Arranca la primera secuencia solo en el cliente (Math.random()).
  useEffect(() => {
    setSecuencia([Math.floor(Math.random() * 4)]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reproduce la secuencia completa cada vez que crece o al reiniciar.
  useEffect(() => {
    if (fase !== "mostrando" || secuencia.length === 0) return;
    let cancelado = false;
    setIndiceEsperado(0);
    (async () => {
      await new Promise((r) => setTimeout(r, 500));
      for (let i = 0; i < secuencia.length; i++) {
        if (cancelado) return;
        setIndiceMostrado(secuencia[i]);
        await new Promise((r) => setTimeout(r, siguienteVelocidad(nivel) * 0.7));
        if (cancelado) return;
        setIndiceMostrado(-1);
        await new Promise((r) => setTimeout(r, siguienteVelocidad(nivel) * 0.3));
      }
      if (!cancelado) setFase("esperando");
    })();
    return () => {
      cancelado = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secuencia, fase]);

  function terminarJuego() {
    if (recompensaAplicadaRef.current) return;
    recompensaAplicadaRef.current = true;
    setTerminado(true);
    setFase("perdido");
    const nivelesSuperados = nivel - 1;
    const monedasGanadas = nivelesSuperados * RECOMPENSA_POR_NIVEL;
    setState((s) => {
      const esRecord = nivelesSuperados > s.mejorNivelLuces;
      const nuevo = {
        ...s,
        coins: s.coins + monedasGanadas,
        monedasGanadasTotal: s.monedasGanadasTotal + monedasGanadas,
        mejorNivelLuces: esRecord ? nivelesSuperados : s.mejorNivelLuces,
      };
      if (esRecord) void guardarAhora(nuevo);
      return nuevo;
    });
    setNuevoRecord(nivelesSuperados > state.mejorNivelLuces && nivelesSuperados > 0);
    if (nivelesSuperados > 0) playVictoria();
    else playIncorrect();
  }

  function tocarColor(i: number) {
    if (fase !== "esperando") return;
    setActivo(i);
    setTimeout(() => setActivo(null), 200);

    if (i !== secuencia[indiceEsperado]) {
      playIncorrect();
      terminarJuego();
      return;
    }

    playCorrect();
    if (indiceEsperado === secuencia.length - 1) {
      // Nivel superado — agrega un paso y reproduce de nuevo.
      setNivel((n) => n + 1);
      setSecuencia((s) => [...s, Math.floor(Math.random() * 4)]);
      setFase("mostrando");
    } else {
      setIndiceEsperado((idx) => idx + 1);
    }
  }

  function reiniciar() {
    recompensaAplicadaRef.current = false;
    setTerminado(false);
    setNuevoRecord(false);
    setNivel(1);
    setIndiceEsperado(0);
    setActivo(null);
    setSecuencia([Math.floor(Math.random() * 4)]);
    setFase("mostrando");
  }

  if (secuencia.length === 0) {
    return (
      <div className="flex min-h-dvh flex-col gap-3 px-4 pt-4">
        <div className="h-8 w-40 animate-pulse rounded-lg bg-surface-secondary" />
        <div className="mt-10 h-64 animate-pulse rounded-2xl bg-surface-secondary" />
      </div>
    );
  }

  if (terminado) {
    const nivelesSuperados = nivel - 1;
    return (
      <div className="relative flex min-h-dvh flex-col items-center justify-center gap-5 overflow-hidden px-6 text-center">
        {nuevoRecord && <Confetti />}
        <Trophy className={`h-14 w-14 ${nivelesSuperados > 0 ? "text-gold" : "text-txt-tertiary"}`} strokeWidth={1.8} />
        <h1 className="font-display text-2xl font-bold text-txt-primary">
          {nivelesSuperados > 0 ? `Llegaste al nivel ${nivel}` : "Esta vez no"}
        </h1>
        <p className="text-sm text-txt-secondary">
          {nuevoRecord ? "¡Nuevo récord personal!" : `Tu mejor récord sigue siendo el nivel ${state.mejorNivelLuces}`}
        </p>
        {nivelesSuperados > 0 && (
          <span className="rounded-full bg-surface-secondary px-4 py-2 text-sm font-semibold text-txt-primary">
            +<CountUp value={nivelesSuperados * RECOMPENSA_POR_NIVEL} /> monedas
          </span>
        )}
        <div className="flex w-full max-w-xs flex-col gap-3">
          <button
            type="button"
            onClick={reiniciar}
            className="flex h-14 items-center justify-center gap-2 rounded-lg bg-brand-primary font-display text-base font-bold text-white transition-transform duration-200 ease-out hover:-translate-y-0.5"
          >
            <RotateCcw className="h-4 w-4" strokeWidth={2.2} />
            Intentar de nuevo
          </button>
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
        <p className="text-xs font-semibold uppercase tracking-wide text-txt-tertiary">Juego de Luces</p>
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-primary-soft font-display text-sm font-bold text-brand-primary">
          {nivel}
        </span>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-8">
        <p className="text-sm font-semibold text-txt-secondary">
          {fase === "mostrando" ? "Memoriza la secuencia…" : "¡Tu turno! Repítela en el mismo orden"}
        </p>

        <div className="grid grid-cols-2 gap-4">
          {COLORES.map((c, i) => {
            const iluminado = indiceMostrado === i;
            const presionado = activo === i;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => tocarColor(i)}
                disabled={fase !== "esperando"}
                aria-label={`Color ${c.id}`}
                className="h-28 w-28 rounded-2xl transition-transform duration-150 ease-out active:scale-95"
                style={{
                  backgroundColor: iluminado || presionado ? c.activo : c.suave,
                  boxShadow: iluminado ? `0 0 0 4px ${c.activo}` : "none",
                }}
              />
            );
          })}
        </div>

        <p className="text-xs text-txt-tertiary">Tu mejor nivel: {state.mejorNivelLuces}</p>
      </div>
    </div>
  );
}
