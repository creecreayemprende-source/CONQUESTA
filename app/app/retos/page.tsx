"use client";

import Link from "next/link";
import { useAppState } from "@/lib/app-state-context";
import { Send, Swords } from "lucide-react";

export default function RetosPage() {
  const { ready } = useAppState();

  if (!ready) {
    return (
      <div className="flex flex-col gap-3 px-4 pt-4">
        <div className="h-8 w-32 animate-pulse rounded-lg bg-surface-secondary" />
        <div className="h-24 animate-pulse rounded-xl bg-surface-secondary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 px-4 pt-4">
      <div>
        <h1 className="font-display text-xl font-bold text-txt-primary">Retos</h1>
        <p className="text-sm text-txt-secondary">Compara tu nivel con tus amigos</p>
      </div>

      <Link
        href="/app/retos/desafio"
        className="flex flex-col items-center gap-2 rounded-xl bg-brand-primary p-4 text-center shadow-md"
      >
        <span className="flex items-center gap-2 font-display text-base font-bold text-white">
          <Send className="h-4 w-4" strokeWidth={2.2} />
          Reto de Cultura General
        </span>
        <p className="text-xs text-white/85">
          20 preguntas, contra tu propio cronómetro — reta a un amigo por WhatsApp al terminar
        </p>
      </Link>

      {/* Retos 1 a 1 contra amigos (Tu turno / Esperando respuesta / Historial):
          necesitan backend real para sincronizar el turno entre dos personas —
          se construyen en la Sesión 6 junto con Supabase. Ver ESTADO.md. */}
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border-strong py-10 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-primary-soft text-brand-primary">
          <Swords className="h-6 w-6" strokeWidth={2} />
        </span>
        <p className="max-w-56 text-sm text-txt-secondary">
          Los retos 1 a 1 contra amigos llegan muy pronto. Mientras tanto, prueba el Reto de Cultura General de arriba.
        </p>
      </div>
    </div>
  );
}
