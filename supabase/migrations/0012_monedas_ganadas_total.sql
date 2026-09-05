alter table public.profiles
  add column if not exists monedas_ganadas_total integer not null default 0;

revoke update on public.profiles from authenticated;
grant update (
  nombre, coins, gems, current_streak, longest_streak, last_active_on,
  categorias_favoritas, musica_silenciada, insignias_ganadas,
  inventario_cincuenta, inventario_tiempo_extra, inventario_pista, updated_at,
  avatar_url, recordatorio_diario, hora_recordatorio, monedas_ganadas_total
) on public.profiles to authenticated;

-- Mismo candado anti-retroceso que ya protege progreso_pais/progreso_ronda
-- (migración 0011): monedas_ganadas_total es un contador de SOLO SUBIDA — un
-- guardado con datos viejos nunca lo puede bajar.
create or replace function public.proteger_monedas_ganadas_total()
returns trigger
language plpgsql
as $$
begin
  if NEW.monedas_ganadas_total < OLD.monedas_ganadas_total then
    NEW.monedas_ganadas_total := OLD.monedas_ganadas_total;
  end if;
  return NEW;
end;
$$;

drop trigger if exists profiles_monedas_no_bajan on public.profiles;
create trigger profiles_monedas_no_bajan
before update on public.profiles
for each row execute function public.proteger_monedas_ganadas_total();

drop function if exists public.ranking_paises_conquistados(integer);

create or replace function public.ranking_paises_conquistados(p_dias integer default null)
returns table(nombre text, avatar_url text, monedas_ganadas_total integer, paises_conquistados bigint, es_actual boolean)
language sql
security definer set search_path = public
stable
as $$
  select
    p.nombre,
    p.avatar_url,
    p.monedas_ganadas_total,
    count(pp.pais) filter (
      where pp.reto_final_completado
        and pp.updated_at >= coalesce(now() - make_interval(days => p_dias), '-infinity'::timestamptz)
    ) as paises_conquistados,
    (p.id = auth.uid()) as es_actual
  from public.profiles p
  left join public.progreso_pais pp on pp.user_id = p.id
  group by p.id, p.nombre, p.avatar_url, p.monedas_ganadas_total
  order by paises_conquistados desc, monedas_ganadas_total desc, p.nombre asc
  limit 50;
$$;

revoke execute on function public.ranking_paises_conquistados(integer) from public, anon;
grant execute on function public.ranking_paises_conquistados(integer) to authenticated;
