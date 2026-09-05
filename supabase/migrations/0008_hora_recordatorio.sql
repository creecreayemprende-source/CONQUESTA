alter table public.profiles
  add column if not exists hora_recordatorio text;

revoke update on public.profiles from authenticated;
grant update (
  nombre, coins, gems, current_streak, longest_streak, last_active_on,
  categorias_favoritas, musica_silenciada, insignias_ganadas,
  inventario_cincuenta, inventario_tiempo_extra, inventario_pista, updated_at,
  avatar_url, recordatorio_diario, hora_recordatorio
) on public.profiles to authenticated;
