import type { PreguntaTrivia } from "./onboarding-data";
import { shuffle } from "./trivia-bank";

export type FormatoPregunta = "opcion_multiple" | "completar";

/** ¿Esta respuesta sirve para el formato "completar la palabra"? Solo letras
 * y espacios, y un largo razonable (ni trivial ni imposible de adivinar) —
 * respuestas con números ("1969", "88 teclas") o símbolos quedan afuera. */
function esCompletable(respuesta: string): boolean {
  return /^[A-Za-zÀ-ÿ ]{3,16}$/.test(respuesta.trim());
}

/** El Reto Final sí es un repaso de lo que el jugador ya vio en las 3 rondas
 * de cada categoría — ahí SÍ tiene sentido pedirle que recuerde, no solo que
 * reconozca. Se mezclan 2 o 3 preguntas (nunca más) en formato "completar la
 * palabra", el resto queda en opción múltiple. */
export function formatosRetoFinal(preguntas: PreguntaTrivia[]): FormatoPregunta[] {
  const elegibles = preguntas
    .map((p, i) => ({ i, elegible: esCompletable(p.opciones[p.correctaIndex]) }))
    .filter((x) => x.elegible)
    .map((x) => x.i);

  const cantidad = Math.min(elegibles.length, Math.random() < 0.5 ? 2 : 3);
  const elegidos = new Set(shuffle(elegibles).slice(0, cantidad));

  return preguntas.map((_, i) => (elegidos.has(i) ? "completar" : "opcion_multiple"));
}
