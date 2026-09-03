import { ShieldCheck, Mail, Infinity as InfinityIcon } from "lucide-react";

const puntos = [
  { icon: Mail, texto: "Un correo, sin preguntas, y te devolvemos todo." },
  { icon: InfinityIcon, texto: "Lo que ya conquistaste gratis, siempre queda tuyo." },
];

export function Garantia() {
  return (
    <section className="bg-surface-secondary px-6 py-16 md:py-20">
      <div className="mx-auto flex max-w-xl flex-col items-center text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-primary-soft text-brand-primary">
          <ShieldCheck className="h-7 w-7" strokeWidth={2} />
        </span>
        <h2 className="mt-5 font-display text-2xl font-bold text-txt-primary">
          La Garantía del Pasaporte Sellado
        </h2>
        <p className="mt-4 text-base font-semibold text-txt-primary">
          7 días para probar Pro. Si no te convence, te devolvemos el 100%.
        </p>

        <div className="mt-6 grid w-full gap-3 sm:grid-cols-2">
          {puntos.map(({ icon: Icon, texto }) => (
            <div
              key={texto}
              className="flex items-center gap-3 rounded-xl border border-border-default bg-surface-primary p-4 text-left"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-primary-soft text-brand-primary">
                <Icon className="h-4 w-4" strokeWidth={2.2} />
              </span>
              <p className="text-sm text-txt-secondary">{texto}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
