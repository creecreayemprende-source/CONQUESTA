drop function if exists public.ranking_paises_conquistados(integer);

create or replace function public.ranking_paises_conquistados(p_dias integer default null)
returns table(nombre text, avatar_url text, paises_conquistados bigint, es_actual boolean)
language sql
security definer set search_path = public
stable
as $$
  select
    p.nombre,
    p.avatar_url,
    count(pp.pais) filter (
      where pp.reto_final_completado
        and pp.updated_at >= coalesce(now() - make_interval(days => p_dias), '-infinity'::timestamptz)
    ) as paises_conquistados,
    (p.id = auth.uid()) as es_actual
  from public.profiles p
  left join public.progreso_pais pp on pp.user_id = p.id
  group by p.id, p.nombre, p.avatar_url
  order by paises_conquistados desc, p.nombre asc
  limit 50;
$$;

revoke execute on function public.ranking_paises_conquistados(integer) from public, anon;
grant execute on function public.ranking_paises_conquistados(integer) to authenticated;
