export default function Privacidad() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16 text-sm leading-relaxed text-txt-secondary">
      <h1 className="font-display text-2xl font-bold text-txt-primary">Política de privacidad</h1>
      <p className="mt-6 text-xs text-txt-tertiary">
        Borrador inicial — pendiente de revisión legal completa antes del lanzamiento (ver
        proceso interno 47-LEGAL-FISCAL-Y-PRIVACIDAD).
      </p>

      <div className="mt-6 space-y-4">
        <p>
          Guardamos los datos mínimos para que Conquesta funcione: tu correo, tu nombre de
          perfil, tu progreso por país y categoría, y tu historial de retos. Nunca vendemos
          tus datos a terceros.
        </p>
        <p>
          Tu correo de compra en Hotmart se usa únicamente para activar y mantener tu plan
          Pro.
        </p>
        <p>
          Puedes pedir la eliminación completa de tu cuenta y tus datos escribiendo a{" "}
          <a href="mailto:hola@conquesta.app" className="underline">
            hola@conquesta.app
          </a>
          .
        </p>
      </div>
    </main>
  );
}
