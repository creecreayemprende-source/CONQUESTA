import Link from "next/link";
import { Check } from "lucide-react";

const stack = [
  { texto: "Todos los países de América y los continentes que se liberen", valor: "$9/mes" },
  { texto: "Ayudas (50/50) ilimitadas", valor: "$4/mes" },
  { texto: "Sin límite de vidas en el reto contra reloj", valor: "$4/mes" },
  { texto: "Lo que desbloqueas es tuyo para siempre", valor: "invaluable" },
];

const featuresFree = [
  "Colombia completo, tu primer país",
  "Retos 1v1 ilimitados por WhatsApp",
  "1 ayuda 50/50 gratis al día",
  "Cero anuncios de terceros",
];

const featuresPro = [
  "Todos los países de América",
  "Continentes nuevos apenas se liberan",
  "Ayudas ilimitadas",
  "Sin límite de vidas en el reto final",
  "7 días de prueba gratis",
];

export function Oferta() {
  return (
    <section id="precios" className="px-6 py-16 md:py-20">
      <div className="mx-auto max-w-4xl">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="font-display text-2xl font-bold text-txt-primary md:text-3xl">
            Empieza gratis. Sigue conquistando cuando quieras más.
          </h2>
          <p className="mt-3 text-sm text-txt-secondary">
            Con Pro desbloqueas esto — y es tuyo para siempre:
          </p>
        </div>

        <div className="mx-auto mt-6 max-w-md space-y-2 rounded-2xl border border-border-default bg-surface-primary p-5">
          {stack.map((item) => (
            <div key={item.texto} className="flex items-center justify-between gap-4 text-sm">
              <div className="flex items-center gap-2 text-txt-secondary">
                <Check className="h-4 w-4 shrink-0 text-status-success" strokeWidth={2.5} />
                {item.texto}
              </div>
              <span className="shrink-0 tabular font-semibold text-txt-tertiary">{item.valor}</span>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-6 flex max-w-md items-center justify-center gap-2 rounded-full bg-brand-primary-soft px-4 py-2 text-center text-xs font-semibold text-brand-primary">
          Precio de lanzamiento — sube más adelante, tú lo conservas para siempre
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-border-default bg-surface-primary p-6">
            <h3 className="font-display text-lg font-bold text-txt-primary">Gratis</h3>
            <p className="mt-1 text-sm text-txt-secondary">Para empezar tu viaje</p>
            <p className="mt-4 font-display text-3xl font-extrabold text-txt-primary">$0</p>
            <ul className="mt-5 space-y-2.5">
              {featuresFree.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-txt-secondary">
                  <Check className="h-4 w-4 shrink-0 text-status-success" strokeWidth={2.5} />
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href="/onboarding"
              className="mt-6 flex h-12 items-center justify-center rounded-lg border border-border-strong font-display text-sm font-bold text-txt-primary transition-colors duration-200 ease-out hover:bg-surface-secondary"
            >
              Conquistar gratis
            </Link>
          </div>

          <div className="relative rounded-2xl border-2 border-brand-primary bg-surface-primary p-6 shadow-lg">
            <span className="absolute -top-3 left-6 rounded-full bg-brand-primary px-3 py-1 text-xs font-bold text-white">
              Recomendado
            </span>
            <h3 className="font-display text-lg font-bold text-txt-primary">Pro anual</h3>
            <p className="mt-1 text-sm text-txt-secondary">Facturado una vez al año</p>
            <p className="mt-4 font-display text-3xl font-extrabold text-txt-primary tabular">
              $3.33<span className="text-base font-medium text-txt-tertiary">/mes</span>
            </p>
            <p className="text-xs text-txt-tertiary">Se cobra $39.99/año · ahorras 2 meses</p>
            <ul className="mt-5 space-y-2.5">
              {featuresPro.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-txt-secondary">
                  <Check className="h-4 w-4 shrink-0 text-status-success" strokeWidth={2.5} />
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href="/onboarding"
              className="mt-6 flex h-12 items-center justify-center rounded-lg bg-brand-primary font-display text-sm font-bold text-white transition-colors duration-200 ease-out hover:bg-brand-primary-hover"
            >
              Conquistar gratis
            </Link>
            <p className="mt-3 text-center text-xs text-txt-tertiary">
              También disponible mensual: $3.99/mes
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
