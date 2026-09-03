"use client";

import { Check } from "lucide-react";

export function OptionChip({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-14 w-full items-center justify-between rounded-lg border px-4 text-left font-body text-base font-medium transition-colors duration-200 ease-out active:scale-[0.98] ${
        selected
          ? "border-brand-primary bg-brand-primary-soft text-txt-primary"
          : "border-border-default bg-surface-primary text-txt-primary"
      }`}
    >
      {label}
      {selected && <Check className="h-5 w-5 shrink-0 text-brand-primary" strokeWidth={2.6} />}
    </button>
  );
}
