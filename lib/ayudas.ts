export type AyudaId = "cincuenta" | "tiempoExtra" | "pista";

export const AYUDAS_CONFIG: Record<AyudaId, { nombre: string; desc: string; costo: number; moneda: "coins" | "gems" }> = {
  cincuenta: { nombre: "50/50", desc: "Elimina 2 respuestas incorrectas de la pregunta actual", costo: 20, moneda: "coins" },
  tiempoExtra: { nombre: "+10 segundos", desc: "Suma 10 segundos al cronómetro de cualquier reto", costo: 15, moneda: "coins" },
  pista: { nombre: "Pista del explorador", desc: "Resalta la respuesta correcta antes de contestar", costo: 3, moneda: "gems" },
};
