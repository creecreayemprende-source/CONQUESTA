export default function Reembolso() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16 text-sm leading-relaxed text-txt-secondary">
      <h1 className="font-display text-2xl font-bold text-txt-primary">
        Política de reembolso
      </h1>
      <p className="mt-6 text-xs text-txt-tertiary">
        Borrador inicial — pendiente de configurar el plazo real en Hotmart antes del
        lanzamiento (ver proceso interno 18-VENTA-HOTMART / 47).
      </p>

      <div className="mt-6 space-y-4">
        <p>
          La Garantía del Pasaporte Sellado: si dentro de los primeros 7 días de tu
          suscripción Pro sientes que no vale lo que pagaste, escríbenos a{" "}
          <a href="mailto:hola@conquesta.app" className="underline">
            hola@conquesta.app
          </a>{" "}
          y te devolvemos el 100% de tu pago, sin preguntas.
        </p>
        <p>
          El contenido que ya conquistaste en el plan gratis, o mientras tuviste Pro activo,
          se queda contigo aunque te reembolsemos o canceles.
        </p>
      </div>
    </main>
  );
}
