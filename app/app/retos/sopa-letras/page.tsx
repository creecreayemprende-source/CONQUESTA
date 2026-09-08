import Link from "next/link";
import { ChevronLeft, Search } from "lucide-react";
import { TEMAS_SOPA_LETRAS } from "@/lib/sopa-letras-data";

export default function SopaLetrasTemasPage() {
  return (
    <div className="flex min-h-dvh flex-col px-4 pt-4">
      <div className="flex items-center gap-2">
        <Link
          href="/app/retos"
          aria-label="Volver a Retos"
          className="flex h-11 w-11 items-center justify-center rounded-full text-txt-secondary"
        >
          <ChevronLeft className="h-5 w-5" strokeWidth={2.4} />
        </Link>
        <h1 className="font-display text-lg font-bold text-txt-primary">Explora y Descubre</h1>
      </div>
      <p className="mt-1 px-1 text-sm text-txt-secondary">
        Elige un tema y encuentra sus palabras escondidas — al terminar te llevas un dato curioso real.
      </p>

      <div className="mt-4 flex flex-col gap-2.5 pb-4">
        {TEMAS_SOPA_LETRAS.map((t) => (
          <Link
            key={t.tema}
            href={`/app/retos/sopa-letras/${encodeURIComponent(t.tema)}`}
            className="flex items-center gap-3 rounded-xl border border-border-default bg-surface-primary p-3.5 shadow-sm"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-primary-soft text-brand-primary">
              <Search className="h-5 w-5" strokeWidth={2.2} />
            </span>
            <div className="flex-1">
              <p className="font-display text-sm font-bold text-txt-primary">{t.tema}</p>
              <p className="text-xs text-txt-tertiary">7 palabras para descubrir</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
