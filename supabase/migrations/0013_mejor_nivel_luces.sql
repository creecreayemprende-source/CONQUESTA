alter table public.profiles
  add column if not exists mejor_nivel_luces integer not null default 0;

revoke update on public.profiles from authenticated;
grant update (
  nombre, coins, gems, current_streak, longest_streak, last_active_on,
  categorias_favoritas, musica_silenciada, insignias_ganadas,
  inventario_cincuenta, inventario_tiempo_extra, inventario_pista, updated_at,
  avatar_url, recordatorio_diario, hora_recordatorio, monedas_ganadas_total,
  mejor_nivel_luces
) on public.profiles to authenticated;

-- Mismo candado anti-retroceso de monedas_ganadas_total (migración 0012):
-- el mejor nivel del juego de luces solo puede subir, nunca bajar por un
-- guardado con datos viejos.
create or replace function public.proteger_mejor_nivel_luces()
returns trigger
language plpgsql
as $$
begin
  if NEW.mejor_nivel_luces < OLD.mejor_nivel_luces then
    NEW.mejor_nivel_luces := OLD.mejor_nivel_luces;
  end if;
  return NEW;
end;
$$;

drop trigger if exists profiles_nivel_luces_no_baja on public.profiles;
create trigger profiles_nivel_luces_no_baja
before update on public.profiles
for each row execute function public.proteger_mejor_nivel_luces();
