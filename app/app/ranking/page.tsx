"use client";

import { useState } from "react";
import Image from "next/image";
import { Crown } from "lucide-react";
import { useAppState } from "@/lib/app-state-context";
import { pctPais, progresoDePais } from "@/lib/app-state";

const JUGADORES = [
  { nombre: "Marta R.", paisesCompletados: 4, pct: 68 },
  { nombre: "Julián C.", paisesCompletados: 3, pct: 54 },
  { nombre: "Sofía T.", paisesCompletados: 2, pct: 39 },
  { nombre: "Andrés P.", paisesCompletados: 2, pct: 31 },
  { nombre: "Camila G.", paisesCompletados: 1, pct: 22 },
];

const PERIODOS = ["Semanal", "Mensual", "General"] as const;

const PODIO: Record<1 | 2 | 3, { color: string; avatar: string; barra: string }> = {
  1: { color: "bg-gold", avatar: "h-16 w-16 text-lg", barra: "h-24 w-24" },
  2: { color: "bg-silver", avatar: "h-12 w-12 text-sm", barra: "h-16 w-20" },
  3: { color: "bg-bronze", avatar: "h-12 w-12 text-sm", barra: "h-12 w-20" },
};

export default function RankingPage() {
  const { state, ready } = useAppState();
  const [periodo, setPeriodo] = useState<(typeof PERIODOS)[number]>("Semanal");

  if (!ready) {
    return (
      <div className="flex flex-col gap-3 px-4 pt-4">
        <div className="h-8 w-32 animate-pulse rounded-lg bg-surface-secondary" />
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-14 animate-pulse rounded-xl bg-surface-secondary" />
        ))}
      </div>
    );
  }

  const progresoColombia = progresoDePais(state, "Colombia");
  const miPct = pctPais(progresoColombia);
  const jugadores = [...JUGADORES, { nombre: "Tú", paisesCompletados: miPct === 100 ? 1 : 0, pct: miPct }].sort(
    (a, b) => b.pct - a.pct
  );
  const podio = jugadores.slice(0, 3);
  const resto = jugadores.slice(3);

  return (
    <div className="flex flex-col gap-4 px-4 pt-4">
      <div className="flex flex-col items-center gap-2 text-center">
        <Image src="/logo/conquesta-logo-full.png" alt="Conquesta" width={140} height={154} className="h-16 w-auto" priority />
        <div>
          <h1 className="font-display text-xl font-bold text-txt-primary">Ranking</h1>
          <p className="text-sm text-txt-secondary">Por avance en el mapa mundial</p>
        </div>
      </div>

      <div className="flex gap-2">
        {PERIODOS.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setPeriodo(p)}
            className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-colors duration-200 ease-out ${
              periodo === p ? "bg-brand-primary text-white" : "bg-surface-secondary text-txt-secondary"
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Podio del top 3 — 2do a la izquierda, 1ro al centro (más alto, con corona), 3ro a la derecha. */}
      {podio.length === 3 && (
        <div className="flex items-end justify-center gap-2 rounded-2xl border border-border-default bg-surface-primary px-3 pb-3 pt-5">
          {([podio[1], podio[0], podio[2]] as const).map((j, idx) => {
            const posicion = (idx === 1 ? 1 : idx === 0 ? 2 : 3) as 1 | 2 | 3;
            const cfg = PODIO[posicion];
            const esUsuario = j.nombre === "Tú";
            return (
              <div key={j.nombre} className="flex flex-col items-center gap-1.5">
                {posicion === 1 && <Crown className="h-5 w-5 text-gold" strokeWidth={2.2} fill="currentColor" />}
                <span
                  className={`flex shrink-0 items-center justify-center rounded-full font-display font-bold text-white ${cfg.color} ${cfg.avatar} ${
                    esUsuario ? "ring-2 ring-brand-primary ring-offset-2 ring-offset-surface-primary" : ""
                  }`}
                >
                  {j.nombre.charAt(0)}
                </span>
                <p className="max-w-16 truncate text-xs font-semibold text-txt-primary">{j.nombre}</p>
                <p className="text-xs font-bold tabular text-txt-tertiary">{j.pct}%</p>
                <div className={`flex flex-col items-center justify-start rounded-t-lg pt-1.5 ${cfg.color} ${cfg.barra}`}>
                  <span className="font-display text-xl font-extrabold text-white">{posicion}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="rounded-2xl border border-border-default bg-surface-primary p-2">
        {resto.map((j, i) => {
          const esUsuario = j.nombre === "Tú";
          return (
            <div
              key={j.nombre + i}
              className={`flex items-center gap-3 rounded-xl px-3 py-3 ${esUsuario ? "bg-brand-primary-soft" : ""}`}
            >
              <span className="w-5 text-sm font-bold tabular text-txt-tertiary">{i + 4}</span>
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-full font-display text-xs font-bold text-white ${
                  esUsuario ? "bg-brand-primary" : "bg-status-locked"
                }`}
              >
                {j.nombre.charAt(0)}
              </span>
              <div className="flex-1">
                <p className={`text-sm ${esUsuario ? "font-bold text-txt-primary" : "font-medium text-txt-primary"}`}>
                  {j.nombre}
                </p>
                <p className="text-xs text-txt-tertiary">{j.paisesCompletados} países completados</p>
              </div>
              <span className="text-sm font-semibold tabular text-txt-secondary">{j.pct}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
