"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import { Map, Swords, Trophy, User, Store } from "lucide-react";

const ITEMS = [
  { href: "/app", label: "Mapa", icon: Map },
  { href: "/app/retos", label: "Retos", icon: Swords },
  { href: "/app/ranking", label: "Ranking", icon: Trophy },
  { href: "/app/perfil", label: "Perfil", icon: User },
  { href: "/app/tienda", label: "Tienda", icon: Store },
];

/** Nav flotante estilo pastilla (pedido explícito del usuario, con imagen de
 * referencia): el item activo se eleva con una burbuja de color que se
 * desliza suavemente entre secciones (`layoutId` de Motion — "magic move"),
 * en vez del fondo plano de antes. Mismo set de íconos/labels/rutas. */
export function BottomNav() {
  const pathname = usePathname();
  const reducirMovimiento = useReducedMotion();

  return (
    <div className="sticky bottom-0 z-10 px-4 pb-[max(12px,env(safe-area-inset-bottom))] pt-2">
      <nav className="relative flex items-center justify-around rounded-full border border-border-default bg-surface-primary px-2 py-2 shadow-[0_10px_28px_rgba(15,23,42,0.14)]">
        {ITEMS.map(({ href, label, icon: Icon }) => {
          const active = href === "/app" ? pathname === "/app" : pathname.startsWith(href);
          return (
            <Link key={href} href={href} aria-label={label} className="relative flex flex-1 flex-col items-center">
              <motion.span
                className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
                animate={{ y: active && !reducirMovimiento ? -14 : 0 }}
                whileTap={{ scale: 0.88 }}
                transition={{ type: "spring", stiffness: 500, damping: 28 }}
              >
                {active && (
                  <motion.span
                    layoutId="nav-burbuja-activa"
                    className="absolute inset-0 rounded-full bg-brand-primary shadow-[0_6px_16px_rgba(59,125,232,0.45)]"
                    transition={reducirMovimiento ? { duration: 0 } : { type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
                <Icon
                  className={`relative h-5 w-5 transition-colors duration-150 ${active ? "text-white" : "text-txt-secondary"}`}
                  strokeWidth={active ? 2.6 : 2.2}
                />
              </motion.span>
              <span className={`mt-1 text-xs font-semibold ${active ? "text-brand-primary" : "text-txt-tertiary"}`}>
                {label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
