"use client";

import { motion, useReducedMotion } from "motion/react";
import type { Categoria } from "@/lib/onboarding-data";
import { CATEGORIA_ICONO } from "@/lib/category-style";

/** Un gesto de animación propio por categoría — sutil, en loop, con sentido para
 * el ícono (la montaña "respira", el balón rebota, la hoja se mece con el viento).
 * Duraciones desincronizadas a propósito para que las 6 no se muevan al unísono. */
const GESTO: Record<Categoria, Record<string, number[]>> = {
  Geografía: { y: [0, -3, 0] },
  Historia: { scale: [1, 1.05, 1] },
  Cultura: { rotate: [-6, 6, -6] },
  Gastronomía: { y: [0, -2, 0], scale: [1, 1.03, 1] },
  Naturaleza: { rotate: [-8, 8, -8] },
  Deportes: { y: [0, -5, 0] },
};

const DURACION: Record<Categoria, number> = {
  Geografía: 2.6,
  Historia: 2.2,
  Cultura: 2.4,
  Gastronomía: 2.8,
  Naturaleza: 3,
  Deportes: 1.1,
};

export function CategoryIcon({
  categoria,
  className,
  strokeWidth = 2.2,
}: {
  categoria: Categoria;
  className?: string;
  strokeWidth?: number;
}) {
  const Icon = CATEGORIA_ICONO[categoria];
  const reducirMovimiento = useReducedMotion();

  if (reducirMovimiento) {
    return <Icon className={className} strokeWidth={strokeWidth} />;
  }

  return (
    <motion.span
      className="inline-flex"
      animate={GESTO[categoria]}
      transition={{ duration: DURACION[categoria], repeat: Infinity, ease: "easeInOut" }}
    >
      <Icon className={className} strokeWidth={strokeWidth} />
    </motion.span>
  );
}
