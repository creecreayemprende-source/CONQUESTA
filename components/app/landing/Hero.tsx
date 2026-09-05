import Link from "next/link";
import { Compass, Flag, Globe2, Plane, Stamp, Swords, Trophy } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden px-6 pt-8 pb-14 md:pt-14 md:pb-20">
      <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
        <div className="flex items-center gap-2 rounded-full border border-border-default bg-surface-primary px-4 py-1.5 text-sm font-semibold text-brand-primary shadow-sm">
          <Compass className="h-4 w-4" strokeWidth={2.4} />
          Viaja, aprende y conquista el mundo
        </div>

        <h1 className="mt-6 font-display text-4xl font-extrabold leading-[1.1] tracking-tight text-txt-primary md:text-6xl">
          Conquista tu primer país en 5 minutos — sin anuncios
        </h1>

        <p className="mt-5 max-w-xl text-base text-txt-secondary md:text-lg">
          Recorre el mapa del mundo país por país — empiezas por América y vas desbloqueando
          el resto de continentes — con retos entretenidos de geografía, historia, cultura,
          gastronomía, naturaleza y deportes que hacen que el conocimiento se te quede de verdad.
        </p>

        <div className="mt-8 flex flex-col items-center gap-3">
          <Link
            href="/onboarding"
            className="inline-flex h-14 items-center justify-center rounded-lg bg-brand-primary px-8 font-display text-base font-bold text-white shadow-[0_10px_30px_rgba(59,125,232,0.35)] transition-transform duration-200 ease-out hover:-translate-y-0.5 hover:bg-brand-primary-hover active:translate-y-0"
          >
            Conquistar mi primer país gratis
          </Link>
          <span className="text-xs text-txt-tertiary">Sin tarjeta · resultado en 5 minutos</span>
        </div>

        <div className="mt-12 w-full max-w-sm rounded-2xl border border-border-default bg-surface-primary p-5 shadow-lg">
          <p className="text-xs font-semibold uppercase tracking-wide text-txt-tertiary">
            Mapa Mundial · América
          </p>
          <div className="mt-3 flex items-center justify-between text-sm">
            <span className="font-semibold text-txt-primary">Tu progreso mundial</span>
            <span className="font-display text-xl font-extrabold text-brand-primary">23%</span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-surface-secondary">
            <div className="h-full w-[23%] rounded-full bg-brand-primary" />
          </div>

          {/* Ruta de vuelo + timbres de pasaporte (dispositivo ownable de FICHA-ARTE.md) */}
          <div className="relative mt-5 flex items-center justify-between px-1">
            <div className="absolute left-4 right-4 top-1/2 h-0.5 -translate-y-1/2 border-t-2 border-dashed border-brand-primary/40" />
            <span className="relative flex h-7 w-7 items-center justify-center rounded-full bg-status-success text-white ring-4 ring-surface-primary">
              <Stamp className="h-3.5 w-3.5" strokeWidth={2.4} />
            </span>
            <span className="relative flex h-7 w-7 items-center justify-center rounded-full bg-status-success text-white ring-4 ring-surface-primary">
              <Stamp className="h-3.5 w-3.5" strokeWidth={2.4} />
            </span>
            <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-brand-primary text-white ring-4 ring-surface-primary">
              <Plane className="h-4 w-4" strokeWidth={2.4} />
            </span>
            <span className="relative flex h-7 w-7 items-center justify-center rounded-full bg-status-locked text-txt-tertiary ring-4 ring-surface-primary">
              <Flag className="h-3.5 w-3.5" strokeWidth={2.2} />
            </span>
          </div>
          <p className="mt-3 text-center text-xs text-txt-tertiary">
            Europa, Asia, África y Oceanía se van desbloqueando a medida que avanzas
          </p>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-txt-secondary">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-primary-soft text-brand-primary">
              <Globe2 className="h-4 w-4" strokeWidth={2.4} />
            </span>
            6 categorías por país
          </div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-primary-soft text-brand-primary">
              <Trophy className="h-4 w-4" strokeWidth={2.4} />
            </span>
            Países que conquistas para siempre
          </div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-primary-soft text-brand-primary">
              <Swords className="h-4 w-4" strokeWidth={2.4} />
            </span>
            Reta a tus amigos y mide tu nivel
          </div>
        </div>
      </div>
    </section>
  );
}
