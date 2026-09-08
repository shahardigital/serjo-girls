-- טבלת אדמינים מורשים - נגישה רק ל-SQL ישיר (ללא policies ללקוח), כדי שה-RLS לא יסמוך על "כל משתמש מחובר"
-- (שנרשם דרך signup ציבורי) אלא רק על משתמשים שנוספו במפורש.
create table public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;
-- ללא policies בכלל = אף אחד מה-client (anon/authenticated) לא יכול לקרוא/לכתוב לטבלה הזו, רק service_role/SQL ישיר.

insert into public.admins (user_id)
select id from auth.users where email = 'digitalshahar@gmail.com';

-- מחליף את מדיניות ה-write הקודמות על girls, שסמכו על "authenticated = true" (כל מי שנרשם, גם דרך signup ציבורי)
drop policy if exists "authenticated can insert girls" on public.girls;
drop policy if exists "authenticated can update girls" on public.girls;
drop policy if exists "authenticated can delete girls" on public.girls;
drop policy if exists "authenticated can read all girls" on public.girls;

create policy "admins can insert girls" on public.girls
  for insert to authenticated
  with check (auth.uid() in (select user_id from public.admins));

create policy "admins can update girls" on public.girls
  for update to authenticated
  using (auth.uid() in (select user_id from public.admins))
  with check (auth.uid() in (select user_id from public.admins));

create policy "admins can delete girls" on public.girls
  for delete to authenticated
  using (auth.uid() in (select user_id from public.admins));

create policy "admins can read all girls" on public.girls
  for select to authenticated
  using (auth.uid() in (select user_id from public.admins));

-- אותו דבר עבור site_settings
drop policy if exists "authenticated can update site settings" on public.site_settings;

create policy "admins can update site settings" on public.site_settings
  for update to authenticated
  using (auth.uid() in (select user_id from public.admins) and id = 'default')
  with check (auth.uid() in (select user_id from public.admins) and id = 'default');
