alter table public.profiles
  add column if not exists email text,
  add column if not exists plan text not null default 'free' check (plan in ('free','pro')),
  add column if not exists membership_status text not null default 'free'
    check (membership_status in ('free','trialing','active','past_due','cancelled','expired','refunded','chargeback')),
  add column if not exists trial_ends_at timestamptz,
  add column if not exists access_until timestamptz,
  add column if not exists grace_ends_at timestamptz,
  add column if not exists first_paid_at timestamptz,
  add column if not exists hotmart_subscriber_code text unique;

create unique index if not exists profiles_email_key on public.profiles (email) where email is not null;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email) values (new.id, new.email);
  return new;
end;
$$;

revoke update on public.profiles from authenticated;
grant update (
  nombre, coins, gems, current_streak, longest_streak, last_active_on,
  categorias_favoritas, trial_inicio_fecha, musica_silenciada, insignias_ganadas,
  inventario_cincuenta, inventario_tiempo_extra, inventario_pista, updated_at
) on public.profiles to authenticated;

create table if not exists public.processed_events (
  event_id text primary key,
  event_type text not null,
  payload_hash text,
  processed_at timestamptz not null default now()
);

create table if not exists public.webhook_log (
  id bigserial primary key,
  event_id text,
  type text,
  result text not null check (result in ('applied','duplicate','illegal','unauthorized','error')),
  received_at timestamptz not null default now()
);
create index if not exists webhook_log_received_idx on public.webhook_log (received_at desc);

create table if not exists public.pending_hotmart_upgrades (
  email text primary key,
  subscriber_code text,
  new_status text not null,
  updated_at timestamptz not null default now()
);

alter table public.processed_events enable row level security;
alter table public.webhook_log enable row level security;
alter table public.pending_hotmart_upgrades enable row level security;

create or replace function public.apply_hotmart_event(
  p_event_id text, p_event_type text, p_payload_hash text,
  p_email text, p_subscriber_code text, p_new_status text
) returns jsonb
language plpgsql security definer set search_path = public
as $$
declare v_current text; v_user_id uuid;
begin
  begin
    insert into public.processed_events (event_id, event_type, payload_hash)
    values (p_event_id, p_event_type, p_payload_hash);
  exception when unique_violation then
    return jsonb_build_object('status','duplicate');
  end;

  select id, membership_status into v_user_id, v_current from public.profiles
  where (p_subscriber_code is not null and hotmart_subscriber_code = p_subscriber_code)
     or (email = p_email)
  limit 1;

  if v_current in ('refunded','chargeback') and p_new_status in ('active','trialing') then
    return jsonb_build_object('status','illegal_transition','from',v_current);
  end if;

  if v_user_id is not null then
    update public.profiles set
      plan = case when p_new_status in ('trialing','active','past_due','cancelled') then 'pro' else 'free' end,
      membership_status = p_new_status,
      hotmart_subscriber_code = coalesce(p_subscriber_code, hotmart_subscriber_code),
      email = coalesce(email, p_email),
      first_paid_at = coalesce(first_paid_at, case when p_new_status = 'active' then now() else null end),
      trial_ends_at = case when p_new_status = 'trialing' then now() + interval '7 days' else trial_ends_at end,
      access_until = case when p_new_status = 'cancelled' then coalesce(access_until, now() + interval '30 days') else access_until end,
      grace_ends_at = case when p_new_status = 'past_due' then now() + interval '5 days' else grace_ends_at end,
      updated_at = now()
    where id = v_user_id;
    return jsonb_build_object('status','applied','new_status',p_new_status,'found',true);
  else
    insert into public.pending_hotmart_upgrades (email, subscriber_code, new_status, updated_at)
    values (p_email, p_subscriber_code, p_new_status, now())
    on conflict (email) do update set
      subscriber_code = excluded.subscriber_code,
      new_status = excluded.new_status,
      updated_at = now();
    return jsonb_build_object('status','applied','new_status',p_new_status,'found',false);
  end if;
end;
$$;

revoke execute on function public.apply_hotmart_event(text,text,text,text,text,text) from public, anon, authenticated;

create or replace function public.reconcile_pending_hotmart(p_user_id uuid, p_email text)
returns void
language plpgsql security definer set search_path = public
as $$
declare v_pending record;
begin
  select * into v_pending from public.pending_hotmart_upgrades where email = p_email;
  if not found then return; end if;

  update public.profiles set
    plan = case when v_pending.new_status in ('trialing','active','past_due','cancelled') then 'pro' else 'free' end,
    membership_status = v_pending.new_status,
    hotmart_subscriber_code = coalesce(v_pending.subscriber_code, hotmart_subscriber_code),
    email = coalesce(email, p_email),
    first_paid_at = coalesce(first_paid_at, case when v_pending.new_status = 'active' then now() else null end),
    trial_ends_at = case when v_pending.new_status = 'trialing' then now() + interval '7 days' else trial_ends_at end,
    updated_at = now()
  where id = p_user_id;

  delete from public.pending_hotmart_upgrades where email = p_email;
end;
$$;

revoke execute on function public.reconcile_pending_hotmart(uuid,text) from public, anon, authenticated;
