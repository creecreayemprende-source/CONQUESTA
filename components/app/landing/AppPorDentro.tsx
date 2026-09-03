"use client";

import { useState } from "react";
import { Mountain, Landmark, Drama, Soup, Check, Lock, Plane, Stamp } from "lucide-react";

const CATEGORIAS = [
  { nombre: "Geografía", Icono: Mountain, color: "bg-[color:var(--cat-geografia)]" },
  { nombre: "Historia", Icono: Landmark, color: "bg-[color:var(--cat-historia)]" },
  { nombre: "Cultura", Icono: Drama, color: "bg-[color:var(--cat-cultura)]" },
  { nombre: "Gastronomía", Icono: Soup, color: "bg-[color:var(--cat-gastronomia)]" },
];

/** Mini-mockup del Mapa: 2 rutas (una en progreso, una bloqueada). */
function MockMapa() {
  return (
    <div className="flex w-full flex-col gap-2 px-4">
      <p className="text-left text-xs font-semibold uppercase tracking-wide text-txt-tertiary">Tu progreso mundial</p>
      <div className="h-2 w-full overflow-hidden rounded-full bg-surface-secondary">
        <div className="h-full w-1/3 rounded-full bg-brand-primary" />
      </div>
      <div className="mt-2 rounded-xl bg-[linear-gradient(135deg,var(--ruta-andino-a),var(--ruta-andino-b))] p-3 text-left text-white">
        <p className="text-xs font-bold">Ruta 1: Origen Andino</p>
        <p className="text-xs opacity-80">COL ✈ PER ✈ CHL</p>
      </div>
      <div className="rounded-xl bg-[repeating-linear-gradient(135deg,var(--ruta-bloqueada-a),var(--ruta-bloqueada-a)_8px,var(--ruta-bloqueada-b)_8px,var(--ruta-bloqueada-b)_16px)] p-3 text-left text-white/70">
        <p className="text-xs font-bold">Ruta 2: Ritmo y Trópico</p>
        <p className="text-xs">Bloqueada</p>
      </div>
    </div>
  );
}

/** Mini-mockup de la pantalla de país: hero + grid de categorías. */
function MockPais() {
  return (
    <div className="flex w-full flex-col gap-3 px-4">
      <div className="rounded-lg bg-[linear-gradient(135deg,var(--ruta-andino-a),var(--ruta-andino-b))] px-3 py-4 text-left text-white">
        <p className="font-display text-sm font-extrabold">Colombia</p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {CATEGORIAS.map(({ nombre, Icono, color }) => (
          <div key={nombre} className="flex flex-col items-center gap-1 rounded-lg border border-border-default bg-surface-primary py-2.5">
            <span className={`flex h-7 w-7 items-center justify-center rounded-full text-white ${color}`}>
              <Icono className="h-3.5 w-3.5" strokeWidth={2.2} />
            </span>
            <span className="text-xs font-medium text-txt-primary">{nombre}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Mini-mockup del resultado del Reto Final: victoria + timbre nuevo. */
function MockRetoFinal() {
  return (
    <div className="flex w-full flex-col items-center gap-3 px-4 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-status-success text-white">
        <Check className="h-7 w-7" strokeWidth={3} />
      </span>
      <p className="font-display text-sm font-bold text-txt-primary">¡Colombia conquistada!</p>
      <div className="flex items-center gap-2 rounded-full bg-gold-soft px-3 py-1.5 text-xs font-semibold text-txt-primary">
        <Stamp className="h-3.5 w-3.5 text-gold" strokeWidth={2.2} />
        Nuevo timbre en tu pasaporte
      </div>
    </div>
  );
}

/** Mini-mockup del pasaporte: grid de sellos, algunos conquistados/bloqueados. */
function MockPasaporte() {
  const paises = [
    { c: "COL", estado: "conquistado" },
    { c: "PER", estado: "desbloqueado" },
    { c: "CHL", estado: "bloqueado" },
    { c: "BRA", estado: "bloqueado" },
  ];
  return (
    <div className="grid w-full grid-cols-4 gap-3 px-4">
      {paises.map((p) => (
        <div key={p.c} className="flex flex-col items-center gap-1">
          <span
            className={`flex h-11 w-11 items-center justify-center rounded-full text-xs font-bold ${
              p.estado === "conquistado"
                ? "border-2 border-dashed border-brand-primary text-brand-primary"
                : "bg-surface-secondary text-txt-tertiary"
            }`}
          >
            {p.estado === "bloqueado" ? <Lock className="h-3.5 w-3.5" strokeWidth={2.2} /> : p.c}
          </span>
        </div>
      ))}
    </div>
  );
}

const pantallas = [
  { nombre: "El mapa mundial", Mock: MockMapa },
  { nombre: "La página de tu país", Mock: MockPais },
  { nombre: "Reto final del país", Mock: MockRetoFinal },
  { nombre: "Tu pasaporte de conquistas", Mock: MockPasaporte },
];

export function AppPorDentro() {
  const [activa, setActiva] = useState(0);
  const Activa = pantallas[activa].Mock;

  return (
    <section className="bg-surface-secondary px-6 py-16 md:py-20">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="font-display text-2xl font-bold text-txt-primary md:text-3xl">Conquesta por dentro</h2>
        <p className="mt-3 text-sm text-txt-secondary">Así se ve recorrer tu primer país.</p>

        <div className="mx-auto mt-8 w-full max-w-xs">
          <div className="flex aspect-[9/16] flex-col items-center justify-center gap-3 rounded-xl border border-border-strong bg-surface-primary py-6 shadow-lg">
            <Plane className="h-5 w-5 shrink-0 text-brand-primary" strokeWidth={2.2} />
            <p className="font-display text-sm font-semibold text-txt-primary">{pantallas[activa].nombre}</p>
            <Activa />
          </div>

          <div className="mt-4 flex items-center justify-center gap-2">
            {pantallas.map((p, i) => (
              <button
                key={p.nombre}
                type="button"
                aria-label={`Ver ${p.nombre}`}
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
