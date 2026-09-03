import { Hourglass, Frown, Undo2 } from "lucide-react";

const puntos = [
  {
    icon: Hourglass,
    texto: "Ese \"momentito\" en redes se hace horas — y no queda nada para mostrar.",
  },
  {
    icon: Frown,
    texto: "Las apps de geografía gratis son solo un mapa y preguntas sueltas.",
  },
  {
    icon: Undo2,
    texto: "Las de pago a veces te quitan lo que ya habías desbloqueado, sin avisar.",
  },
];

export function Agitacion() {
  return (
    <section className="bg-surface-secondary px-6 py-16 md:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-display text-2xl font-bold text-txt-primary md:text-3xl">
          Y cada semana que pasa, el mundo te sigue quedando grande
        </h2>

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {puntos.map(({ icon: Icon, texto }) => (
            <div
              key={texto}
              className="flex flex-col items-center gap-3 rounded-xl border border-border-default bg-surface-primary p-4 text-center"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-primary-soft text-brand-primary">
                <Icon className="h-5 w-5" strokeWidth={2.2} />
              </span>
              <p className="text-sm leading-snug text-txt-secondary">{texto}</p>
            </div>
          ))}
        </div>

        <p className="mt-8 text-base font-semibold text-txt-primary md:text-lg">
          Ninguna te hace sentir que recorres el mundo de verdad — ni te deja retar a tus
          amigos para comprobarlo.
        </p>
      </div>
    </section>
  );
}
