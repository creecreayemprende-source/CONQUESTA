import type { SupabaseClient } from "@supabase/supabase-js";

/** Sube (o reemplaza) la foto de perfil del usuario al bucket público
 * "avatars" — cada quien solo puede escribir dentro de su propia carpeta
 * `<user_id>/...` (ver RLS en 0007_avatar_y_notificaciones.sql). Devuelve la
 * URL pública lista para guardar en `profiles.avatar_url`. */
export async function subirAvatar(supabase: SupabaseClient, userId: string, archivo: File): Promise<string | null> {
  const extension = archivo.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const ruta = `${userId}/avatar.${extension}`;

  const { error } = await supabase.storage.from("avatars").upload(ruta, archivo, {
    upsert: true,
    cacheControl: "3600",
  });
  if (error) return null;

  const {
    data: { publicUrl },
  } = supabase.storage.from("avatars").getPublicUrl(ruta);
  // Cache-bust: la URL pública no cambia al reemplazar el archivo, así que
  // sin esto el navegador seguiría mostrando la foto vieja desde su caché.
  return `${publicUrl}?v=${Date.now()}`;
}
