"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const preguntas = [
  {
    q: "¿Qué aprendo exactamente en cada país?",
    a: "No es solo el mapa. Cada país tiene 6 categorías reales: Geografía, Historia, Cultura, Gastronomía, Naturaleza y Deportes — su comida, su música, sus héroes, su fauna, sus campeones. Es el recorrido cultural completo de un país, no solo dónde queda.",
  },
  {
    q: "¿Por qué pagar si hay apps de trivia gratis?",
    a: "Porque esas apps son preguntas sueltas sin ningún hilo — hoy una capital, mañana una bandera, y ya. Conquesta te hace recorrer el mundo país por país, con las 6 categorías completas de cada uno: cuando conquistas Colombia, sabes de Colombia — no solo dónde está en el mapa.",
  },
  {
    q: "Ya pagué por países en otra app y me los quitaron al cambiar de modelo",
    a: "En Conquesta eso no pasa: lo que desbloqueas —en el plan gratis o en Pro— es tuyo para siempre, aunque canceles la suscripción más adelante.",
  },
  {
    q: "No tengo tiempo para aprender cultura general",
    a: "Cada nivel dura entre 3 y 5 minutos. Está pensado para la fila del banco o el bus, no para sentarte a estudiar — y al final de un país te llevas historia, gastronomía, naturaleza y deporte, no solo un dato suelto.",
  },
  {
    q: "¿Es muy cara para mi país?",
    a: "El plan Pro anual queda en $3.33 USD al mes — precio de lanzamiento pensado para el bolsillo LATAM, no para el mercado americano.",
  },
];

export function Faq() {
  const [abierta, setAbierta] = useState<number | null>(0);

  return (
    <section className="px-6 py-16 md:py-20">
      <div className="mx-auto max-w-2xl">
        <h2 className="text-center font-display text-2xl font-bold text-txt-primary md:text-3xl">
          Preguntas frecuentes
        </h2>
        <div className="mt-8 space-y-3">
          {preguntas.map((item, i) => {
            const abiertaActual = abierta === i;
            return (
              <div
                key={item.q}
                className="rounded-xl border border-border-default bg-surface-primary"
              >
                <button
                  type="button"
                  onClick={() => setAbierta(abiertaActual ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  aria-expanded={abiertaActual}
                >
                  <span className="font-display text-sm font-semibold text-txt-primary">
                    {item.q}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-txt-tertiary transition-transform duration-200 ease-out ${
                      abiertaActual ? "rotate-180" : ""
                    }`}
                    strokeWidth={2.2}
                  />
                </button>
                {abiertaActual && (
                  <p className="px-5 pb-4 text-sm leading-relaxed text-txt-secondary">{item.a}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
