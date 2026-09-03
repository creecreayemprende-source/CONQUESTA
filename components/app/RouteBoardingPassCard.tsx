import { Lock, Check, Compass, Plane } from "lucide-react";
import type { Ruta } from "@/lib/rutas-data";
import { PAISES_AMERICA } from "@/lib/countries-data";

const PALETA: Record<string, { a: string; b: string; angulo: string }> = {
  "origen-andino": { a: "var(--ruta-andino-a)", b: "var(--ruta-andino-b)", angulo: "135deg" },
  "ritmo-tropico": { a: "var(--ruta-tropico-a)", b: "var(--ruta-tropico-b)", angulo: "135deg" },
  "ecos-del-norte": { a: "var(--ruta-norte-a)", b: "var(--ruta-norte-b)", angulo: "125deg" },
};

/** Tarjeta de ruta estilo pase de abordar / tiquete aéreo — pedido explícito del
 * usuario (2026-08-23): muesca troquelada en la unión cuerpo/talón, línea punteada
 * separadora, degradado temático propio por ruta, tipografía más grande y de
 * alto contraste. El color de la muesca coincide con el fondo del contenedor
 * padre (`--surface-secondary`) para que el "corte" se vea limpio. */
export function RouteBoardingPassCard({
  ruta,
  indice,
  pct,
  desbloqueada,
  completa,
  ganada,
  rutaAnteriorInsignia,
}: {
  ruta: Ruta;
  indice: number;
  pct: number;
  desbloqueada: boolean;
  completa: boolean;
  ganada: boolean;
  rutaAnteriorInsignia?: string;
}) {
  const paleta = PALETA[ruta.id];
  const codigos = ruta.paises.map((nombre) => PAISES_AMERICA.find((p) => p.nombre === nombre)?.codigo ?? "???");

  return (
    <div
      className="relative flex overflow-hidden rounded-2xl shadow-lg"
      style={{
        background: desbloqueada
          ? `linear-gradient(${paleta.angulo}, ${paleta.a}, ${paleta.b})`
          : "repeating-linear-gradient(45deg, var(--ruta-bloqueada-a) 0px, var(--ruta-bloqueada-a) 10px, var(--ruta-bloqueada-b) 10px, var(--ruta-bloqueada-b) 20px)",
      }}
    >
      {/* Cuerpo principal — nombre de ruta, secuencia de países, progreso. */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="font-display text-lg font-extrabold leading-tight text-white">
          Ruta {indice + 1}: {ruta.nombre}
        </p>
        <div className="flex items-center gap-1.5 text-sm font-semibold text-white">
          {codigos.map((codigo, i) => (
            <span key={codigo} className="flex items-center gap-1.5">
              {codigo}
              {i < codigos.length - 1 && <Plane className="h-3.5 w-3.5 text-white/70" strokeWidth={2.4} />}
            </span>
          ))}
        </div>
        {desbloqueada && !completa && (
          <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-white/25">
            <div className="h-full rounded-full bg-white transition-[width] duration-500 ease-out" style={{ width: `${pct}%` }} />
          </div>
        )}
        {!desbloqueada && (
          <p className="mt-1 text-xs font-semibold text-white/90">
            Requiere la insignia "{rutaAnteriorInsignia}"
          </p>
        )}
      </div>

      {/* Línea de troquel + muescas — separan el cuerpo del talón, como un tiquete real. */}
      <div className="relative flex w-24 shrink-0 flex-col items-center justify-center gap-2 border-l-2 border-dashed border-white/40 px-2 py-4 text-center">
        <span className="absolute -left-2 -top-2 h-4 w-4 rounded-full bg-surface-secondary" aria-hidden="true" />
        <span className="absolute -left-2 -bottom-2 h-4 w-4 rounded-full bg-surface-secondary" aria-hidden="true" />
        <span
          className={`flex h-9 w-9 items-center justify-center rounded-full ${
            ganada ? "bg-gold text-white" : desbloqueada ? "bg-white/20 text-white" : "bg-black/20 text-white/70"
          }`}
        >
          {ganada ? <Check className="h-4 w-4" strokeWidth={2.6} /> : desbloqueada ? <Compass className="h-4 w-4" strokeWidth={2.2} /> : <Lock className="h-4 w-4" strokeWidth={2.2} />}
        </span>
        <p className={`font-display font-extrabold tabular text-white ${desbloqueada ? "text-sm" : "text-xs"}`}>
          {ganada ? "LISTA" : desbloqueada ? `${pct}%` : "BLOQUEADA"}
        </p>
      </div>
    </div>
  );
}
