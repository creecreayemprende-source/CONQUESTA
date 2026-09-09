-- Cofre semanal: al cerrar la semana (domingo a medianoche, hora Colombia/Perú
-- — America/Bogota, UTC-5 fijo sin horario de verano), el top 3 del Ranking
-- Semanal gana Gemas + una medalla coleccionable exclusiva. Se corre con
-- pg_cron (no depende de que nadie abra la app en ese momento).

create extension if not exists pg_cron;

-- Redefinidas para anclar TODO el cálculo de semana/mes a la misma zona
-- horaria (America/Bogota) — antes usaban `current_date`, que depende del
-- timezone de sesión de quien llama (distinto entre PostgREST y pg_cron) y
-- podía desalinear el corte de semana entre el trigger y el cron de cierre.
create or replace function public.actualizar_bases_ranking()
returns trigger
language plpgsql
as $$
declare
  v_hoy date := (now() at time zone 'America/Bogota')::date;
  v_inicio_semana date := (v_hoy - (extract(dow from v_hoy) * interval '1 day'))::date;
  v_inicio_mes date := date_trunc('month', v_hoy)::date;
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
        case when p.semana_inicio = ((now() at time zone 'America/Bogota')::date - (extract(dow from (now() at time zone 'America/Bogota')::date) * interval '1 day'))::date
          then (p.monedas_ganadas_total - p.monedas_semana_base) else 0 end
      when 'mensual' then
        case when p.mes_inicio = date_trunc('month', (now() at time zone 'America/Bogota')::date)::date
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

-- Columnas del cofre: qué medallas ya ganó (para siempre, no se repiten) y
-- cuál acaba de ganar y todavía no vio el modal de celebración (se limpia
-- sola apenas la cierra — igual que `hitoRachaPendienteDeMostrar`, pero esta
-- SÍ vive en el servidor porque el cron, no el navegador, es quien la otorga).
alter table public.profiles
  add column if not exists souvenirs_semanales_ganados text[] not null default '{}',
  add column if not exists medalla_semanal_pendiente text;

revoke update on public.profiles from authenticated;
grant update (
  nombre, coins, gems, current_streak, longest_streak, last_active_on,
  categorias_favoritas, musica_silenciada, insignias_ganadas,
  inventario_cincuenta, inventario_tiempo_extra, inventario_pista, updated_at,
  avatar_url, recordatorio_diario, hora_recordatorio, monedas_ganadas_total,
  mejor_nivel_luces, hitos_racha_ganados, tip_acelerar_visto, retos_ganados_notificados,
  medalla_semanal_pendiente
) on public.profiles to authenticated;

-- 30/20/10 gemas para 1º/2º/3º — mismo orden de magnitud que el resto de la
-- economía (acelerar un país cuesta 20 gemas: el 1er puesto casi lo cubre solo).
create or replace function public.cerrar_semana_ranking()
returns void
language plpgsql
security definer set search_path = public
as $$
declare
  v_hoy date := (now() at time zone 'America/Bogota')::date;
  v_semana_cerrada date := (v_hoy - (extract(dow from v_hoy) * interval '1 day') - interval '7 days')::date;
  r record;
  v_pos int := 0;
  v_medalla text;
  v_gemas int;
begin
  for r in
    select p.id, p.souvenirs_semanales_ganados,
           (p.monedas_ganadas_total - p.monedas_semana_base) as ganado
    from public.profiles p
    where p.semana_inicio = v_semana_cerrada
      and (p.monedas_ganadas_total - p.monedas_semana_base) > 0
    order by ganado desc, p.id asc
    limit 3
  loop
    v_pos := v_pos + 1;
    v_medalla := case v_pos when 1 then 'oro' when 2 then 'plata' else 'bronce' end;
    v_gemas := case v_pos when 1 then 30 when 2 then 20 else 10 end;
    update public.profiles
    set gems = gems + v_gemas,
        souvenirs_semanales_ganados = case when v_medalla = any(r.souvenirs_semanales_ganados)
          then r.souvenirs_semanales_ganados else array_append(r.souvenirs_semanales_ganados, v_medalla) end,
        medalla_semanal_pendiente = v_medalla
    where id = r.id;
  end loop;
end;
$$;

revoke execute on function public.cerrar_semana_ranking() from public, anon, authenticated;

-- Domingo 00:01 hora Colombia/Perú (America/Bogota, UTC-5) = 05:01 UTC.
select cron.schedule('cerrar_semana_ranking', '1 5 * * 0', $$select public.cerrar_semana_ranking();$$);
