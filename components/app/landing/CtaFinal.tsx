import Link from "next/link";

export function CtaFinal() {
  return (
    <section className="bg-brand-primary px-6 py-16 text-center md:py-20">
      <div className="mx-auto max-w-xl">
        <h2 className="font-display text-2xl font-bold text-white md:text-3xl">
          Imagina abrir tu pasaporte y ver los países que ya conquistaste
        </h2>
        <p className="mt-4 text-base leading-relaxed text-white/85">
          Eso es lo que se siente ser la persona que de verdad conoce el mundo — sin haber
          viajado todavía a todos lados. Solo minutos al día, con Conquesta.
        </p>

        <Link
          href="/onboarding"
          className="mt-8 inline-flex h-14 items-center justify-center rounded-lg bg-white px-8 font-display text-base font-bold text-brand-primary transition-transform duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0"
        >
          Conquistar mi primer país gratis
        </Link>

        <p className="mx-auto mt-8 max-w-md text-xs leading-relaxed text-white/70">
          PS: Conquesta convierte aprender del mundo en un viaje real con el Pasaporte de
          Conquista. Empiezas gratis hoy; si quieres todo el mapa, Pro cuesta desde $3.33/mes
          con 7 días de prueba y la Garantía del Pasaporte Sellado.
        </p>
      </div>
    </section>
  );
}
