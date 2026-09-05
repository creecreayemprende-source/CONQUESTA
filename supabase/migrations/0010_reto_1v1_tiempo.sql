alter table public.retos_1v1
  add column if not exists tiempo_retador_segundos int,
  add column if not exists tiempo_retado_segundos int;

create or replace function public.ver_reto_1v1(p_id uuid)
returns jsonb
language plpgsql security definer set search_path = public
as $$
declare v_reto record;
begin
  select id, retador_id, retador_nombre, retado_id, total_preguntas,
         puntaje_retador, puntaje_retado, estado, creado_en,
         tiempo_retador_segundos, tiempo_retado_segundos
  into v_reto from public.retos_1v1 where id = p_id;
  if not found then return null; end if;
  return to_jsonb(v_reto);
end;
$$;
revoke execute on function public.ver_reto_1v1(uuid) from public, anon;
grant execute on function public.ver_reto_1v1(uuid) to authenticated;

drop function if exists public.completar_reto_1v1(uuid, int);

create or replace function public.completar_reto_1v1(p_id uuid, p_puntaje int, p_tiempo_segundos int default null)
returns jsonb
language plpgsql security definer set search_path = public
as $$
declare v_reto record;
begin
  select * into v_reto from public.retos_1v1 where id = p_id;
  if not found then return jsonb_build_object('status','no_existe'); end if;
  if v_reto.retado_id <> auth.uid() then
    return jsonb_build_object('status','no_autorizado');
  end if;
  if v_reto.estado = 'completado' then
    return jsonb_build_object('status','ya_completado');
  end if;
  update public.retos_1v1
  set puntaje_retado = p_puntaje, tiempo_retado_segundos = p_tiempo_segundos,
      estado = 'completado', completado_en = now()
  where id = p_id;
  return jsonb_build_object('status','completado');
end;
$$;
revoke execute on function public.completar_reto_1v1(uuid,int,int) from public, anon;
grant execute on function public.completar_reto_1v1(uuid,int,int) to authenticated;
