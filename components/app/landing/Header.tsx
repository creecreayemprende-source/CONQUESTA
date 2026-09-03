import Image from "next/image";
import Link from "next/link";

/** Barra superior de la landing — antes no existía ninguna (la página iba
 * directo al Hero). Con el isotipo real ya disponible, se agrega esta franja
 * mínima de marca (logo + wordmark) en vez de dejarlo sin usar aquí. */
export function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-border-default bg-surface-primary/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
        <Link href="/" className="flex items-center gap-2.5 font-display text-lg font-extrabold text-txt-primary">
          <Image src="/logo/conquesta-logo.png" alt="Conquesta" width={44} height={49} className="h-11 w-auto" priority />
          Conquesta
        </Link>
        <Link href="/login" className="text-sm font-semibold text-txt-secondary transition-colors duration-150 hover:text-brand-primary">
          Iniciar sesión
        </Link>
      </div>
    </header>
  );
}
