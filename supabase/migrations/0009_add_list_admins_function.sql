-- מחזירה את רשימת האדמינים (email + מתי נוסף) לאדמינים בלבד - עוקפת את ה-RLS הריק
-- של admins בצורה ממוקדת (SECURITY DEFINER), באותו דפוס בדיוק כמו is_admin().
create or replace function public.list_admins()
returns table (user_id uuid, email text, created_at timestamptz)
language sql
security definer
set search_path = public
stable
as $$
  select a.user_id, u.email, a.created_at
  from public.admins a
  join auth.users u on u.id = a.user_id
  where public.is_admin()
  order by a.created_at asc;
$$;

revoke all on function public.list_admins() from public;
grant execute on function public.list_admins() to authenticated;
