-- טבלת חשפניות
create table if not exists public.girls (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null default '',
  images text[] not null default '{}',
  tags text[] not null default '{}',
  active boolean not null default true,
  "order" integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists girls_active_order_idx on public.girls (active, "order");

-- עדכון updated_at אוטומטי
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists girls_set_updated_at on public.girls;
create trigger girls_set_updated_at
  before update on public.girls
  for each row execute function public.set_updated_at();

-- RLS: חובה, לא אופציונלי
alter table public.girls enable row level security;

-- קריאה ציבורית - רק רשומות פעילות
drop policy if exists "public can read active girls" on public.girls;
create policy "public can read active girls"
  on public.girls for select
  to anon, authenticated
  using (active = true);

-- קריאה מלאה למשתמש מאומת (אדמין) - כולל רשומות מוסתרות
drop policy if exists "authenticated can read all girls" on public.girls;
create policy "authenticated can read all girls"
  on public.girls for select
  to authenticated
  using (true);

-- כתיבה רק למשתמש מאומת
drop policy if exists "authenticated can insert girls" on public.girls;
create policy "authenticated can insert girls"
  on public.girls for insert
  to authenticated
  with check (true);

drop policy if exists "authenticated can update girls" on public.girls;
create policy "authenticated can update girls"
  on public.girls for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "authenticated can delete girls" on public.girls;
create policy "authenticated can delete girls"
  on public.girls for delete
  to authenticated
  using (true);

-- Storage bucket לתמונות
insert into storage.buckets (id, name, public)
values ('girls-images', 'girls-images', true)
on conflict (id) do nothing;

drop policy if exists "public can view girl images" on storage.objects;
create policy "public can view girl images"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'girls-images');

drop policy if exists "authenticated can upload girl images" on storage.objects;
create policy "authenticated can upload girl images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'girls-images');

drop policy if exists "authenticated can update girl images" on storage.objects;
create policy "authenticated can update girl images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'girls-images');

drop policy if exists "authenticated can delete girl images" on storage.objects;
create policy "authenticated can delete girl images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'girls-images');
