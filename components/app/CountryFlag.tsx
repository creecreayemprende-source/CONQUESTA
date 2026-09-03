"use client";

import { motion, useReducedMotion } from "motion/react";
import { COLOMBIA_FLAG, CHILE_FLAG, PERU_FLAG } from "@/lib/flag-colors";

type FlagKey = "Colombia" | "Perú" | "Chile";
type SvgProps = { className?: string; ajuste: "xMidYMid slice" | "xMidYMid meet" };

function ColombiaSvg({ className, ajuste }: SvgProps) {
  return (
    <svg viewBox="0 0 3 2" preserveAspectRatio={ajuste} className={className} aria-hidden="true">
      <rect width="3" height="1" y="0" fill={COLOMBIA_FLAG.amarillo} />
      <rect width="3" height="0.5" y="1" fill={COLOMBIA_FLAG.azul} />
      <rect width="3" height="0.5" y="1.5" fill={COLOMBIA_FLAG.rojo} />
    </svg>
  );
}

function ChileSvg({ className, ajuste }: SvgProps) {
  return (
    <svg viewBox="0 0 3 2" preserveAspectRatio={ajuste} className={className} aria-hidden="true">
      <rect width="3" height="1" y="0" fill={CHILE_FLAG.blanco} />
      <rect width="3" height="1" y="1" fill={CHILE_FLAG.rojo} />
      <rect width="1" height="1" y="0" fill={CHILE_FLAG.azul} />
      <polygon
        fill={CHILE_FLAG.blanco}
        points="0.5,0.18 0.576,0.395 0.804,0.401 0.624,0.54 0.688,0.759 0.5,0.63 0.312,0.759 0.376,0.54 0.196,0.401 0.424,0.395"
      />
    </svg>
  );
}

function PeruSvg({ className, ajuste }: SvgProps) {
  return (
    <svg viewBox="0 0 3 2" preserveAspectRatio={ajuste} className={className} aria-hidden="true">
      <rect width="1" height="2" x="0" fill={PERU_FLAG.rojo} />
      <rect width="1" height="2" x="1" fill={PERU_FLAG.blanco} />
      <rect width="1" height="2" x="2" fill={PERU_FLAG.rojo} />
    </svg>
  );
}

const BANDERAS: Record<FlagKey, (p: SvgProps) => React.JSX.Element> = {
  Colombia: ColombiaSvg,
  Perú: PeruSvg,
  Chile: ChileSvg,
};

const COLOR_FONDO: Record<FlagKey, string> = {
  Colombia: COLOMBIA_FLAG.azul,
  Perú: PERU_FLAG.rojo,
  Chile: CHILE_FLAG.rojo,
};

/** ¿Ya existe una bandera real construida para este país? (hoy: Ruta 1). */
export function paisTieneBandera(pais: string): boolean {
  return pais in BANDERAS;
}

/** Bandera real (SVG, proporciones y colores oficiales) con una ondulación sutil
 * tipo "banderín al viento" — pedido explícito del usuario (2026-08-23), en vez
 * del círculo de color plano que había antes. Respeta prefers-reduced-motion.
 *
 * `ajuste="cubrir"` (por defecto): recorta para llenar el contenedor — para los
 * íconos circulares pequeños de las listas, donde un recorte se ve bien (como
 * una foto de perfil). `ajuste="contener"`: la bandera COMPLETA siempre visible,
 * centrada, sin recortar — para la franja/banner grande donde el usuario pidió
 * ver la bandera entera (antes quedaba cortada en "cubrir"). */
export function CountryFlag({
  pais,
  className,
  animar = true,
  ajuste = "cubrir",
}: {
  pais: string;
  className?: string;
  animar?: boolean;
  ajuste?: "cubrir" | "contener";
}) {
  const reducirMovimiento = useReducedMotion();
  const Svg = BANDERAS[pais as FlagKey];
  if (!Svg) return null;
  const preserveAspectRatio = ajuste === "contener" ? "xMidYMid meet" : "xMidYMid slice";

  if (!animar || reducirMovimiento) {
    return (
      <div className={className} style={{ backgroundColor: COLOR_FONDO[pais as FlagKey] }}>
        <Svg className="h-full w-full" ajuste={preserveAspectRatio} />
      </div>
    );
  }

  return (
    <div className={className} style={{ perspective: 300, backgroundColor: COLOR_FONDO[pais as FlagKey] }}>
      <motion.div
        style={{ height: "100%", width: "100%" }}
        animate={{ rotateY: [0, 9, 0, -7, 0], skewY: [0, 0.6, -0.5, 0.3, 0] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
      >
        <Svg className="h-full w-full" ajuste={preserveAspectRatio} />
      </motion.div>
    </div>
  );
}
