"use client";

import { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, Lock, Plane, Check, Medal, Crown } from "lucide-react";
import { useAppState } from "@/lib/app-state-context";
import { rutaPorId } from "@/lib/rutas-data";
import { progresoDePais, pctPais, pctRuta, rutaCompleta, paisDesbloqueadoEnRuta, puedeJugarPais } from "@/lib/app-state";
import { PAISES_AMERICA } from "@/lib/countries-data";
import { CountryFlag, paisTieneBandera } from "@/components/app/CountryFlag";

export default function RutaPage({ params }: { params: Promise<{ rutaId: string }> }) {
  const { rutaId } = use(params);
  const router = useRouter();
  const { state, ready } = useAppState();

  const ruta = rutaPorId(rutaId);

  if (!ready) {
    return <div className="m-4 h-64 animate-pulse rounded-2xl bg-surface-secondary" />;
  }

  if (!ruta) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-3 px-6 text-center">
        <p className="text-sm text-txt-secondary">Esta ruta no existe.</p>
        <button type="button" onClick={() => router.push("/app")} className="text-sm font-semibold text-brand-primary">
          Volver al mapa
        </button>
      </div>
    );
  }

  const pct = pctRuta(state, ruta);
  const completa = rutaCompleta(state, ruta);
  const insigniaGanada = state.insigniasGanadas.includes(ruta.id);

  return (
    <div className="flex flex-col px-4">
      <div className="flex items-center gap-2 pt-4">
        <button
          type="button"
          onClick={() => router.push("/app")}
          aria-label="Volver al mapa"
          className="flex h-11 w-11 items-center justify-center rounded-full text-txt-secondary"
        >
          <ChevronLeft className="h-5 w-5" strokeWidth={2.4} />
        </button>
        <div>
          <h1 className="font-display text-lg font-bold text-txt-primary">{ruta.nombre}</h1>
          <p className="text-xs text-txt-tertiary">{pct}% completado</p>
        </div>
      </div>

      <p className="mt-3 text-sm text-txt-secondary">{ruta.tema}</p>

      {insigniaGanada && (
        <div className="mt-4 flex items-center gap-3 rounded-xl bg-gold-soft p-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold text-white">
            <Medal className="h-5 w-5" strokeWidth={2.2} />
          </span>
          <div>
            <p className="font-display text-sm font-bold text-txt-primary">Insignia "{ruta.insignia}"</p>
            <p className="text-xs text-txt-tertiary">Ganada al conquistar los 3 países de esta ruta</p>
          </div>
        </div>
      )}

      <div className="mt-5 rounded-xl bg-surface-secondary p-4">
        {/* Ruta de vuelo con los 3 países de esta ruta, en orden de juego. */}
        <div className="relative flex items-center justify-between px-4">
          <div className="absolute left-6 right-6 top-1/2 h-0.5 -translate-y-1/2 border-t-2 border-dashed border-brand-primary/40" />
          {ruta.paises.map((nombrePais) => {
            const progreso = progresoDePais(state, nombrePais);
            const conquistado = progreso.retoFinalCompletado;
            const secuenciaOk = paisDesbloqueadoEnRuta(state, nombrePais);
            const jugable = puedeJugarPais(state, nombrePais);
            const necesitaPro = secuenciaOk && !jugable;
            return (
              <span
                key={nombrePais}
                className={`relative flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-white ring-4 ring-surface-secondary ${
                  conquistado ? "bg-status-success" : jugable ? "bg-brand-primary" : necesitaPro ? "bg-gold" : "bg-status-locked"
                }`}
              >
                {conquistado ? (
                  <Check className="h-4 w-4" strokeWidth={2.6} />
                ) : jugable ? (
                  <Plane className="h-4 w-4" strokeWidth={2.4} />
                ) : necesitaPro ? (
                  <Crown className="h-3.5 w-3.5" strokeWidth={2.2} />
                ) : (
                  <Lock className="h-3.5 w-3.5" strokeWidth={2.2} />
                )}
              </span>
            );
          })}
        </div>

        <div className="mt-4 flex flex-col gap-2">
          {ruta.paises.map((nombrePais, i) => {
            const paisInfo = PAISES_AMERICA.find((p) => p.nombre === nombrePais);
            const progreso = progresoDePais(state, nombrePais);
            const pctP = pctPais(progreso);
            const secuenciaOk = paisDesbloqueadoEnRuta(state, nombrePais);
            const jugable = puedeJugarPais(state, nombrePais);
            const necesitaPro = secuenciaOk && !jugable;
            const contenido = (
              <div className="flex items-center gap-3 rounded-xl bg-surface-primary px-3 py-3">
                <span className="font-display text-xs font-bold tabular text-brand-primary">{i + 1}</span>
                {paisTieneBandera(nombrePais) ? (
                  <CountryFlag pais={nombrePais} animar={jugable} className="h-6 w-6 shrink-0 overflow-hidden rounded-full shadow-sm" />
                ) : (
                  <span
                    className="h-6 w-6 shrink-0 rounded-full"
                    style={{ backgroundColor: paisInfo?.colorBandera ?? "var(--brand-primary)" }}
                  />
                )}
                <span className="flex-1 text-sm font-semibold text-txt-primary">{nombrePais}</span>
                {jugable ? (
                  <span className="text-xs font-bold tabular text-brand-primary">{pctP}%</span>
                ) : necesitaPro ? (
                  <span className="flex items-center gap-1 rounded-full bg-gold-soft px-2 py-1 text-xs font-bold text-gold">
                    <Crown className="h-3.5 w-3.5" strokeWidth={2.2} />
                    Pro
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs text-txt-tertiary">
                    <Lock className="h-3.5 w-3.5" strokeWidth={2.2} />
                    Conquista {ruta.paises[i - 1]}
                  </span>
                )}
              </div>
            );
            if (jugable) {
              return (
                <Link key={nombrePais} href={`/app/pais/${encodeURIComponent(nombrePais)}`}>
                  {contenido}
                </Link>
              );
            }
            if (necesitaPro) {
              return (
                <Link key={nombrePais} href="/paywall">
                  {contenido}
                </Link>
              );
            }
            return <div key={nombrePais}>{contenido}</div>;
          })}
        </div>
      </div>

      {!completa && (
        <p className="mt-4 text-center text-xs text-txt-tertiary">
          Conquista los 3 países en orden para ganar la insignia "{ruta.insignia}".
        </p>
      )}
    </div>
  );
}
