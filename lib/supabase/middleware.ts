import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/** Refresca la sesión en cada petición y protege /app: sin sesión real,
 * redirige a /login en vez de dejar pasar a la app interna. */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const enAppInterna = request.nextUrl.pathname.startsWith("/app");
  if (enAppInterna && !user) {
    const url = request.nextUrl.clone();
    // Se guarda a dónde iba (ej. aceptar un reto 1v1 por link) para volver
    // ahí mismo después de loguearse, en vez de siempre caer al Mapa.
    const destino = url.pathname + url.search;
    url.pathname = "/login";
    url.search = "";
    url.searchParams.set("next", destino);
    return NextResponse.redirect(url);
  }

  return response;
}
