import { Coffee, Landmark, Wine, PartyPopper, Music, Leaf, Lock } from "lucide-react";
import { SOUVENIRS, type Souvenir } from "@/lib/souvenirs-data";

const ICONOS: Record<Souvenir["icono"], typeof Coffee> = {
  Coffee,
  Landmark,
  Wine,
  PartyPopper,
  Music,
  Leaf,
};

/** Vitrina de souvenirs — un objeto típico por país conquistado, con su dato
 * curioso. Los que no se han ganado aún se muestran bloqueados (candado),
 * misma lógica de estados que el pasaporte de sellos. */
export function SouvenirVitrina({ paisesConquistados }: { paisesConquistados: string[] }) {
  return (
    <div className="rounded-2xl border border-border-default bg-surface-primary p-4">
      <h2 className="mb-3 font-display text-sm font-bold text-txt-primary">Tu vitrina de souvenirs</h2>
      <div className="grid grid-cols-3 gap-3">
        {SOUVENIRS.map((s) => {
          const ganado = paisesConquistados.includes(s.pais);
          const Icono = ICONOS[s.icono];
          return (
            <div key={s.pais} className="flex flex-col items-center gap-1.5 text-center">
              <span
                className={`flex h-14 w-14 items-center justify-center rounded-full ${
                  ganado ? "bg-gold-soft text-gold" : "bg-surface-secondary text-txt-tertiary"
                }`}
              >
                {ganado ? <Icono className="h-6 w-6" strokeWidth={2} /> : <Lock className="h-5 w-5" strokeWidth={2.2} />}
              </span>
              <span className="text-xs leading-tight text-txt-secondary">{ganado ? s.nombre : "???"}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
