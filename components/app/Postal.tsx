"use client";

import { CountryFlag, paisTieneBandera } from "@/components/app/CountryFlag";
import { CATEGORIA_ICONO, CATEGORIA_COLOR } from "@/lib/category-style";
import type { Categoria } from "@/lib/onboarding-data";

/** Pantalla "postal" — se muestra antes de empezar una categoría por primera
 * vez: un dato curioso real del país, sin ninguna pregunta. Rompe el ritmo de
 * "solo examen" antes de entrar a jugar. */
export function Postal({
  pais,
  categoria,
  texto,
  onContinuar,
}: {
  pais: string;
  categoria: Categoria;
  texto: string;
  onContinuar: () => void;
}) {
  const Icono = CATEGORIA_ICONO[categoria];
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-6 px-6 text-center">
      {paisTieneBandera(pais) ? (
        <CountryFlag pais={pais} className="h-28 w-44 overflow-hidden rounded-2xl shadow-md" ajuste="cubrir" />
      ) : (
        <span
          className="flex h-20 w-20 items-center justify-center rounded-full"
          style={{ backgroundColor: `color-mix(in srgb, ${CATEGORIA_COLOR[categoria]} 15%, transparent)`, color: CATEGORIA_COLOR[categoria] }}
        >
          <Icono className="h-9 w-9" strokeWidth={2} />
        </span>
      )}

      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: CATEGORIA_COLOR[categoria] }}>
          {pais} · {categoria}
        </p>
        <p className="text-balance font-display text-xl font-bold leading-snug text-txt-primary">{texto}</p>
      </div>

      <button
        type="button"
        onClick={onContinuar}
        className="mt-2 flex h-14 w-full max-w-xs items-center justify-center rounded-lg bg-brand-primary font-display text-base font-bold text-white transition-transform duration-200 ease-out hover:-translate-y-0.5"
      >
        Continuar mi viaje
      </button>
    </div>
  );
}
