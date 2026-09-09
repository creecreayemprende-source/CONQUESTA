-- Bases para medir "monedas ganadas en el período" sin necesitar un cron que
-- reinicie nada: cada fila guarda desde cuándo cuenta su base (semana/mes) y
-- cuánto tenía acumulado en ese momento — un trigger la recalcula sola la
-- próxima vez que el perfil se actualiza (lazy reset). Si un jugador no jugó
-- en el período actual, su base queda vieja y el ranking lo lee como 0 (no
-- como "sigue sumando lo de hace semanas") — ver la función más abajo.
alter table public.profiles
  add column if not exists monedas_semana_base integer not null default 0,
  add column if not exists semana_inicio date,
  add column if not exists monedas_mes_base integer not null default 0,
  add column if not exists mes_inicio date;

-- El cliente nunca escribe estas 4 columnas directamente (no están en el
-- grant de update) — las calcula únicamente este trigger, con la misma
-- protección que ya usan mejor_nivel_luces/monedas_ganadas_total: side
-- effect de servidor, no algo que el navegador pueda manipular.
create or replace function public.actualizar_bases_ranking()
returns trigger
language plpgsql
as $$
declare
  v_inicio_semana date := (current_date - (extract(dow from current_date) * interval '1 day'))::date;
  v_inicio_mes date := date_trunc('month', current_date)::date;
begin
  if OLD.semana_inicio is null or OLD.semana_inicio < v_inicio_semana then
    NEW.monedas_semana_base := OLD.monedas_ganadas_total;
    NEW.semana_inicio := v_inicio_semana;
  else
    NEW.monedas_semana_base := OLD.monedas_semana_base;
    NEW.semana_inicio := OLD.semana_inicio;
  end if;

  if OLD.mes_inicio is null or OLD.mes_inicio < v_inicio_mes then
    NEW.monedas_mes_base := OLD.monedas_ganadas_total;
    NEW.mes_inicio := v_inicio_mes;
  else
    NEW.monedas_mes_base := OLD.monedas_mes_base;
    NEW.mes_inicio := OLD.mes_inicio;
  end if;

  return NEW;
end;
$$;

drop trigger if exists profiles_bases_ranking on public.profiles;
create trigger profiles_bases_ranking
before update on public.profiles
for each row execute function public.actualizar_bases_ranking();

drop function if exists public.ranking_paises_conquistados(integer);

-- Reemplaza la función anterior (siempre ordenaba por países conquistados,
-- sin importar la pestaña). Ahora cada período mide algo distinto:
-- Semanal/Mensual = monedas ganadas en ESE período (reinicio real, no solo
-- ventana móvil) · General = países conquistados + insignias ganadas
-- ("Liga de Leyendas" — constancia de largo plazo, no solo monedas).
create or replace function public.ranking_jugadores(p_periodo text default 'general')
returns table(nombre text, avatar_url text, valor bigint, paises_conquistados bigint, insignias bigint, es_actual boolean)
language sql
security definer set search_path = public
stable
as $$
  select
    p.nombre,
    p.avatar_url,
    (case p_periodo
      when 'semanal' then
        case when p.semana_inicio = (current_date - (extract(dow from current_date) * interval '1 day'))::date
          then (p.monedas_ganadas_total - p.monedas_semana_base) else 0 end
      when 'mensual' then
        case when p.mes_inicio = date_trunc('month', current_date)::date
          then (p.monedas_ganadas_total - p.monedas_mes_base) else 0 end
      else
        count(pp.pais) filter (where pp.reto_final_completado) + coalesce(array_length(p.insignias_ganadas, 1), 0)
    end)::bigint as valor,
    count(pp.pais) filter (where pp.reto_final_completado) as paises_conquistados,
    coalesce(array_length(p.insignias_ganadas, 1), 0)::bigint as insignias,
    (p.id = auth.uid()) as es_actual
  from public.profiles p
  left join public.progreso_pais pp on pp.user_id = p.id
  group by p.id, p.nombre, p.avatar_url, p.semana_inicio, p.monedas_semana_base,
           p.mes_inicio, p.monedas_mes_base, p.monedas_ganadas_total, p.insignias_ganadas
  order by valor desc, paises_conquistados desc, p.nombre asc
  limit 50;
$$;

revoke execute on function public.ranking_jugadores(text) from public, anon;
grant execute on function public.ranking_jugadores(text) to authenticated;
