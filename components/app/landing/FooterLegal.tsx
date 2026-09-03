import Link from "next/link";

export function FooterLegal() {
  return (
    <footer className="border-t border-border-default px-6 py-10">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-4 text-center text-xs text-txt-tertiary md:flex-row md:justify-between md:text-left">
        <p>© {new Date().getFullYear()} Conquesta. Todos los derechos reservados.</p>
        <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
          <Link href="/privacidad" className="hover:text-txt-secondary">
            Privacidad
          </Link>
          <Link href="/terminos" className="hover:text-txt-secondary">
            Términos
          </Link>
          <Link href="/reembolso" className="hover:text-txt-secondary">
            Reembolsos
          </Link>
          <Link href="/aviso-ia" className="hover:text-txt-secondary">
            Aviso de IA
          </Link>
          <a href="mailto:hola@conquesta.app" className="hover:text-txt-secondary">
            Soporte
          </a>
        </nav>
      </div>
    </footer>
  );
}
