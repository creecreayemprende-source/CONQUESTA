import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function MiniCta({ texto = "Conquistar mi primer país gratis" }: { texto?: string }) {
  return (
    <div className="flex justify-center px-6 pb-2">
      <Link
        href="/onboarding"
        className="inline-flex h-12 items-center gap-2 rounded-lg bg-brand-primary px-6 font-display text-sm font-bold text-white transition-transform duration-200 ease-out hover:-translate-y-0.5"
      >
        {texto}
        <ArrowRight className="h-4 w-4" strokeWidth={2.4} />
      </Link>
    </div>
  );
}
