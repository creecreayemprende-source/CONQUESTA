import { Mountain, Landmark, Drama, Soup, Leaf, Volleyball } from "lucide-react";
import type { Categoria } from "./onboarding-data";

/** Ícono y color de cada categoría — calcados de las 6 piezas del logo (2026-08-23).
 * Único punto de verdad: lo usan la pantalla de país, la de ronda y el reto final,
 * para que el color de cada categoría "viva" en toda su experiencia de juego. */
export const CATEGORIA_ICONO: Record<Categoria, typeof Landmark> = {
  Geografía: Mountain,
  Historia: Landmark,
  Cultura: Drama,
  Gastronomía: Soup,
  Naturaleza: Leaf,
  Deportes: Volleyball,
};

export const CATEGORIA_COLOR: Record<Categoria, string> = {
  Geografía: "var(--cat-geografia)",
  Historia: "var(--cat-historia)",
  Cultura: "var(--cat-cultura)",
  Gastronomía: "var(--cat-gastronomia)",
  Naturaleza: "var(--cat-naturaleza)",
  Deportes: "var(--cat-deportes)",
};
