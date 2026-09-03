create table if not exists public.retos_1v1 (
  id uuid primary key default gen_random_uuid(),
  retador_id uuid not null references auth.users(id) on delete cascade,
  retador_nombre text not null,
  retado_id uuid references auth.users(id) on delete cascade,
  pregunta_indices int[] not null,
  total_preguntas int not null,
  puntaje_retador int not null,
  puntaje_retado int,
  estado text not null default 'esperando_retado' check (estado in ('esperando_retado','completado')),
  creado_en timestamptz not null default now(),
  completado_en timestamptz
);

alter table public.retos_1v1 enable row level security;
create index if not exists retos_1v1_retador_idx on public.retos_1v1(retador_id);
create index if not exists retos_1v1_retado_idx on public.retos_1v1(retado_id);

create policy "retos_1v1_select_participantes" on public.retos_1v1
  for select using ((select auth.uid()) in (retador_id, retado_id));

create policy "retos_1v1_insert_propio" on public.retos_1v1
  for insert with check ((select auth.uid()) = retador_id);

create or replace function public.ver_reto_1v1(p_id uuid)
returns jsonb
language plpgsql security definer set search_path = public
as $$
declare v_reto record;
begin
  select id, retador_id, retador_nombre, retado_id, total_preguntas,
         puntaje_retador, puntaje_retado, estado, creado_en
  into v_reto from public.retos_1v1 where id = p_id;
  if not found then return null; end if;
  return to_jsonb(v_reto);
end;
$$;
revoke execute on function public.ver_reto_1v1(uuid) from public, anon;
grant execute on function public.ver_reto_1v1(uuid) to authenticated;

create or replace function public.obtener_preguntas_reto_1v1(p_id uuid)
returns int[]
language plpgsql security definer set search_path = public
as $$
declare v_indices int[];
begin
  select pregunta_indices into v_indices from public.retos_1v1 where id = p_id;
  return v_indices;
end;
$$;
revoke execute on function public.obtener_preguntas_reto_1v1(uuid) from public, anon;
grant execute on function public.obtener_preguntas_reto_1v1(uuid) to authenticated;

create or replace function public.aceptar_reto_1v1(p_id uuid)
returns jsonb
language plpgsql security definer set search_path = public
as $$
declare v_reto record;
begin
  select * into v_reto from public.retos_1v1 where id = p_id;
  if not found then return jsonb_build_object('status','no_existe'); end if;
  if v_reto.retador_id = auth.uid() then
    return jsonb_build_object('status','es_tu_propio_reto');
  end if;
  if v_reto.retado_id is not null and v_reto.retado_id <> auth.uid() then
    return jsonb_build_object('status','ya_reclamado');
  end if;
  update public.retos_1v1 set retado_id = auth.uid() where id = p_id and retado_id is null;
  return jsonb_build_object('status','aceptado');
end;
$$;
revoke execute on function public.aceptar_reto_1v1(uuid) from public, anon;
grant execute on function public.aceptar_reto_1v1(uuid) to authenticated;

create or replace function public.completar_reto_1v1(p_id uuid, p_puntaje int)
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
  set puntaje_retado = p_puntaje, estado = 'completado', completado_en = now()
  where id = p_id;
  return jsonb_build_object('status','completado');
end;
$$;
revoke execute on function public.completar_reto_1v1(uuid,int) from public, anon;
grant execute on function public.completar_reto_1v1(uuid,int) to authenticated;
