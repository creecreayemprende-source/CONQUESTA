"use client";

import { Suspense, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Mail } from "lucide-react";
import { supabaseBrowser } from "@/lib/supabase/client";

type Estado = "idle" | "enviando" | "enviado" | "error";

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  // A dónde volver tras loguearse (ej. aceptar un reto 1v1 por link) —
  // lo fija el middleware cuando redirige a /login sin sesión (ver
  // lib/supabase/middleware.ts). Por defecto, /app (el Mapa).
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/app";
  const [email, setEmail] = useState("");
  const [estado, setEstado] = useState<Estado>("idle");
  const [cooldown, setCooldown] = useState(0);

  function iniciarCooldown() {
    setCooldown(60);
    const t = setInterval(() => {
      setCooldown((c) => {
        if (c <= 1) {
          clearInterval(t);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
  }

  async function enviarEnlace(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@") || estado === "enviando") return;
    setEstado("enviando");
    const supabase = supabaseBrowser();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}` },
    });
    if (error) {
      setEstado("error");
      return;
    }
    setEstado("enviado");
    iniciarCooldown();
  }

  async function continuarConGoogle() {
    const supabase = supabaseBrowser();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}` },
    });
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-surface-base px-4">
      <div className="w-full max-w-sm">
        <Link href="/" className="mb-8 flex items-center gap-2 font-display text-lg font-extrabold text-txt-primary">
          <Image src="/logo/conquesta-logo.png" alt="Conquesta" width={36} height={40} className="h-9 w-auto" />
          Conquesta
        </Link>

        {estado !== "enviado" ? (
          <>
            <h1 className="font-display text-2xl font-bold text-txt-primary">Entra a tu pasaporte</h1>
            <p className="mt-2 text-sm text-txt-secondary">
              Para guardarlo y verlo en cualquier dispositivo.
            </p>

            <form onSubmit={enviarEnlace} className="mt-6 flex flex-col gap-3">
              <input
                type="email"
                required
                autoFocus
                placeholder="tu@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-14 rounded-lg border border-border-default bg-surface-primary px-4 text-base text-txt-primary outline-none focus-visible:border-brand-primary"
              />
              <button
                type="submit"
                disabled={estado === "enviando"}
                className="flex h-14 items-center justify-center rounded-lg bg-brand-primary font-display text-base font-bold text-white transition-transform duration-200 ease-out hover:-translate-y-0.5 disabled:opacity-70"
              >
                {estado === "enviando" ? "Enviando…" : "Enviarme mi enlace de acceso"}
              </button>
              <button
                type="button"
                onClick={continuarConGoogle}
                className="flex h-14 items-center justify-center gap-2 rounded-lg border border-border-strong font-display text-base font-bold text-txt-primary transition-colors duration-200 ease-out hover:bg-surface-secondary"
              >
                Continuar con Google
              </button>
            </form>
            {estado === "error" && (
              <p className="mt-4 text-center text-xs font-medium text-status-error">
                No pudimos enviar el enlace. Revisa el correo e intenta de nuevo.
              </p>
            )}
            <p className="mt-4 text-center text-xs text-txt-tertiary">
              Sin contraseñas: te llegará un enlace de un solo uso.
            </p>
          </>
        ) : (
          <div className="flex flex-col items-center gap-4 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-primary-soft text-brand-primary">
              <Mail className="h-8 w-8" strokeWidth={2} />
            </span>
            <h1 className="font-display text-xl font-bold text-txt-primary">Revisa tu correo</h1>
            <p className="text-sm text-txt-secondary">
              Te enviamos el enlace a <strong className="text-txt-primary">{email}</strong>
            </p>
            <button
              type="button"
              disabled={cooldown > 0}
              onClick={async () => {
                if (cooldown > 0) return;
                const supabase = supabaseBrowser();
                await supabase.auth.signInWithOtp({
                  email,
                  options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}` },
                });
                iniciarCooldown();
              }}
              className="text-sm font-medium text-brand-primary disabled:text-txt-tertiary"
            >
              {cooldown > 0 ? `Reenviar en ${cooldown}s` : "Reenviar enlace"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
