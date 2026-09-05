"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Check, X as XIcon, Swords, Trophy, Clock3 } from "lucide-react";
import { supabaseBrowser } from "@/lib/supabase/client";
import { preguntasPorIndices } from "@/lib/trivia-cultura-general";
import { useSound } from "@/lib/use-sound";
import { Confetti } from "@/components/app/Confetti";
import type { PreguntaTrivia } from "@/lib/onboarding-data";

function formatearTiempo(segundos: number): string {
  const m = Math.floor(segundos / 60);
  const s = segundos % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

interface RetoRow {
  id: string;
  retador_id: string;
  retador_nombre: string;
  retado_id: string | null;
  total_preguntas: number;
  puntaje_retador: number;
  puntaje_retado: number | null;
  estado: "esperando_retado" | "completado";
  creado_en: string;
  tiempo_retador_segundos: number | null;
  tiempo_retado_segundos: number | null;
}

type Vista =
  | "cargando"
  | "no_existe"
  | "es_tu_propio_reto"
  | "ya_reclamado"
  | "invitacion"
  | "jugando"
  | "resultado";

export default function Reto1v1Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { playCorrect, playIncorrect, playVictoria } = useSound();

  const [vista, setVista] = useState<Vista>("cargando");
  const [reto, setReto] = useState<RetoRow | null>(null);

  const [preguntas, setPreguntas] = useState<PreguntaTrivia[] | null>(null);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [aciertos, setAciertos] = useState(0);
  const [puntajeFinalRetado, setPuntajeFinalRetado] = useState<number | null>(null);
  const [segundosTranscurridos, setSegundosTranscurridos] = useState(0);
  const [tiempoFinalRetado, setTiempoFinalRetado] = useState<number | null>(null);

  // Cronómetro que sube mientras se juega — mismo patrón que la pantalla del
  // retador (`desafio/page.tsx`): antes esta pantalla no tenía ningún reloj,
  // así que quien aceptaba un reto no podía ver cuánto tiempo llevaba.
  useEffect(() => {
    if (vista !== "jugando") return;
    const interval = setInterval(() => setSegundosTranscurridos((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, [vista]);

  useEffect(() => {
    let cancelado = false;
    (async () => {
      const supabase = supabaseBrowser();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user || cancelado) return;

      const { data, error } = await supabase.rpc("ver_reto_1v1", { p_id: id });
      if (cancelado) return;
      if (error || !data) {
        setVista("no_existe");
        return;
      }
      const r = data as RetoRow;
      setReto(r);

      if (r.retador_id === user.id) {
        setVista("es_tu_propio_reto");
      } else if (r.retado_id && r.retado_id !== user.id) {
        setVista("ya_reclamado");
      } else if (r.estado === "completado") {
        setVista("resultado");
        setPuntajeFinalRetado(r.puntaje_retado);
        setTiempoFinalRetado(r.tiempo_retado_segundos);
      } else if (r.retado_id === user.id) {
        // ya lo había aceptado antes pero no lo terminó — retomar el juego.
        cargarPreguntas(supabase, id);
      } else {
        setVista("invitacion");
      }
    })();
    return () => {
      cancelado = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function cargarPreguntas(supabase: ReturnType<typeof supabaseBrowser>, retoId: string) {
    const { data: indices } = await supabase.rpc("obtener_preguntas_reto_1v1", { p_id: retoId });
    if (!indices) return;
    setPreguntas(preguntasPorIndices(indices as number[]));
    setVista("jugando");
  }

  async function aceptar() {
    const supabase = supabaseBrowser();
    const { data } = await supabase.rpc("aceptar_reto_1v1", { p_id: id });
    const status = (data as { status?: string } | null)?.status;
    if (status !== "aceptado") {
      setVista("ya_reclamado");
      return;
    }
    await cargarPreguntas(supabase, id);
  }

  function responder(i: number) {
    if (!preguntas || selected !== null) return;
    setSelected(i);
    const correcta = i === preguntas[index].correctaIndex;
    if (correcta) playCorrect();
    else playIncorrect();

    setTimeout(async () => {
      setSelected(null);
      const nuevosAciertos = aciertos + (correcta ? 1 : 0);
      if (index < preguntas.length - 1) {
        setAciertos(nuevosAciertos);
        setIndex((idx) => idx + 1);
      } else {
        setAciertos(nuevosAciertos);
        setPuntajeFinalRetado(nuevosAciertos);
        setTiempoFinalRetado(segundosTranscurridos);
        const supabase = supabaseBrowser();
        await supabase.rpc("completar_reto_1v1", {
          p_id: id,
          p_puntaje: nuevosAciertos,
          p_tiempo_segundos: segundosTranscurridos,
        });
        if (nuevosAciertos / preguntas.length >= 0.7) playVictoria();
        setVista("resultado");
      }
    }, 600);
  }

  if (vista === "cargando") {
    return (
      <div className="flex min-h-dvh flex-col gap-3 px-4 pt-4">
        <div className="h-8 w-40 animate-pulse rounded-lg bg-surface-secondary" />
        <div className="mt-10 h-24 animate-pulse rounded-2xl bg-surface-secondary" />
      </div>
    );
  }

  if (vista === "no_existe") {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-3 px-6 text-center">
        <p className="text-sm text-txt-secondary">Este reto ya no existe o el link está roto.</p>
        <button type="button" onClick={() => router.push("/app/retos")} className="text-sm font-semibold text-brand-primary">
          Volver a Retos
        </button>
      </div>
    );
  }

  if (vista === "es_tu_propio_reto") {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-4 px-6 text-center">
        <Swords className="h-10 w-10 text-brand-primary" strokeWidth={1.8} />
        <h1 className="font-display text-xl font-bold text-txt-primary">Este es tu propio reto</h1>
        <p className="text-sm text-txt-secondary">
          {reto?.estado === "completado"
            ? `Tu amigo ya jugó — sacó ${reto.puntaje_retado}/${reto.total_preguntas}${
                reto.tiempo_retado_segundos != null ? ` en ${formatearTiempo(reto.tiempo_retado_segundos)}` : ""
              }, tú sacaste ${reto.puntaje_retador}/${reto.total_preguntas}${
                reto.tiempo_retador_segundos != null ? ` en ${formatearTiempo(reto.tiempo_retador_segundos)}` : ""
              }.`
            : "Todavía esperando a que tu amigo abra el link y juegue."}
        </p>
        <button
          type="button"
          onClick={() => router.push("/app/retos")}
          className="mt-2 flex h-12 items-center justify-center rounded-lg bg-brand-primary px-6 font-display text-sm font-bold text-white"
        >
          Volver a Retos
        </button>
      </div>
    );
  }

  if (vista === "ya_reclamado") {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-3 px-6 text-center">
        <p className="text-sm text-txt-secondary">Este reto ya fue aceptado por otra persona.</p>
        <button type="button" onClick={() => router.push("/app/retos")} className="text-sm font-semibold text-brand-primary">
          Volver a Retos
        </button>
      </div>
    );
  }

  if (vista === "invitacion" && reto) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-4 px-6 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-primary-soft text-brand-primary">
          <Swords className="h-8 w-8" strokeWidth={2} />
        </span>
        <h1 className="font-display text-xl font-bold text-txt-primary">
          {reto.retador_nombre} te retó a Cultura General
        </h1>
        <p className="text-sm text-txt-secondary">
          Sacó <strong className="text-txt-primary">{reto.puntaje_retador}/{reto.total_preguntas}</strong> — juega
          las mismas {reto.total_preguntas} preguntas y demuestra que sabes más.
        </p>
        <button
          type="button"
          onClick={aceptar}
          className="mt-2 flex h-14 w-full max-w-xs items-center justify-center rounded-lg bg-brand-primary font-display text-base font-bold text-white transition-transform duration-200 ease-out hover:-translate-y-0.5"
        >
          Aceptar y jugar
        </button>
        <button type="button" onClick={() => router.push("/app/retos")} className="text-sm font-semibold text-txt-secondary">
          Ahora no
        </button>
      </div>
    );
  }

  if (vista === "jugando" && preguntas) {
    const pregunta = preguntas[index];
    return (
      <div className="flex min-h-dvh flex-col px-4 pt-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.push("/app/retos")}
            aria-label="Volver"
            className="flex h-11 w-11 items-center justify-center rounded-full text-txt-secondary"
          >
            <ChevronLeft className="h-5 w-5" strokeWidth={2.4} />
          </button>
          <p className="flex-1 text-center text-xs font-semibold uppercase tracking-wide text-txt-tertiary">
            Reto de {reto?.retador_nombre} · {index + 1}/{preguntas.length}
          </p>
          <span className="flex items-center gap-1 rounded-full bg-surface-secondary px-3 py-1.5 text-sm font-bold tabular text-txt-primary">
            <Clock3 className="h-3.5 w-3.5" strokeWidth={2.4} />
            {formatearTiempo(segundosTranscurridos)}
          </span>
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

  if (vista === "resultado" && reto) {
    const miPuntaje = puntajeFinalRetado ?? reto.puntaje_retado ?? 0;
    const gane = miPuntaje > reto.puntaje_retador;
    const empate = miPuntaje === reto.puntaje_retador;
    return (
      <div className="relative flex min-h-dvh flex-col items-center justify-center gap-5 overflow-hidden px-6 text-center">
        {gane && <Confetti />}
        <Trophy className={`h-14 w-14 ${gane ? "text-gold" : "text-txt-tertiary"}`} strokeWidth={1.8} />
        <h1 className="font-display text-2xl font-bold text-txt-primary">
          {gane ? "¡Le ganaste!" : empate ? "Empate" : "Esta vez no"}
        </h1>
        <div className="flex items-center gap-4 text-sm font-semibold text-txt-primary">
          <span className="rounded-full bg-brand-primary-soft px-4 py-2">Tú: {miPuntaje}/{reto.total_preguntas}</span>
          <span className="rounded-full bg-surface-secondary px-4 py-2">
            {reto.retador_nombre}: {reto.puntaje_retador}/{reto.total_preguntas}
          </span>
        </div>
        {(tiempoFinalRetado != null || reto.tiempo_retador_segundos != null) && (
          <div className="flex items-center gap-4 text-xs font-semibold text-txt-tertiary">
            <span className="flex items-center gap-1">
              <Clock3 className="h-3.5 w-3.5" strokeWidth={2.4} />
              Tú: {tiempoFinalRetado != null ? formatearTiempo(tiempoFinalRetado) : "—"}
            </span>
            <span className="flex items-center gap-1">
              <Clock3 className="h-3.5 w-3.5" strokeWidth={2.4} />
              {reto.retador_nombre}: {reto.tiempo_retador_segundos != null ? formatearTiempo(reto.tiempo_retador_segundos) : "—"}
            </span>
          </div>
        )}
        <button
          type="button"
          onClick={() => router.push("/app/retos")}
          className="mt-2 flex h-14 w-full max-w-xs items-center justify-center rounded-lg bg-brand-primary font-display text-base font-bold text-white"
        >
          Volver a Retos
        </button>
      </div>
    );
  }

  return null;
}
