export default function AvisoIA() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16 text-sm leading-relaxed text-txt-secondary">
      <h1 className="font-display text-2xl font-bold text-txt-primary">Aviso sobre el uso de IA</h1>
      <p className="mt-6 text-xs text-txt-tertiary">
        Borrador inicial — pendiente de revisión legal completa antes del lanzamiento (ver
        proceso interno 47-LEGAL-FISCAL-Y-PRIVACIDAD).
      </p>

      <div className="mt-6 space-y-4">
        <p>
          Las preguntas de Geografía se generan directamente desde fuentes de datos oficiales
          (capitales, fronteras, ríos, montañas). Las preguntas de Historia, Cultura,
          Gastronomía y Naturaleza se generan con ayuda de inteligencia artificial y se
          verifican automáticamente contra una fuente citable antes de publicarse — cada
          pregunta muestra su fuente y fecha de verificación.
        </p>
        <p>
          Si encuentras un dato que parece incorrecto o desactualizado, repórtalo desde la
          app o escríbenos a{" "}
          <a href="mailto:hola@conquesta.app" className="underline">
            hola@conquesta.app
          </a>
          .
        </p>
        <p>
          Conquesta no ofrece asesoría profesional de ningún tipo. El contenido es de cultura
          general con fines educativos y de entretenimiento.
        </p>
      </div>
    </main>
  );
}
