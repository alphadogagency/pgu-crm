create table if not exists public.stop_data (
  stop_id text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.app_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists stop_data_set_updated_at on public.stop_data;
create trigger stop_data_set_updated_at
before update on public.stop_data
for each row
execute function public.set_updated_at();

drop trigger if exists app_settings_set_updated_at on public.app_settings;
create trigger app_settings_set_updated_at
before update on public.app_settings
for each row
execute function public.set_updated_at();

create or replace function public.update_stop_section(
  p_stop_id text,
  p_section text,
  p_value jsonb
)
returns jsonb
language plpgsql
security invoker
set search_path = public
as $$
declare
  next_data jsonb;
begin
  insert into public.stop_data (stop_id, data)
  values (
    p_stop_id,
    jsonb_build_object(p_section, coalesce(p_value, 'null'::jsonb))
  )
  on conflict (stop_id) do update
    set data = jsonb_set(
      coalesce(public.stop_data.data, '{}'::jsonb),
      array[p_section],
      coalesce(p_value, 'null'::jsonb),
      true
    )
  returning data into next_data;

  return next_data;
end;
$$;

alter table public.stop_data enable row level security;
alter table public.app_settings enable row level security;

drop policy if exists "anon can read stop data" on public.stop_data;
create policy "anon can read stop data"
on public.stop_data
for select
to anon
using (true);

drop policy if exists "anon can insert stop data" on public.stop_data;
create policy "anon can insert stop data"
on public.stop_data
for insert
to anon
with check (true);

drop policy if exists "anon can update stop data" on public.stop_data;
create policy "anon can update stop data"
on public.stop_data
for update
to anon
using (true)
with check (true);

drop policy if exists "anon can read app settings" on public.app_settings;
create policy "anon can read app settings"
on public.app_settings
for select
to anon
using (true);

drop policy if exists "anon can insert app settings" on public.app_settings;
create policy "anon can insert app settings"
on public.app_settings
for insert
to anon
with check (true);

drop policy if exists "anon can update app settings" on public.app_settings;
create policy "anon can update app settings"
on public.app_settings
for update
to anon
using (true)
with check (true);

grant usage on schema public to anon, authenticated;
grant select, insert, update on public.stop_data to anon, authenticated;
grant select, insert, update on public.app_settings to anon, authenticated;
grant execute on function public.update_stop_section(text, text, jsonb) to anon, authenticated;

alter table public.stop_data replica identity full;
alter table public.app_settings replica identity full;

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'stop_data'
  ) then
    alter publication supabase_realtime add table public.stop_data;
  end if;

  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'app_settings'
  ) then
    alter publication supabase_realtime add table public.app_settings;
  end if;
end $$;
