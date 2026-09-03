import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

/** El enlace mágico del correo trae a esta ruta con un `code` — lo canjeamos
 * por una sesión real y mandamos al usuario a la app. */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const siguiente = searchParams.get("next") ?? "/app";

  if (code) {
    const supabase = await supabaseServer();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const user = data.user;
      // Caso borde del Modelo 2B: alguien pagó en Hotmart con este correo ANTES
      // de haberse registrado nunca en la app — se aplica el Pro pendiente
      // justo en este primer login real (ver `pending_hotmart_upgrades`).
      if (user?.email) {
        await supabaseAdmin().rpc("reconcile_pending_hotmart", {
          p_user_id: user.id,
          p_email: user.email,
        });
      }
      return NextResponse.redirect(`${origin}${siguiente}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=enlace_invalido`);
}
