import { Hourglass, Frown, MapPinOff, Undo2, Swords } from "lucide-react";

const preguntas = [
  {
    icon: Hourglass,
    texto: "¿Entras a redes 'un momentito' y cuando te das cuenta ya pasaron horas mirando contenido que no te dejó nada?",
  },
  {
    icon: MapPinOff,
    texto: "¿Te da cosa no poder ubicar un país en el mapa cuando sale en una serie o en las noticias?",
  },
  {
    icon: Frown,
    texto: "¿Probaste apps de trivia y eran solo un mapa aburrido con preguntas sueltas, sin ningún hilo?",
  },
  {
    icon: Undo2,
    texto: "¿Pagaste por desbloquear contenido en otra app y te lo quitaron al cambiar de modelo?",
  },
  {
    icon: Swords,
    texto: "¿Te gustaría retar a tus amigos y comprobar de una vez quién sabe más del mundo?",
  },
];

export function Problema() {
  return (
    <section className="px-6 py-16 md:py-20">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-center font-display text-2xl font-bold text-txt-primary md:text-3xl">
          ¿Te suena alguna de estas?
        </h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {preguntas.map(({ icon: Icon, texto }) => (
            <div
              key={texto}
              className="flex gap-4 rounded-xl border border-border-default bg-surface-primary p-5 shadow-sm"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-primary-soft text-brand-primary">
                <Icon className="h-5 w-5" strokeWidth={2.2} />
              </span>
              <p className="text-sm leading-relaxed text-txt-secondary">{texto}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
