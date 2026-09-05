import { Coins } from "lucide-react";

/** Saldo actual de monedas (lo que hay para gastar en la Tienda) — visible en
 * cada pantalla de preguntas para que el usuario sepa con cuánto cuenta antes
 * de comprar una ayuda a mitad de un reto. Distinto de "monedas ganadas en
 * total" del Ranking (ese nunca baja; este sí, al gastar). */
export function SaldoMonedas({ monedas }: { monedas: number }) {
  return (
    <span className="flex shrink-0 items-center gap-1 rounded-full bg-gold-soft px-2.5 py-1 text-xs font-bold tabular text-txt-primary">
      <Coins className="h-3.5 w-3.5 text-gold" strokeWidth={2.4} />
      {monedas}
    </span>
  );
}
