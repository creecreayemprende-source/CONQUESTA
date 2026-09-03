"use client";

import { useAppState } from "@/lib/app-state-context";
import { AYUDAS_CONFIG, type AyudaId } from "@/lib/ayudas";
import { Coins, Gem, Sparkles } from "lucide-react";

const AYUDAS = (Object.keys(AYUDAS_CONFIG) as AyudaId[]).map((id) => ({ id, ...AYUDAS_CONFIG[id] }));

export default function TiendaPage() {
  const { state, setState, ready } = useAppState();

  if (!ready) {
    return (
      <div className="flex flex-col gap-3 px-4 pt-4">
        <div className="h-8 w-32 animate-pulse rounded-lg bg-surface-secondary" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-20 animate-pulse rounded-xl bg-surface-secondary" />
        ))}
      </div>
    );
  }

  function comprar(id: AyudaId, costo: number, moneda: "coins" | "gems") {
    setState((s) => {
      const saldo = moneda === "coins" ? s.coins : s.gems;
      if (saldo < costo) return s;
      return {
        ...s,
        coins: moneda === "coins" ? s.coins - costo : s.coins,
        gems: moneda === "gems" ? s.gems - costo : s.gems,
        inventario: { ...s.inventario, [id]: s.inventario[id] + 1 },
      };
    });
  }

  return (
    <div className="flex flex-col gap-4 px-4 pt-4">
      <div>
        <h1 className="font-display text-xl font-bold text-txt-primary">Tienda</h1>
        <p className="text-sm text-txt-secondary">Ayudas para tus retos, ganadas jugando</p>
      </div>

      <div className="flex gap-3">
        <div className="flex flex-1 items-center gap-2 rounded-xl border border-border-default bg-surface-primary p-3">
          <Coins className="h-5 w-5 text-gold" strokeWidth={2.2} />
          <span className="font-display text-lg font-bold tabular text-txt-primary">{state.coins}</span>
        </div>
        <div className="flex flex-1 items-center gap-2 rounded-xl border border-border-default bg-surface-primary p-3">
          <Gem className="h-5 w-5 text-brand-primary" strokeWidth={2.2} />
          <span className="font-display text-lg font-bold tabular text-txt-primary">{state.gems}</span>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {AYUDAS.map((a) => {
          const saldo = a.moneda === "coins" ? state.coins : state.gems;
          const alcanza = saldo >= a.costo;
          return (
            <div
              key={a.id}
              className="flex items-center gap-3 rounded-xl border border-border-default bg-surface-primary p-4"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-primary-soft text-brand-primary">
                <Sparkles className="h-5 w-5" strokeWidth={2.2} />
              </span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-txt-primary">{a.nombre}</p>
                <p className="text-xs text-txt-tertiary">{a.desc}</p>
                <p className="mt-0.5 text-xs font-semibold text-brand-primary">
                  Tienes: {state.inventario[a.id]}
                </p>
              </div>
              <button
                type="button"
                disabled={!alcanza}
                onClick={() => comprar(a.id, a.costo, a.moneda)}
                className="flex h-9 shrink-0 items-center gap-1 rounded-lg bg-brand-primary px-3 text-xs font-bold text-white disabled:opacity-40"
              >
                {a.moneda === "coins" ? (
                  <Coins className="h-3.5 w-3.5" strokeWidth={2.4} />
                ) : (
                  <Gem className="h-3.5 w-3.5" strokeWidth={2.4} />
                )}
                {a.costo}
              </button>
            </div>
          );
        })}
      </div>

      <p className="text-center text-xs text-txt-tertiary">
        Gana monedas y gemas jugando cualquier ronda. No hace falta venir aquí antes de jugar: si
        no tienes una ayuda pero te alcanzan tus monedas o gemas, también puedes comprarla al
        instante desde la barra de ayudas dentro de cualquier reto.
      </p>
    </div>
  );
}
