alter table public.profiles
  add column if not exists avatar_url text,
  add column if not exists recordatorio_diario boolean not null default false;

revoke update on public.profiles from authenticated;
grant update (
  nombre, coins, gems, current_streak, longest_streak, last_active_on,
  categorias_favoritas, musica_silenciada, insignias_ganadas,
  inventario_cincuenta, inventario_tiempo_extra, inventario_pista, updated_at,
  avatar_url, recordatorio_diario
) on public.profiles to authenticated;

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

create policy "avatars_lectura_publica" on storage.objects
  for select using (bucket_id = 'avatars');

create policy "avatars_escritura_propia" on storage.objects
  for insert with check (
    bucket_id = 'avatars' and (select auth.uid())::text = (storage.foldername(name))[1]
  );

create policy "avatars_actualizacion_propia" on storage.objects
  for update using (
    bucket_id = 'avatars' and (select auth.uid())::text = (storage.foldername(name))[1]
  );

create policy "avatars_borrado_propio" on storage.objects
  for delete using (
    bucket_id = 'avatars' and (select auth.uid())::text = (storage.foldername(name))[1]
  );
