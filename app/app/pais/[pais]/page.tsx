"use client";

import { use, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, Stamp, Check, Gem, Sparkles, X as XIcon } from "lucide-react";
import { useAppState } from "@/lib/app-state-context";
import {
  progresoDePais,
  pctPais,
  categoriaCompleta100,
  todasLasCategoriasCompletas,
  paisDesbloqueadoEnRuta,
  puedeJugarPais,
  categoriasOrdenadasPorFavoritas,
  acelerarPaisConGemas,
  GEMAS_ACELERAR_PAIS,
} from "@/lib/app-state";
import { categoriasDelPais, PAISES_AMERICA } from "@/lib/countries-data";
import { CATEGORIA_COLOR as COLOR_VAR } from "@/lib/category-style";
import { CategoryIcon } from "@/components/app/CategoryIcon";
import { rutaDelPais } from "@/lib/rutas-data";

export default function PaisPage({ params }: { params: Promise<{ pais: string }> }) {
  const { pais: paisParam } = use(params);
  const nombrePais = decodeURIComponent(paisParam);
  const router = useRouter();
  const { state, setState, ready, guardarAhora } = useAppState();
  const [confirmandoAcelerar, setConfirmandoAcelerar] = useState(false);

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
  const alcanzaParaAcelerar = state.gems >= GEMAS_ACELERAR_PAIS;

  function cerrarTip() {
    setState((s) => ({ ...s, tipAcelerarVisto: true }));
  }

  function confirmarAcelerar() {
    if (!alcanzaParaAcelerar) return;
    setState((s) => {
      const nuevo = acelerarPaisConGemas(s, nombrePais);
      void guardarAhora(nuevo);
      return nuevo;
    });
    setConfirmandoAcelerar(false);
  }

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

        {!state.tipAcelerarVisto && (
          <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-brand-primary/30 bg-brand-primary-soft p-3">
            <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary" strokeWidth={2.2} />
            <p className="flex-1 text-xs leading-relaxed text-txt-primary">
              <strong>Tip:</strong> juega los Retos para ganar monedas rápido — te alcanzan para ayudas 50/50 o
              +tiempo. Con Gemas puedes acelerar tu avance en la ruta.
            </p>
            <button
              type="button"
              onClick={cerrarTip}
              aria-label="Cerrar aviso"
              className="shrink-0 text-txt-tertiary"
            >
              <XIcon className="h-4 w-4" strokeWidth={2.2} />
            </button>
          </div>
        )}

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

          {!progreso.retoFinalCompletado && (
            <div className="col-span-2 rounded-xl border border-border-default bg-surface-primary p-4">
              {!confirmandoAcelerar ? (
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-primary-soft text-brand-primary">
                    <Gem className="h-5 w-5" strokeWidth={2.2} />
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-txt-primary">Acelerar con Gemas</p>
                    <p className="text-xs text-txt-tertiary">
                      Completa lo que falte de {nombrePais} al instante y pasa al siguiente país
                    </p>
                  </div>
                  <button
                    type="button"
                    disabled={!alcanzaParaAcelerar}
                    onClick={() => setConfirmandoAcelerar(true)}
                    className="flex h-9 shrink-0 items-center gap-1 rounded-lg bg-brand-primary px-3 text-xs font-bold text-white disabled:opacity-40"
                  >
                    <Gem className="h-3.5 w-3.5" strokeWidth={2.4} />
                    {GEMAS_ACELERAR_PAIS}
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3 text-center">
                  <p className="text-xs text-txt-secondary">
                    Se completarán las categorías que falten y conquistarás {nombrePais} de una vez. No ganarás las
                    monedas de jugarlas — se descontarán {GEMAS_ACELERAR_PAIS} gemas. ¿Seguro?
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setConfirmandoAcelerar(false)}
                      className="flex h-10 flex-1 items-center justify-center rounded-lg border border-border-strong text-xs font-bold text-txt-primary"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={confirmarAcelerar}
                      className="flex h-10 flex-1 items-center justify-center gap-1 rounded-lg bg-brand-primary text-xs font-bold text-white"
                    >
                      <Gem className="h-3.5 w-3.5" strokeWidth={2.4} />
                      Confirmar
                    </button>
                  </div>
                </div>
              )}
              {!alcanzaParaAcelerar && !confirmandoAcelerar && (
                <p className="mt-2 text-center text-xs text-txt-tertiary">
                  Te faltan gemas — se ganan conquistando países o en los premios de racha (7/14/30 días)
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
