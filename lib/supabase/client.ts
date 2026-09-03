import { createBrowserClient } from "@supabase/ssr";

/** Cliente de Supabase para usar en componentes "use client" (navegador). */
export function supabaseBrowser() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
