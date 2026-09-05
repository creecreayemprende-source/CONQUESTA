"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X as XIcon, Send, RotateCcw, ChevronLeft, Clock3 } from "lucide-react";
import { SaldoMonedas } from "@/components/app/SaldoMonedas";
import { preguntasCulturaGeneralConIndices } from "@/lib/trivia-cultura-general";
import { useSound } from "@/lib/use-sound";
import { Confetti } from "@/components/app/Confetti";
import type { PreguntaTrivia } from "@/lib/onboarding-data";
import { useAppState } from "@/lib/app-state-context";
import { supabaseBrowser } from "@/lib/supabase/client";

function formatearTiempo(segundos: number): string {
  const m = Math.floor(segundos / 60);
  const s = segundos % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function DesafioCulturaGeneralPage() {
  const router = useRouter();
  const { state } = useAppState();
  const { playCorrect, playIncorrect, playVictoria } = useSound();

  // Igual que el resto del juego: Math.random() para barajar solo corre en el
  // cliente (useEffect), nunca en el initializer de useState, para evitar el
  // error de hidratación servidor/cliente.
  const [preguntas, setPreguntas] = useState<PreguntaTrivia[] | null>(null);
  const [indices, setIndices] = useState<number[]>([]);
  useEffect(() => {
    const { preguntas: p, indices: i } = preguntasCulturaGeneralConIndices();
    setPreguntas(p);
    setIndices(i);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [aciertos, setAciertos] = useState(0);
  const [terminado, setTerminado] = useState(false);
  const [segundosTranscurridos, setSegundosTranscurridos] = useState(0);
  const [retoId, setRetoId] = useState<string | null>(null);
  const respondiendoRef = useRef(false);
  const retoCreadoRef = useRef(false);

  // Cronómetro que sube — mide el tiempo TOTAL empleado en completar el reto
  // (no hay límite de tiempo por pregunta, a diferencia del resto del juego).
  useEffect(() => {
    if (terminado) return;
    const interval = setInterval(() => setSegundosTranscurridos((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, [terminado]);

  function reiniciar() {
    respondiendoRef.current = false;
    retoCreadoRef.current = false;
    setSelected(null);
    setAciertos(0);
    setIndex(0);
    setSegundosTranscurridos(0);
    setTerminado(false);
    setRetoId(null);
    const { preguntas: p, indices: i } = preguntasCulturaGeneralConIndices();
    setPreguntas(p);
    setIndices(i);
  }

  // Al terminar, se guarda un reto 1v1 real (para que el link de WhatsApp
  // lleve a un duelo de verdad, no solo a un mensaje de texto) — una sola vez
  // por partida jugada, con las MISMAS preguntas que respondió el retador.
  useEffect(() => {
    if (!terminado || !preguntas || retoCreadoRef.current) return;
    retoCreadoRef.current = true;
    (async () => {
      const supabase = supabaseBrowser();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return; // sin sesión (no debería pasar bajo /app, pero por si acaso)
      const { data } = await supabase
        .from("retos_1v1")
        .insert({
          retador_id: user.id,
          retador_nombre: state.nombre,
          pregunta_indices: indices,
          total_preguntas: preguntas.length,
          puntaje_retador: aciertos,
          tiempo_retador_segundos: segundosTranscurridos,
        })
        .select("id")
        .single();
      if (data) setRetoId(data.id as string);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [terminado]);

  function responder(i: number) {
    if (!preguntas || respondiendoRef.current || terminado) return;
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
        setIndex((idx) => idx + 1);
      } else {
        setAciertos(nuevosAciertos);
        setTerminado(true);
        if (nuevosAciertos / preguntas.length >= 0.7) playVictoria();
      }
    }, 600);
  }

  if (!preguntas) {
    return (
      <div className="flex min-h-dvh flex-col gap-3 px-4 pt-4">
        <div className="h-8 w-40 animate-pulse rounded-lg bg-surface-secondary" />
        <div className="mt-10 h-8 w-2/3 animate-pulse rounded-lg bg-surface-secondary" />
        <div className="h-40 animate-pulse rounded-lg bg-surface-secondary" />
      </div>
    );
  }

  if (terminado) {
    const tiempoFormateado = formatearTiempo(segundosTranscurridos);
    const buenNivel = aciertos / preguntas.length >= 0.7;
    // La dirección real de la app en este momento (no un dominio fijo escrito
    // a mano) — así el link compartido siempre apunta a donde la app
    // REALMENTE vive hoy, sin depender de que exista un dominio propio todavía.
    const origen = typeof window !== "undefined" ? window.location.origin : "";
    const linkReto = retoId ? `${origen}/app/retos/1v1/${retoId}` : origen;
    const mensaje =
      `🏆 ¡Te desafío en Conquesta! 🌍\n` +
      `Acabo de completar el reto de ${preguntas.length} preguntas de Cultura General:\n` +
      `🎯 Resultado: ${aciertos}/${preguntas.length} correctas\n` +
      `⏱️ Tiempo: ${tiempoFormateado}\n` +
      `¿Crees que puedes superarme? Acepta el reto — juegas las mismas preguntas: ${linkReto}`;
    // api.whatsapp.com directo (no wa.me): en algunos iPhones el salto de
    // redirección de wa.me pierde el parámetro de texto y solo llega el link
    // — hallazgo real reportado por el usuario, api.whatsapp.com lo evita.
    const shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(mensaje)}`;

    return (
      <div className="relative flex min-h-dvh flex-col items-center justify-center gap-6 overflow-hidden px-6 text-center">
        {buenNivel && <Confetti />}
        {
          // eslint-disable-next-line @next/next/no-img-element -- GIF animado: next/image reprocesa el formato y le quita la animación.
          <img
            src={buenNivel ? "/gifs/congrats.gif" : "/gifs/casi-lo-logras.gif"}
            alt=""
            aria-hidden="true"
            className="h-28 w-28 object-contain"
          />
        }
        <h1 className="font-display text-2xl font-bold text-txt-primary">¡Reto completado!</h1>
        <div className="flex gap-3 text-sm font-semibold text-txt-primary">
          <span className="rounded-full bg-surface-secondary px-4 py-2">
            🎯 {aciertos}/{preguntas.length}
          </span>
          <span className="flex items-center gap-1 rounded-full bg-surface-secondary px-4 py-2">
            <Clock3 className="h-3.5 w-3.5" strokeWidth={2.4} />
            {tiempoFormateado}
          </span>
        </div>

        <div className="flex w-full max-w-xs flex-col gap-3">
          <a
            href={retoId ? shareUrl : undefined}
            aria-disabled={!retoId}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex h-14 items-center justify-center gap-2 rounded-lg bg-brand-primary font-display text-base font-bold text-white transition-transform duration-200 ease-out ${
              retoId ? "hover:-translate-y-0.5" : "pointer-events-none opacity-60"
            }`}
          >
            <Send className="h-4 w-4" strokeWidth={2.2} />
            {retoId ? "Retar a un amigo por WhatsApp" : "Preparando tu reto…"}
          </a>
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
            onClick={() => router.push("/app/retos")}
            className="text-sm font-semibold text-txt-secondary"
          >
            Volver a Retos
          </button>
        </div>
      </div>
    );
  }

  const pregunta = preguntas[index];

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
        <p className="text-xs font-semibold uppercase tracking-wide text-txt-tertiary">
          Cultura General · {index + 1}/{preguntas.length}
        </p>
        <span className="flex items-center gap-1 rounded-full bg-surface-secondary px-3 py-1.5 text-sm font-bold tabular text-txt-primary">
          <Clock3 className="h-3.5 w-3.5" strokeWidth={2.4} />
          {formatearTiempo(segundosTranscurridos)}
        </span>
      </div>

      <div className="mt-2 flex justify-end">
        <SaldoMonedas monedas={state.coins} />
      </div>

      <div className="flex flex-1 flex-col gap-6 pb-6 pt-8">
        <p className="text-xs font-semibold text-brand-primary">{pregunta.categoria}</p>
        <h1 className="text-balance font-display text-2xl font-bold leading-tight text-txt-primary">
          {pregunta.pregunta}
        </h1>
        <div className="flex flex-col gap-3">
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
                {showState && isSelected && !isCorrect && <XIcon className="h-5 w-5 text-status-error" strokeWidth={2.6} />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
