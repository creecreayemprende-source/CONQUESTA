alter table public.profiles
  add column if not exists hitos_racha_ganados integer[] not null default '{}',
  add column if not exists tip_acelerar_visto boolean not null default false,
  add column if not exists retos_ganados_notificados text[] not null default '{}';

revoke update on public.profiles from authenticated;
grant update (
  nombre, coins, gems, current_streak, longest_streak, last_active_on,
  categorias_favoritas, musica_silenciada, insignias_ganadas,
  inventario_cincuenta, inventario_tiempo_extra, inventario_pista, updated_at,
  avatar_url, recordatorio_diario, hora_recordatorio, monedas_ganadas_total,
  mejor_nivel_luces, hitos_racha_ganados, tip_acelerar_visto, retos_ganados_notificados
) on public.profiles to authenticated;
