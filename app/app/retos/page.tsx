"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAppState } from "@/lib/app-state-context";
import { supabaseBrowser } from "@/lib/supabase/client";
import { Send, Swords, Type, Trophy, Hourglass, Check } from "lucide-react";

interface RetoRow {
  id: string;
  retador_id: string;
  retador_nombre: string;
  retado_id: string | null;
  total_preguntas: number;
  puntaje_retador: number;
  puntaje_retado: number | null;
  estado: "esperando_retado" | "completado";
}

const PESTANAS = ["Tu turno", "Esperando respuesta", "Historial"] as const;

export default function RetosPage() {
  const { ready } = useAppState();
  const [miId, setMiId] = useState<string | null>(null);
  const [retos, setRetos] = useState<RetoRow[] | null>(null);
  const [pestana, setPestana] = useState<(typeof PESTANAS)[number]>("Tu turno");

  useEffect(() => {
    let cancelado = false;
    (async () => {
      const supabase = supabaseBrowser();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user || cancelado) return;
      setMiId(user.id);
      const { data } = await supabase
        .from("retos_1v1")
        .select("id, retador_id, retador_nombre, retado_id, total_preguntas, puntaje_retador, puntaje_retado, estado")
        .order("creado_en", { ascending: false });
      if (!cancelado) setRetos((data as RetoRow[]) ?? []);
    })();
    return () => {
      cancelado = true;
    };
  }, []);

  const tuTurno = (retos ?? []).filter((r) => r.retado_id === miId && r.estado === "esperando_retado");
  const esperandoRespuesta = (retos ?? []).filter((r) => r.retador_id === miId && r.estado === "esperando_retado");
  const historial = (retos ?? []).filter((r) => r.estado === "completado");

  const listaActual = pestana === "Tu turno" ? tuTurno : pestana === "Esperando respuesta" ? esperandoRespuesta : historial;

  if (!ready) {
    return (
      <div className="flex flex-col gap-3 px-4 pt-4">
        <div className="h-8 w-32 animate-pulse rounded-lg bg-surface-secondary" />
        <div className="h-24 animate-pulse rounded-xl bg-surface-secondary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col gap-5 px-4 pt-4">
      <div>
        <h1 className="font-display text-xl font-bold text-txt-primary">Retos</h1>
        <p className="text-sm text-txt-secondary">Compara tu nivel con tus amigos</p>
      </div>

      <Link
        href="/app/retos/desafio"
        className="flex flex-col items-center gap-2 rounded-xl bg-brand-primary p-4 text-center shadow-md"
      >
        <span className="flex items-center gap-2 font-display text-base font-bold text-white">
          <Send className="h-4 w-4" strokeWidth={2.2} />
          Reto de Cultura General
        </span>
        <p className="text-xs text-white/85">
          20 preguntas, contra tu propio cronómetro — reta a un amigo por WhatsApp al terminar
        </p>
      </Link>

      <Link
        href="/app/retos/ahorcado"
        className="flex flex-col items-center gap-2 rounded-xl border-2 border-brand-primary bg-surface-primary p-4 text-center shadow-sm"
      >
        <span className="flex items-center gap-2 font-display text-base font-bold text-txt-primary">
          <Type className="h-4 w-4 text-brand-primary" strokeWidth={2.2} />
          Ahorcado de Capitales
        </span>
        <p className="text-xs text-txt-secondary">
          Adivina la ciudad oculta letra por letra, con una pista — ciudades de todo el mundo
        </p>
      </Link>

      <div>
        <div className="flex gap-2">
          {PESTANAS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPestana(p)}
              className={`flex-1 rounded-lg py-2 text-xs font-semibold transition-colors duration-200 ease-out ${
                pestana === p ? "bg-brand-primary text-white" : "bg-surface-secondary text-txt-secondary"
              }`}
            >
              {p}
              {p === "Tu turno" && tuTurno.length > 0 && ` (${tuTurno.length})`}
            </button>
          ))}
        </div>

        <div className="mt-3 flex flex-col gap-2">
          {retos === null && <div className="h-16 animate-pulse rounded-xl bg-surface-secondary" />}

          {retos !== null && listaActual.length === 0 && (
            <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-border-strong py-8 text-center">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-primary-soft text-brand-primary">
                <Swords className="h-5 w-5" strokeWidth={2} />
              </span>
              <p className="max-w-56 text-sm text-txt-secondary">
                {pestana === "Tu turno"
                  ? "Nadie te ha retado todavía. Cuando alguien te rete por WhatsApp, aparecerá aquí."
                  : pestana === "Esperando respuesta"
                    ? "Retos que envíes aparecerán aquí mientras tu amigo no haya jugado."
                    : "Todavía no completas ningún reto 1 a 1."}
              </p>
            </div>
          )}

          {listaActual.map((r) => {
            const soyRetador = r.retador_id === miId;
            const miPuntaje = soyRetador ? r.puntaje_retador : r.puntaje_retado;
            const suPuntaje = soyRetador ? r.puntaje_retado : r.puntaje_retador;
            return (
              <Link
                key={r.id}
                href={`/app/retos/1v1/${r.id}`}
                className="flex items-center gap-3 rounded-xl border border-border-default bg-surface-primary px-3 py-3"
              >
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                    r.estado === "completado" ? "bg-gold-soft text-gold" : "bg-brand-primary-soft text-brand-primary"
                  }`}
                >
                  {r.estado === "completado" ? (
                    <Trophy className="h-4 w-4" strokeWidth={2.2} />
                  ) : (
                    <Hourglass className="h-4 w-4" strokeWidth={2.2} />
                  )}
                </span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-txt-primary">
                    {soyRetador ? "Tu reto" : `Reto de ${r.retador_nombre}`}
                  </p>
                  <p className="text-xs text-txt-tertiary">
                    {r.estado === "completado"
                      ? `Tú: ${miPuntaje}/${r.total_preguntas} · Rival: ${suPuntaje}/${r.total_preguntas}`
                      : `${r.total_preguntas} preguntas de Cultura General`}
                  </p>
                </div>
                {pestana === "Tu turno" && <Check className="h-4 w-4 shrink-0 text-brand-primary" strokeWidth={2.2} />}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
