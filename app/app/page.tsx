"use client";

import { useState } from "react";
import Link from "next/link";
import { Lock, X as XIcon, Plane } from "lucide-react";
import { useAppState } from "@/lib/app-state-context";
import { TopBar } from "@/components/app/shell/TopBar";
import { RUTAS_AMERICA, RUTAS_EUROPA, RUTAS_ASIA, RUTAS_AFRICA, RUTAS_OCEANIA, RUTAS_ANTARTIDA } from "@/lib/rutas-data";
import { pctRuta, rutaDesbloqueada, rutaCompleta } from "@/lib/app-state";
import { paisPorNombreMundo } from "@/lib/countries-data";
import { RouteBoardingPassCard } from "@/components/app/RouteBoardingPassCard";

const CONTINENTES_BLOQUEADOS = [
  { id: "europa", nombre: "Europa", rutas: RUTAS_EUROPA },
  { id: "asia", nombre: "Asia", rutas: RUTAS_ASIA },
  { id: "africa", nombre: "África", rutas: RUTAS_AFRICA },
  { id: "oceania", nombre: "Oceanía", rutas: RUTAS_OCEANIA },
  { id: "antartida", nombre: "Antártida", rutas: RUTAS_ANTARTIDA },
] as const;

export default function MapaPage() {
  const { state, ready } = useAppState();
  const [continentePreview, setContinentePreview] = useState<(typeof CONTINENTES_BLOQUEADOS)[number] | null>(null);

  if (!ready) {
    return (
      <div className="flex flex-col gap-4 px-4 pt-4">
        <div className="h-9 w-40 animate-pulse rounded-lg bg-surface-secondary" />
        <div className="h-24 animate-pulse rounded-2xl bg-surface-secondary" />
        <div className="h-64 animate-pulse rounded-2xl bg-surface-secondary" />
      </div>
    );
  }

  const progresoMundial = Math.round(
    RUTAS_AMERICA.reduce((acc, r) => acc + pctRuta(state, r), 0) / RUTAS_AMERICA.length
  );

  return (
    <div>
      <TopBar state={state} />
      <div className="flex flex-col gap-4 px-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-txt-tertiary">
            Tu progreso mundial
          </p>
          <p className="font-display text-2xl font-extrabold text-brand-primary">{progresoMundial}%</p>
        </div>

        {/* Pestañas de continente estilo pasaporte — dispositivo ownable de FICHA-ARTE.md.
            Con 6 continentes ya no caben en una pantalla de 375px: fila con scroll horizontal. */}
        <div className="flex gap-1.5 overflow-x-auto">
          <span className="shrink-0 rounded-t-lg bg-surface-secondary px-4 py-2 font-display text-sm font-bold text-txt-primary">
            América
          </span>
          {CONTINENTES_BLOQUEADOS.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setContinentePreview(c)}
              className="flex shrink-0 items-center gap-1.5 rounded-t-lg bg-surface-primary px-4 py-2 text-sm font-medium text-txt-tertiary"
            >
              <Lock className="h-3.5 w-3.5 text-gold-bright" strokeWidth={2.2} />
              {c.nombre}
            </button>
          ))}
        </div>

        <div className="-mt-4 flex flex-col gap-3 rounded-b-xl rounded-tr-xl bg-surface-secondary p-4 pt-6">
          {RUTAS_AMERICA.map((ruta, i) => {
            const pct = pctRuta(state, ruta);
            const desbloqueada = rutaDesbloqueada(state, ruta);
            const completa = rutaCompleta(state, ruta);
            const ganada = state.insigniasGanadas.includes(ruta.id);
            const tarjeta = (
              <RouteBoardingPassCard
                ruta={ruta}
                indice={i}
                pct={pct}
                desbloqueada={desbloqueada}
                completa={completa}
                ganada={ganada}
                rutaAnteriorInsignia={RUTAS_AMERICA[i - 1]?.insignia}
              />
            );
            return desbloqueada ? (
              <Link key={ruta.id} href={`/app/ruta/${ruta.id}`}>
                {tarjeta}
              </Link>
            ) : (
              <div key={ruta.id}>{tarjeta}</div>
            );
          })}
        </div>

        {/* Video promocional — pedido explícito del usuario, mismo radio/sombra
            que las tarjetas de arriba para que se sienta parte del mismo sistema. */}
        <div className="relative overflow-hidden rounded-2xl shadow-lg">
          <video
            src="/videos/avion-mundo.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="h-48 w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
          <div className="absolute inset-0 flex flex-col items-center justify-end gap-1 p-5 text-center">
            <h2 className="font-display text-lg font-bold text-white">¿Listo para tu próximo destino?</h2>
            <p className="text-sm text-white/85">Completa tus trivias diarias y desbloquea Europa.</p>
          </div>
        </div>
      </div>

      {/* Vista previa de continente bloqueado — pedida explícitamente por el usuario. */}
      {continentePreview && (
        <div
          className="fixed inset-0 z-20 flex items-end justify-center bg-black/50 sm:items-center"
          onClick={() => setContinentePreview(null)}
        >
          <div
            className="w-full max-w-sm rounded-t-2xl bg-surface-primary p-5 sm:rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-txt-primary">{continentePreview.nombre}</h2>
              <button
                type="button"
                onClick={() => setContinentePreview(null)}
                aria-label="Cerrar"
                className="flex h-9 w-9 items-center justify-center rounded-full text-txt-tertiary"
              >
                <XIcon className="h-5 w-5" strokeWidth={2.2} />
              </button>
            </div>
            <p className="mt-2 text-sm text-txt-secondary">
              {continentePreview.rutas.length === 1
                ? "Esta es la ruta que viene — construimos su contenido pronto."
                : `Estas son las ${continentePreview.rutas.length} rutas que vienen — construimos su contenido pronto.`}
            </p>
            <div className="mt-4 flex flex-col gap-2">
              {continentePreview.rutas.map((ruta, i) => {
                const codigos = ruta.paises.map((nombre) => paisPorNombreMundo(nombre)?.codigo ?? "???");
                return (
                  <div key={ruta.id} className="flex items-center gap-3 rounded-xl bg-surface-secondary p-3 opacity-80">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-status-locked text-white">
                      <Lock className="h-4 w-4" strokeWidth={2.2} />
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-txt-primary">
                        Ruta {i + 1}: {ruta.nombre}
                      </p>
                      <div className="mt-0.5 flex items-center gap-1 text-xs font-semibold text-txt-tertiary">
                        {codigos.map((codigo, j) => (
                          <span key={codigo + j} className="flex items-center gap-1">
                            {codigo}
                            {j < codigos.length - 1 && <Plane className="h-3 w-3" strokeWidth={2.4} />}
                          </span>
                        ))}
                        <span className="ml-1">· Insignia &quot;{ruta.insignia}&quot;</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <button
              type="button"
              onClick={() => setContinentePreview(null)}
              className="mt-4 flex h-12 w-full items-center justify-center rounded-lg bg-brand-primary font-display text-sm font-bold text-white"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
