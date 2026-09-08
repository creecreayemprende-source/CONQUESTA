"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, Compass, Telescope, Crown, Clock, Coins } from "lucide-react";
import { temaDeNombre } from "@/lib/sopa-letras-data";
import { SOPA_NIVELES, type NivelSopa } from "@/lib/sopa-letras-generador";

const NIVEL_INFO: Record<NivelSopa, { icon: typeof Compass; desc: string; monedas: number }> = {
  Explorador: { icon: Compass, desc: "Horizontal y vertical", monedas: 20 },
  Descubridor: { icon: Telescope, desc: "Suma diagonales", monedas: 30 },
  Experto: { icon: Crown, desc: "Mezcla todo, incluidas palabras al revés", monedas: 50 },
};

export default function SopaLetrasDificultadPage({ params }: { params: Promise<{ tema: string }> }) {
  const { tema: temaParam } = use(params);
  const nombreTema = decodeURIComponent(temaParam);
  const router = useRouter();
  const tema = temaDeNombre(nombreTema);

  if (!tema) notFound();

  return (
    <div className="flex flex-col px-4">
      <div className="flex items-center gap-2 pt-4">
        <button
          type="button"
          onClick={() => router.push("/app/retos/sopa-letras")}
          aria-label="Volver"
          className="flex h-11 w-11 items-center justify-center rounded-full text-txt-secondary"
        >
          <ChevronLeft className="h-5 w-5" strokeWidth={2.4} />
        </button>
        <h1 className="font-display text-lg font-bold text-txt-primary">{nombreTema}</h1>
      </div>

      <div className="mt-4 flex flex-col gap-3">
        {(Object.keys(SOPA_NIVELES) as NivelSopa[]).map((nivel) => {
          const cfg = SOPA_NIVELES[nivel];
          const { icon: Icon, desc, monedas } = NIVEL_INFO[nivel];
          return (
            <Link
              key={nivel}
              href={`/app/retos/sopa-letras/${encodeURIComponent(nombreTema)}/${nivel}`}
              className="flex items-center gap-3 rounded-xl border border-border-default bg-surface-primary p-4 shadow-sm"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-primary text-white">
                <Icon className="h-5 w-5" strokeWidth={2.2} />
              </span>
              <div className="flex-1">
                <p className="font-display text-sm font-bold text-txt-primary">{nivel}</p>
                <p className="text-xs text-txt-tertiary">{desc}</p>
              </div>
              <div className="flex flex-col items-end gap-1 text-xs text-txt-tertiary">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" strokeWidth={2.2} />
                  {cfg.segundos}s
                </span>
                <span>{cfg.cantidad} palabras</span>
                <span className="flex items-center gap-1 font-semibold text-gold">
                  <Coins className="h-3 w-3" strokeWidth={2.4} />
                  {monedas}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
