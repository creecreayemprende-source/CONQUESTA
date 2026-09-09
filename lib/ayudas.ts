export type AyudaId = "cincuenta" | "tiempoExtra" | "pista";

export const AYUDAS_CONFIG: Record<AyudaId, { nombre: string; desc: string; costo: number; moneda: "coins" | "gems" }> = {
  cincuenta: { nombre: "50/50", desc: "Elimina 2 respuestas incorrectas de la pregunta actual", costo: 20, moneda: "coins" },
  tiempoExtra: { nombre: "+10 segundos", desc: "Suma 10 segundos al cronómetro de cualquier reto", costo: 15, moneda: "coins" },
  // Antes costaba 3 gemas — con la Gemas reservadas para "Acelerar con Gemas"
  // (20 gemas), pedirle gemas a esta ayuda competía con ese único uso real.
  // Ahora paga en monedas, como las otras 2 (más cara que el 50/50 porque
  // resuelve la pregunta entera, no solo elimina 2 opciones).
  pista: { nombre: "Pista del explorador", desc: "Resalta la respuesta correcta antes de contestar", costo: 25, moneda: "coins" },
};
