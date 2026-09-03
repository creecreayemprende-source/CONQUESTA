export function VideoViaje() {
  return (
    <section className="bg-surface-secondary px-6 py-16 md:py-20">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="font-display text-2xl font-bold text-txt-primary md:text-3xl">
          Un viaje real por el mundo — no un mapa con preguntas
        </h2>
        <p className="mt-3 text-sm text-txt-secondary md:text-base">
          Cada país que conquistas amplía tu cultura general en 6 frentes: su geografía, su
          historia, su gente, su comida, su naturaleza y su deporte. Saber ubicarlo en el mapa
          es solo el primer paso.
        </p>

        <div className="mx-auto mt-8 w-full max-w-sm overflow-hidden rounded-2xl border border-border-default shadow-lg">
          <video
            src="/videos/avion-mundo.mp4"
            className="h-56 w-full object-cover"
            autoPlay
            loop
            muted
            playsInline
          />
        </div>
      </div>
    </section>
  );
}
