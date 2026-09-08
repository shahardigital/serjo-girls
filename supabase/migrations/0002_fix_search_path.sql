-- תיקון WARN של security advisor: search_path קבוע לפונקציית הטריגר
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
