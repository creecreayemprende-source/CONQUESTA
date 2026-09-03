"use client";

import { use, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, Stamp, Check } from "lucide-react";
import { useAppState } from "@/lib/app-state-context";
import { progresoDePais, pctPais, categoriaCompleta100, todasLasCategoriasCompletas, paisDesbloqueadoEnRuta, puedeJugarPais, categoriasOrdenadasPorFavoritas } from "@/lib/app-state";
import { categoriasDelPais, PAISES_AMERICA } from "@/lib/countries-data";
import { CATEGORIA_COLOR as COLOR_VAR } from "@/lib/category-style";
import { CategoryIcon } from "@/components/app/CategoryIcon";
import { rutaDelPais } from "@/lib/rutas-data";

export default function PaisPage({ params }: { params: Promise<{ pais: string }> }) {
  const { pais: paisParam } = use(params);
  const nombrePais = decodeURIComponent(paisParam);
  const router = useRouter();
  const { state, ready } = useAppState();

  const ruta = rutaDelPais(nombrePais);
  const secuenciaOk = !ready || !ruta || paisDesbloqueadoEnRuta(state, nombrePais);
  // Le toca en secuencia pero requiere Pro (y no está en trial/Pro) → el paywall,
  // no el interior del país. Antes esto no se validaba: entrar directo por URL
  // a Perú/Chile sin ser Pro mostraba su contenido igual.
  const necesitaPro = ready && !!ruta && secuenciaOk && !puedeJugarPais(state, nombrePais);

  useEffect(() => {
    if (!ready || !ruta) return;
    if (!secuenciaOk) {
      router.replace(`/app/ruta/${ruta.id}`);
      return;
    }
    if (necesitaPro) {
      router.replace("/paywall");
    }
  }, [ready, ruta, secuenciaOk, necesitaPro, router]);

  if (!ready || (ruta && !secuenciaOk) || necesitaPro) {
    return <div className="m-4 h-64 animate-pulse rounded-2xl bg-surface-secondary" />;
  }

  const paisInfo = PAISES_AMERICA.find((p) => p.nombre === nombrePais);
  const progreso = progresoDePais(state, nombrePais);
  const pct = pctPais(progreso);
  // Personalización real del onboarding: sus categorías favoritas van primero.
  const categorias = categoriasOrdenadasPorFavoritas(categoriasDelPais(), state.categoriasFavoritas);
  const todasCompletas = todasLasCategoriasCompletas(progreso);

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2 px-2 pt-4">
        <button
          type="button"
          onClick={() => router.push(ruta ? `/app/ruta/${ruta.id}` : "/app")}
          aria-label="Volver"
          className="flex h-11 w-11 items-center justify-center rounded-full text-txt-secondary"
        >
          <ChevronLeft className="h-5 w-5" strokeWidth={2.4} />
        </button>
        {ruta && (
          <span className="text-xs font-semibold text-txt-tertiary">
            Ruta: <span className="text-txt-secondary">{ruta.nombre}</span>
          </span>
        )}
      </div>

      <div className="px-4">
        <div className="relative flex h-28 items-end overflow-hidden rounded-xl p-4">
          {paisInfo?.imagen ? (
            <Image
              src={paisInfo.imagen}
              alt={nombrePais}
              fill
              sizes="(max-width: 480px) 100vw, 400px"
              priority
              className="object-cover"
              style={{ objectPosition: "center 40%" }}
            />
          ) : (
            <div className="absolute inset-0" style={{ background: paisInfo?.colorBandera ?? "var(--brand-primary)" }} />
          )}
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(0deg, rgba(11,30,61,.85), rgba(11,30,61,.1))" }}
          />
          <h1 className="relative font-display text-2xl font-extrabold text-white">{nombrePais}</h1>
        </div>

        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="font-semibold text-txt-primary">Tu progreso</span>
          <span className="font-display text-lg font-extrabold tabular text-brand-primary">{pct}%</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-surface-secondary">
          <div className="h-full rounded-full bg-brand-primary transition-[width] duration-500 ease-out" style={{ width: `${pct}%` }} />
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          {categorias.map((cat) => {
            const info = progreso.categorias[cat];
            const completa = categoriaCompleta100(info);
            const rondaActual = !info.rondas.Explorador.completado
              ? "Explorador"
              : !info.rondas.Descubridor.completado
                ? "Descubridor"
                : !info.rondas.Experto.completado
                  ? "Experto"
                  : null;
            return (
              <Link
                key={cat}
                href={`/app/pais/${encodeURIComponent(nombrePais)}/categoria/${encodeURIComponent(cat)}`}
                className="flex flex-col items-center gap-2 rounded-xl border border-border-default bg-surface-primary p-4 text-center shadow-sm"
              >
                <span
                  className="flex h-11 w-11 items-center justify-center rounded-full text-white"
                  style={{ backgroundColor: COLOR_VAR[cat] }}
                >
                  {completa ? <Check className="h-5 w-5" strokeWidth={2.6} /> : <CategoryIcon categoria={cat} className="h-5 w-5" />}
                </span>
                <span className="text-sm font-semibold text-txt-primary">{cat}</span>
                <span className="text-xs text-txt-tertiary">{completa ? "100% completo" : rondaActual}</span>
              </Link>
            );
          })}

          <Link
            href={todasCompletas ? `/app/jugar/${encodeURIComponent(nombrePais)}/reto-final` : "#"}
            aria-disabled={!todasCompletas}
            className={`col-span-2 flex flex-col items-center gap-2 rounded-xl p-5 text-center ${
              todasCompletas ? "bg-status-success text-white" : "pointer-events-none bg-surface-secondary text-txt-tertiary"
            }`}
          >
            <Stamp className="h-6 w-6" strokeWidth={2} />
            <span className="font-display text-sm font-bold">
              {todasCompletas
                ? "Reto final — ¡conquista el país!"
                : "Reto final (completa las 6 categorías al 100%)"}
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
