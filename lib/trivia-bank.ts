import type { Categoria, PreguntaTrivia } from "./onboarding-data";
import { RONDAS, RETO_FINAL_CONFIG, type RondaId } from "./trivia-bank-types";
import { BANCO_COLOMBIA } from "./trivia-content-colombia";
import { BANCO_PERU } from "./trivia-content-peru";
import { BANCO_CHILE } from "./trivia-content-chile";
import { BANCO_BRASIL } from "./trivia-content-brasil";
import { BANCO_CUBA } from "./trivia-content-cuba";
import { BANCO_COSTA_RICA } from "./trivia-content-costarica";
import { BANCO_MEXICO } from "./trivia-content-mexico";
import { BANCO_EEUU } from "./trivia-content-eeuu";
import { BANCO_CANADA } from "./trivia-content-canada";

export { RONDAS, RETO_FINAL_CONFIG };
export type { RondaId };

type BancoPorRonda = Record<RondaId, PreguntaTrivia[]>;

/** Banco de preguntas por país — cada uno con su propio contenido verificado,
 * mismo estándar y estructura (6 categorías × 3 rondas sin solapamiento).
 * Ruta 1 (Origen Andino): Colombia, Perú, Chile. Ruta 2 (Ritmo y Trópico):
 * Brasil, Cuba, Costa Rica. Ruta 3 (Ecos del Norte): México, Estados Unidos,
 * Canadá — contenido real agregado 2026-09-02. */
const BANCOS_PAISES: Record<string, Record<Categoria, BancoPorRonda>> = {
  Colombia: BANCO_COLOMBIA,
  Perú: BANCO_PERU,
  Chile: BANCO_CHILE,
  Brasil: BANCO_BRASIL,
  Cuba: BANCO_CUBA,
  "Costa Rica": BANCO_COSTA_RICA,
  México: BANCO_MEXICO,
  "Estados Unidos": BANCO_EEUU,
  Canadá: BANCO_CANADA,
};

export function shuffle<T>(arr: T[]): T[] {
  return [...arr]
    .map((v) => ({ v, r: Math.random() }))
    .sort((a, b) => a.r - b.r)
    .map(({ v }) => v);
}

/** Baraja las OPCIONES de una pregunta (no solo el orden de las preguntas) y
 * remapea `correctaIndex` a su nueva posición — antes la respuesta correcta
 * quedaba fija en el índice con que se escribió cada pregunta (casi siempre
 * 0), así que aparecía desproporcionadamente en la 1ra/2da opción. */
export function shuffleOpciones(p: PreguntaTrivia): PreguntaTrivia {
  const indices = shuffle(p.opciones.map((_, i) => i));
  return {
    ...p,
    opciones: indices.map((i) => p.opciones[i]),
    correctaIndex: indices.indexOf(p.correctaIndex),
  };
}

/** Cada ronda tiene su propio set — nunca repite lo de otro nivel de la misma categoría. */
export function preguntasParaRonda(pais: string, categoria: Categoria, ronda: RondaId): PreguntaTrivia[] {
  const banco = BANCOS_PAISES[pais];
  if (!banco) return [];
  const pool = banco[categoria][ronda];
  const { cantidad } = RONDAS[ronda];
  const resultado: PreguntaTrivia[] = [];
  while (resultado.length < cantidad) {
    resultado.push(...shuffle(pool));
  }
  return resultado.slice(0, cantidad).map(shuffleOpciones);
}

/** Reto final: preguntas variadas de TODAS las categorías y niveles, contra reloj. */
export function preguntasRetoFinal(pais: string, categorias: Categoria[]): PreguntaTrivia[] {
  const banco = BANCOS_PAISES[pais];
  if (!banco) return [];
  const todas = categorias.flatMap((c) => [
    ...banco[c].Explorador,
    ...banco[c].Descubridor,
    ...banco[c].Experto,
  ]);
  const barajado = shuffle(todas);
  const resultado: PreguntaTrivia[] = [];
  while (resultado.length < RETO_FINAL_CONFIG.cantidad) {
    resultado.push(...shuffle(barajado));
  }
  return resultado.slice(0, RETO_FINAL_CONFIG.cantidad).map(shuffleOpciones);
}

/** ¿Este país ya tiene banco de preguntas real? (Ruta 1: Colombia/Perú/Chile). */
export function paisTieneContenido(pais: string): boolean {
  return pais in BANCOS_PAISES;
}
