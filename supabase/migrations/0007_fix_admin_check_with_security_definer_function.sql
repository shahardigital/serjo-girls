-- הבעיה: policy על טבלה אחת שעושה subquery לטבלת admins עצמה כפוף ל-RLS של admins,
-- וכיוון של-admins אין policies בכלל (בכוונה), ה-subquery תמיד מחזיר 0 שורות - גם לאדמין האמיתי.
-- הפתרון: פונקציית עזר SECURITY DEFINER שעוקפת את ה-RLS של admins בצורה מבוקרת וממוקדת.
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

drop policy if exists "admins can insert girls" on public.girls;
drop policy if exists "admins can update girls" on public.girls;
drop policy if exists "admins can delete girls" on public.girls;
drop policy if exists "admins can read all girls" on public.girls;
drop policy if exists "admins can update site settings" on public.site_settings;

create policy "admins can insert girls" on public.girls
  for insert to authenticated
  with check (public.is_admin());

create policy "admins can update girls" on public.girls
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "admins can delete girls" on public.girls
  for delete to authenticated
  using (public.is_admin());

create policy "admins can read all girls" on public.girls
  for select to authenticated
  using (public.is_admin());

create policy "admins can update site settings" on public.site_settings
  for update to authenticated
  using (public.is_admin() and id = 'default')
  with check (public.is_admin() and id = 'default');
