"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Crown, Trophy, Coins } from "lucide-react";
import { supabaseBrowser } from "@/lib/supabase/client";

interface FilaRanking {
  nombre: string;
  avatar_url: string | null;
  monedas_ganadas_total: number;
  paises_conquistados: number;
  es_actual: boolean;
}

const PERIODOS = [
  { label: "Semanal", dias: 7 },
  { label: "Mensual", dias: 30 },
  { label: "General", dias: null },
] as const;

const PODIO: Record<1 | 2 | 3, { color: string; avatar: string; barra: string }> = {
  1: { color: "bg-gold", avatar: "h-16 w-16 text-lg", barra: "h-24 w-24" },
  2: { color: "bg-silver", avatar: "h-12 w-12 text-sm", barra: "h-16 w-20" },
  3: { color: "bg-bronze", avatar: "h-12 w-12 text-sm", barra: "h-12 w-20" },
};

export default function RankingPage() {
  const [periodo, setPeriodo] = useState<(typeof PERIODOS)[number]>(PERIODOS[0]);
  const [filas, setFilas] = useState<FilaRanking[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelado = false;
    setFilas(null);
    setError(false);
    (async () => {
      try {
        const { data, error } = await supabaseBrowser().rpc("ranking_paises_conquistados", { p_dias: periodo.dias });
        if (cancelado) return;
        if (error) {
          setError(true);
          return;
        }
        setFilas((data as FilaRanking[]) ?? []);
      } catch {
        if (!cancelado) setError(true);
      }
    })();
    return () => {
      cancelado = true;
    };
  }, [periodo]);

  return (
    <div className="flex flex-col gap-4 px-4 pt-4">
      <div className="flex flex-col items-center gap-2 text-center">
        <Image src="/logo/conquesta-logo-full.png" alt="Conquesta" width={140} height={154} className="h-16 w-auto" priority />
        <div>
          <h1 className="font-display text-xl font-bold text-txt-primary">Ranking</h1>
          <p className="text-sm text-txt-secondary">Países conquistados por jugador real</p>
        </div>
      </div>

      <div className="flex gap-2">
        {PERIODOS.map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => setPeriodo(p)}
            className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-colors duration-200 ease-out ${
              periodo.label === p.label ? "bg-brand-primary text-white" : "bg-surface-secondary text-txt-secondary"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {error && (
        <div className="rounded-2xl border border-border-default bg-surface-primary p-6 text-center">
          <p className="text-sm text-txt-secondary">No pudimos cargar el ranking. Desliza para reintentar.</p>
        </div>
      )}

      {!error && filas === null && (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-14 animate-pulse rounded-xl bg-surface-secondary" />
          ))}
        </div>
      )}

      {!error && filas !== null && filas.length === 0 && (
        <div className="rounded-2xl border border-border-default bg-surface-primary p-6 text-center">
          <Trophy className="mx-auto mb-2 h-8 w-8 text-txt-tertiary" strokeWidth={1.8} />
          <p className="text-sm font-semibold text-txt-primary">Todavía no hay conquistas registradas</p>
          <p className="mt-1 text-xs text-txt-secondary">Conquista tu primer país y aparecerás aquí.</p>
        </div>
      )}

      {!error && filas !== null && filas.length > 0 && (
        <>
          {filas.length >= 3 && (
            <div className="flex items-end justify-center gap-2 rounded-2xl border border-border-default bg-surface-primary px-3 pb-3 pt-5">
              {([filas[1], filas[0], filas[2]] as const).map((j, idx) => {
                const posicion = (idx === 1 ? 1 : idx === 0 ? 2 : 3) as 1 | 2 | 3;
                const cfg = PODIO[posicion];
                return (
                  <div key={j.nombre + posicion} className="flex flex-col items-center gap-1.5">
                    {posicion === 1 && <Crown className="h-5 w-5 text-gold" strokeWidth={2.2} fill="currentColor" />}
                    <span
                      className={`flex shrink-0 items-center justify-center overflow-hidden rounded-full font-display font-bold text-white ${cfg.color} ${cfg.avatar} ${
                        j.es_actual ? "ring-2 ring-brand-primary ring-offset-2 ring-offset-surface-primary" : ""
                      }`}
                    >
                      {j.avatar_url ? (
                        // eslint-disable-next-line @next/next/no-img-element -- foto subida por el jugador, no un asset local optimizable.
                        <img src={j.avatar_url} alt="" className="h-full w-full object-cover" />
                      ) : (
                        (j.es_actual ? "Tú" : j.nombre).charAt(0)
                      )}
                    </span>
                    <p className="max-w-16 truncate text-xs font-semibold text-txt-primary">{j.es_actual ? "Tú" : j.nombre}</p>
                    <p className="text-xs font-bold tabular text-txt-tertiary">
                      {j.paises_conquistados} país{j.paises_conquistados === 1 ? "" : "es"}
                    </p>
                    <p className="flex items-center gap-0.5 text-xs font-semibold tabular text-gold">
                      <Coins className="h-3 w-3" strokeWidth={2.4} />
                      {j.monedas_ganadas_total}
                    </p>
                    <div className={`flex flex-col items-center justify-start rounded-t-lg pt-1.5 ${cfg.color} ${cfg.barra}`}>
                      <span className="font-display text-xl font-extrabold text-white">{posicion}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="rounded-2xl border border-border-default bg-surface-primary p-2">
            {(filas.length >= 3 ? filas.slice(3) : filas).map((j, i) => (
              <div
                key={j.nombre + i}
                className={`flex items-center gap-3 rounded-xl px-3 py-3 ${j.es_actual ? "bg-brand-primary-soft" : ""}`}
              >
                <span className="w-5 text-sm font-bold tabular text-txt-tertiary">{(filas.length >= 3 ? 4 : 1) + i}</span>
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full font-display text-xs font-bold text-white ${
                    j.es_actual ? "bg-brand-primary" : "bg-status-locked"
                  }`}
                >
                  {j.avatar_url ? (
                    // eslint-disable-next-line @next/next/no-img-element -- foto subida por el jugador, no un asset local optimizable.
                    <img src={j.avatar_url} alt="" className="h-full w-full object-cover" />
                  ) : (
                    (j.es_actual ? "Tú" : j.nombre).charAt(0)
                  )}
                </span>
                <div className="flex-1">
                  <p className={`text-sm ${j.es_actual ? "font-bold text-txt-primary" : "font-medium text-txt-primary"}`}>
                    {j.es_actual ? "Tú" : j.nombre}
                  </p>
                  <p className="flex items-center gap-1.5 text-xs text-txt-tertiary">
                    <span>
                      {j.paises_conquistados} país{j.paises_conquistados === 1 ? "" : "es"} completados
                    </span>
                    <span className="flex items-center gap-0.5 font-semibold text-gold">
                      <Coins className="h-3 w-3" strokeWidth={2.4} />
                      {j.monedas_ganadas_total}
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
