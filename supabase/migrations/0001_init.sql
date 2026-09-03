-- Conquesta — esquema inicial real (Sesión 6).
-- Reemplaza el AppState que hoy vive solo en localStorage del navegador
-- (lib/app-state.ts) por tablas reales en Supabase, una fila por usuario.
-- Todas las tablas tienen RLS activo: cada usuario solo puede leer/escribir
-- sus propias filas — nunca las de otro usuario (patrón exigido por 09/25).

-- 1) Perfil del jugador — 1 fila por usuario, creada automáticamente al registrarse.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nombre text not null default 'Explorador',
  coins integer not null default 0,
  gems integer not null default 0,
  current_streak integer not null default 0,
  longest_streak integer not null default 0,
  last_active_on date,
  categorias_favoritas text[] not null default '{}',
  trial_inicio_fecha date,
  musica_silenciada boolean not null default false,
  insignias_ganadas text[] not null default '{}',
  inventario_cincuenta integer not null default 0,
  inventario_tiempo_extra integer not null default 0,
  inventario_pista integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_own" on public.profiles
  for select using ((select auth.uid()) = id);
create policy "profiles_update_own" on public.profiles
  for update using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);
-- Sin policy de insert/delete manual: la fila se crea sola vía el trigger de
-- abajo al registrarse, y nunca se borra por el usuario (se borra en cascada
-- si se borra la cuenta de auth.users).

-- 2) Progreso por ronda (Explorador/Descubridor/Experto) de cada categoría de cada país.
create table if not exists public.progreso_ronda (
  user_id uuid not null references auth.users(id) on delete cascade,
  pais text not null,
  categoria text not null,
  ronda text not null,
  completado boolean not null default false,
  aciertos integer not null default 0,
  total integer not null default 0,
  updated_at timestamptz not null default now(),
  primary key (user_id, pais, categoria, ronda)
);

alter table public.progreso_ronda enable row level security;
create index if not exists progreso_ronda_user_idx on public.progreso_ronda(user_id);

create policy "progreso_ronda_all_own" on public.progreso_ronda
  for all using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- 3) Progreso del Reto Final por país (conquista real del país).
create table if not exists public.progreso_pais (
  user_id uuid not null references auth.users(id) on delete cascade,
  pais text not null,
  reto_final_completado boolean not null default false,
  updated_at timestamptz not null default now(),
  primary key (user_id, pais)
);

alter table public.progreso_pais enable row level security;
create index if not exists progreso_pais_user_idx on public.progreso_pais(user_id);

create policy "progreso_pais_all_own" on public.progreso_pais
  for all using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- 4) Trigger: crea el perfil automáticamente en cuanto alguien se registra
-- (magic link u OAuth) — así el juego nunca se encuentra un usuario sin fila.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id) values (new.id);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
