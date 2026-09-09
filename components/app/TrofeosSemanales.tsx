import Link from "next/link";
import { Crown, Medal, Lock } from "lucide-react";
import { MEDALLAS_SEMANALES, esMedallaSemanal, type MedallaSemanal } from "@/lib/medallas-semanales";

const ORDEN: MedallaSemanal[] = ["oro", "plata", "bronce"];

/** Vitrina de medallas del Ranking Semanal — siempre muestra las 3 (oro/plata/
 * bronce), bloqueadas hasta que el cron `cerrar_semana_ranking` las otorgue de
 * verdad. Mismo patrón visual que `SouvenirVitrina`. */
export function TrofeosSemanales({ medallasGanadas }: { medallasGanadas: string[] }) {
  return (
    <div className="rounded-2xl border border-border-default bg-surface-primary p-4">
      <h2 className="mb-1 font-display text-sm font-bold text-txt-primary">Trofeos del Ranking Semanal</h2>
      <p className="mb-3 text-xs text-txt-tertiary">Termina entre los 3 primeros de la semana para ganarlas</p>
      <div className="grid grid-cols-3 gap-3">
        {ORDEN.map((id) => {
          const m = MEDALLAS_SEMANALES[id];
          const ganada = medallasGanadas.filter(esMedallaSemanal).includes(id);
          const Icono = id === "oro" ? Crown : Medal;
          return (
            <div key={id} className="flex flex-col items-center gap-1.5 text-center">
              <span
                className={`flex h-14 w-14 items-center justify-center rounded-full ${
                  ganada ? "" : "bg-surface-secondary text-txt-tertiary"
                }`}
                style={
                  ganada
                    ? { backgroundColor: `color-mix(in srgb, ${m.colorVar} 18%, transparent)`, color: m.colorVar }
                    : undefined
                }
              >
                {ganada ? <Icono className="h-6 w-6" strokeWidth={2} /> : <Lock className="h-5 w-5" strokeWidth={2.2} />}
              </span>
              <span className="text-xs leading-tight text-txt-secondary">{ganada ? m.nombre : "???"}</span>
            </div>
          );
        })}
      </div>
      <Link href="/app/ranking" className="mt-3 block text-center text-xs font-semibold text-brand-primary">
        Ver Ranking Semanal
      </Link>
    </div>
  );
}
