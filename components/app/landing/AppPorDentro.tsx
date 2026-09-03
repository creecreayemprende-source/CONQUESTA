"use client";

import { useState } from "react";
import { Camera } from "lucide-react";

const pantallas = [
  "El mapa mundial",
  "La página de tu país",
  "Reto final del país",
  "Tu pasaporte de conquistas",
];

export function AppPorDentro() {
  const [activa, setActiva] = useState(0);
  const [, setPausado] = useState(false);

  return (
    <section className="bg-surface-secondary px-6 py-16 md:py-20">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="font-display text-2xl font-bold text-txt-primary md:text-3xl">
          Conquesta por dentro
        </h2>
        <p className="mt-3 text-sm text-txt-secondary">
          La app está en construcción — estas son las pantallas que vienen en la Sesión 5.
        </p>

        <div
          className="mx-auto mt-8 w-full max-w-xs"
          onMouseEnter={() => setPausado(true)}
          onMouseLeave={() => setPausado(false)}
          onTouchStart={() => setPausado(true)}
        >
          <div className="flex aspect-[9/16] items-center justify-center rounded-xl border border-border-strong bg-surface-primary shadow-lg">
            <div className="flex flex-col items-center gap-3 px-6 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-secondary text-txt-tertiary">
                <Camera className="h-5 w-5" strokeWidth={2} />
              </span>
              <p className="font-display text-sm font-semibold text-txt-primary">
                {pantallas[activa]}
              </p>
              <p className="text-xs text-txt-tertiary">Captura real — pendiente (Sesión 5)</p>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-center gap-2">
            {pantallas.map((p, i) => (
              <button
                key={p}
                type="button"
                aria-label={`Ver ${p}`}
                onClick={() => setActiva(i)}
                className={`h-2 rounded-full transition-[width,background-color] duration-200 ease-out ${
                  i === activa ? "w-6 bg-brand-primary" : "w-2 bg-border-strong"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
