"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, Lock, Check, Compass, Telescope, Crown, Clock } from "lucide-react";
import { useAppState } from "@/lib/app-state-context";
import { progresoDePais, rondaDesbloqueada } from "@/lib/app-state";
import { RONDAS, type RondaId } from "@/lib/trivia-bank";
import type { Categoria } from "@/lib/onboarding-data";
import { CATEGORIA_COLOR } from "@/lib/category-style";
import { Postal } from "@/components/app/Postal";
import { postalDe } from "@/lib/postales-data";

const RONDA_INFO: Record<RondaId, { icon: typeof Compass; desc: string }> = {
  Explorador: { icon: Compass, desc: "Primer contacto con la categoría" },
  Descubridor: { icon: Telescope, desc: "Un poco más a fondo" },
  Experto: { icon: Crown, desc: "El nivel más exigente" },
};

export default function CategoriaPage({
  params,
}: {
  params: Promise<{ pais: string; categoria: string }>;
}) {
  const { pais: paisParam, categoria: categoriaParam } = use(params);
  const pais = decodeURIComponent(paisParam);
  const categoria = decodeURIComponent(categoriaParam) as Categoria;
  const router = useRouter();
  const { state, ready } = useAppState();
  const [postalVista, setPostalVista] = useState(false);

  if (!ready) {
    return <div className="m-4 h-64 animate-pulse rounded-2xl bg-surface-secondary" />;
  }

  const progreso = progresoDePais(state, pais);
  const progresoCategoria = progreso.categorias[categoria];

  // La postal (dato curioso, sin preguntas) se muestra la primera vez que se
  // entra a esta categoría — mientras Explorador siga sin completar — para
  // romper el ritmo de "solo examen" antes de empezar a jugar.
  const textoPostal = postalDe(pais, categoria);
  if (textoPostal && !progresoCategoria.rondas.Explorador.completado && !postalVista) {
    return (
      <Postal pais={pais} categoria={categoria} texto={textoPostal} onContinuar={() => setPostalVista(true)} />
    );
  }

  return (
    <div className="flex flex-col px-4">
      <div className="flex items-center gap-2 pt-4">
        <button
          type="button"
          onClick={() => router.push(`/app/pais/${encodeURIComponent(pais)}`)}
          aria-label="Volver"
          className="flex h-11 w-11 items-center justify-center rounded-full text-txt-secondary"
        >
          <ChevronLeft className="h-5 w-5" strokeWidth={2.4} />
        </button>
        <h1 className="font-display text-lg font-bold" style={{ color: CATEGORIA_COLOR[categoria] }}>
          {categoria}
        </h1>
      </div>

      <div className="mt-4 flex flex-col gap-3">
        {(Object.keys(RONDAS) as RondaId[]).map((ronda) => {
          const cfg = RONDAS[ronda];
          const { icon: Icon, desc } = RONDA_INFO[ronda];
          const estado = progresoCategoria.rondas[ronda];
          const desbloqueada = rondaDesbloqueada(progresoCategoria, ronda);
          const esSiguiente = desbloqueada && !estado.completado;
          const contenido = (
            <div
              className={`flex items-center gap-3 rounded-xl border p-4 ${
                !desbloqueada
                  ? "border-border-default bg-surface-secondary opacity-60"
                  : esSiguiente
                    ? "border-transparent bg-surface-elevated shadow-md"
                    : "border-border-default bg-surface-primary shadow-sm"
              }`}
              style={esSiguiente ? { borderLeft: `4px solid ${CATEGORIA_COLOR[categoria]}` } : undefined}
            >
              <span
                className="flex h-11 w-11 items-center justify-center rounded-full text-white"
                style={{
                  backgroundColor: estado.completado ? "var(--status-success)" : CATEGORIA_COLOR[categoria],
                  opacity: desbloqueada ? 1 : 0.5,
                }}
              >
                {!desbloqueada ? <Lock className="h-5 w-5" strokeWidth={2.2} /> : estado.completado ? <Check className="h-5 w-5" strokeWidth={2.6} /> : <Icon className="h-5 w-5" strokeWidth={2.2} />}
              </span>
              <div className="flex-1">
                <p className="font-display text-sm font-bold text-txt-primary">{ronda}</p>
                <p className="text-xs text-txt-tertiary">{desc}</p>
              </div>
              <div className="flex flex-col items-end gap-1 text-xs text-txt-tertiary">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" strokeWidth={2.2} />
                  {cfg.segundos}s
                </span>
                <span>{cfg.cantidad} preguntas</span>
              </div>
            </div>
          );
          return desbloqueada ? (
            <Link key={ronda} href={`/app/jugar/${encodeURIComponent(pais)}/${encodeURIComponent(categoria)}/${ronda}`}>
              {contenido}
            </Link>
          ) : (
            <div key={ronda}>{contenido}</div>
          );
        })}
      </div>
    </div>
  );
}
