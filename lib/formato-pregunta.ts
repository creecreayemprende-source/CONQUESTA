import type { PreguntaTrivia } from "./onboarding-data";

export type FormatoPregunta = "opcion_multiple" | "completar";

/** ¿Esta respuesta sirve para el formato "completar la palabra"? Solo letras
 * y espacios, y un largo razonable (ni trivial ni imposible de adivinar) —
 * respuestas con números ("1969", "88 teclas") o símbolos quedan afuera. */
function esCompletable(respuesta: string): boolean {
  return /^[A-Za-zÀ-ÿ ]{3,16}$/.test(respuesta.trim());
}

/** Decide el formato de cada pregunta de una ronda: mezcla opción múltiple
 * (default) con "completar la palabra" en hasta ~1 de cada 3 preguntas
 * elegibles, para romper el ritmo de "puro examen" sin depender de contenido
 * nuevo (reutiliza la misma respuesta correcta que ya tiene la pregunta). */
export function formatosDeRonda(preguntas: PreguntaTrivia[]): FormatoPregunta[] {
  return preguntas.map((p) => {
    const respuesta = p.opciones[p.correctaIndex];
    if (esCompletable(respuesta) && Math.random() < 0.35) return "completar";
    return "opcion_multiple";
  });
}
