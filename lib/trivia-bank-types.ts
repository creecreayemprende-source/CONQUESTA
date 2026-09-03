/** Tipos y configuración compartidos entre trivia-bank.ts y los bancos de
 * contenido por país (trivia-content-*.ts) — separados en su propio archivo
 * para evitar import circular (los bancos de contenido no deben importar
 * trivia-bank.ts, y trivia-bank.ts sí importa los bancos de contenido). */
export type RondaId = "Explorador" | "Descubridor" | "Experto";

export const RONDAS: Record<RondaId, { cantidad: number; segundos: number; siguiente: RondaId | null }> = {
  Explorador: { cantidad: 5, segundos: 30, siguiente: "Descubridor" },
  Descubridor: { cantidad: 7, segundos: 30, siguiente: "Experto" },
  Experto: { cantidad: 10, segundos: 40, siguiente: null },
};

export const RETO_FINAL_CONFIG = { cantidad: 20, segundos: 90 };
