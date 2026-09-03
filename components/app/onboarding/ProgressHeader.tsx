"use client";

import { ChevronLeft } from "lucide-react";

export function ProgressHeader({
  pct,
  onBack,
}: {
  pct: number;
  onBack?: () => void;
}) {
  return (
    <div className="flex items-center gap-3 px-4 pt-4">
      <button
        type="button"
        onClick={onBack}
        aria-label="Volver"
        disabled={!onBack}
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-txt-secondary transition-colors duration-200 ease-out disabled:opacity-0"
      >
        <ChevronLeft className="h-5 w-5" strokeWidth={2.4} />
      </button>
      <div className="h-1 flex-1 overflow-hidden rounded-full bg-border-default">
        <div
          className="h-full rounded-full bg-brand-primary transition-[width] duration-300 ease-out"
          style={{ width: `${Math.max(pct, 6)}%` }}
        />
      </div>
      <span className="w-9 shrink-0 text-right text-xs font-semibold tabular text-txt-tertiary">
        {Math.round(pct)}%
      </span>
    </div>
  );
}
