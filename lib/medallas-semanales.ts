export type MedallaSemanal = "oro" | "plata" | "bronce";

/** Medallas exclusivas del "cofre" del Ranking Semanal — las otorga solo el
 * cron `cerrar_semana_ranking` (domingo a medianoche, hora Colombia/Perú) al
 * top 3 de esa semana. Se ganan una sola vez por cuenta (quedan para siempre
 * en la vitrina, aunque no se repita el puesto otra semana). */
export const MEDALLAS_SEMANALES: Record<
  MedallaSemanal,
  { nombre: string; puesto: string; colorVar: string; gemas: number; dato: string }
> = {
  oro: {
    nombre: "Corona del Campeón Semanal",
    puesto: "1er puesto",
    colorVar: "var(--gold)",
    gemas: 30,
    dato: "Quedaste 1º en el Ranking Semanal — el jugador con más monedas ganadas esa semana.",
  },
  plata: {
    nombre: "Medalla de Plata Semanal",
    puesto: "2do puesto",
    colorVar: "var(--silver)",
    gemas: 20,
    dato: "Quedaste 2º en el Ranking Semanal.",
  },
  bronce: {
    nombre: "Medalla de Bronce Semanal",
    puesto: "3er puesto",
    colorVar: "var(--bronze)",
    gemas: 10,
    dato: "Quedaste 3º en el Ranking Semanal.",
  },
};

export function esMedallaSemanal(valor: string): valor is MedallaSemanal {
  return valor === "oro" || valor === "plata" || valor === "bronce";
}
