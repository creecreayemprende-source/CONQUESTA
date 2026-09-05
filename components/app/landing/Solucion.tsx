import { Plane, Swords, Stamp } from "lucide-react";

const pasos = [
  {
    numero: 1,
    icon: Plane,
    titulo: "Eliges un país en el mapa",
    texto: "Recorres el mundo continente por continente — empiezas por América.",
  },
  {
    numero: 2,
    icon: Swords,
    titulo: "Superas sus retos de cultura real",
    texto: "Geografía, Historia, Cultura, Gastronomía, Naturaleza y Deportes — retos de 3-5 minutos, entretenidos de verdad (no memorizar tarjetas), así el conocimiento se te queda. Además, retas a tus amigos y comparas quién sabe más.",
  },
  {
    numero: 3,
    icon: Stamp,
    titulo: "Conquistas el país para siempre",
    texto: "Tu pasaporte se sella — lo que desbloqueas es tuyo para siempre, nunca te lo quitamos.",
  },
];

export function Solucion() {
  return (
    <section className="px-6 py-16 md:py-20">
      <div className="mx-auto max-w-4xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-2xl font-bold text-txt-primary md:text-3xl">
            No te faltaba disciplina — te faltaba una forma real de recorrer el mundo
          </h2>
          <p className="mt-4 text-base leading-relaxed text-txt-secondary md:text-lg">
            El <strong className="text-txt-primary">Pasaporte de Conquista</strong> convierte
            aprender del mundo en un viaje real, país por país — sin anuncios, sin quitarte
            lo que ya ganaste.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {pasos.map(({ numero, icon: Icon, titulo, texto }) => (
            <div
              key={numero}
              className="relative rounded-2xl border border-border-default bg-surface-primary p-6 shadow-sm"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-primary font-display text-sm font-bold text-white">
                {numero}
              </span>
              <span className="mt-4 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-primary-soft text-brand-primary">
                <Icon className="h-5 w-5" strokeWidth={2.2} />
              </span>
              <h3 className="mt-4 font-display text-base font-bold text-txt-primary">{titulo}</h3>
              <p className="mt-2 text-sm leading-relaxed text-txt-secondary">{texto}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
