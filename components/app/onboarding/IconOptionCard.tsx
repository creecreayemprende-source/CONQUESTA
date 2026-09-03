"use client";

import { Check } from "lucide-react";
import type { LucideIcon } from "lucide-react";

/** Tarjeta de selección con ícono — para las preguntas de personalización
 * (motivación, categorías favoritas). Sombra suave + estado seleccionado
 * destacado, tal como pide el nuevo onboarding sobre fondo claro. */
export function IconOptionCard({
  icon: Icon,
  label,
  selected,
  onClick,
  colorVar,
}: {
  icon: LucideIcon;
  label: string;
  selected: boolean;
  onClick: () => void;
  colorVar?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex flex-col items-center gap-2 rounded-xl border p-4 text-center shadow-sm transition-colors duration-200 ease-out active:scale-[0.98] ${
        selected ? "border-brand-primary bg-brand-primary-soft" : "border-border-default bg-surface-primary"
      }`}
    >
      {selected && (
        <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-brand-primary text-white">
          <Check className="h-3 w-3" strokeWidth={3} />
        </span>
      )}
      <span
        className="flex h-11 w-11 items-center justify-center rounded-full text-white"
        style={{ backgroundColor: colorVar ?? "var(--brand-primary)" }}
      >
        <Icon className="h-5 w-5" strokeWidth={2.2} />
      </span>
      <span className="text-sm font-semibold text-txt-primary">{label}</span>
    </button>
  );
}
