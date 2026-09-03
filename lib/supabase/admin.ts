import "server-only";
import { createClient } from "@supabase/supabase-js";

const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SERVICE_ROLE_KEY) throw new Error("FALTA SUPABASE_SERVICE_ROLE_KEY");

/** Cliente con la clave de servicio — SOLO en código de servidor (route handlers).
 * Ignora RLS por completo: nunca importar esto desde un componente "use client". */
export function supabaseAdmin() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, SERVICE_ROLE_KEY!, {
    auth: { persistSession: false },
  });
}
