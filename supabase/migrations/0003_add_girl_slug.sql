-- slug: מזהה URL יציב וקריא ל-SEO (למשל /girl/נועה), נגזר אוטומטית מהשם
alter table public.girls add column if not exists slug text;

create or replace function public.slugify(input text)
returns text
language sql
immutable
set search_path = public
as $$
  select trim(both '-' from regexp_replace(
    regexp_replace(trim(input), '\s+', '-', 'g'),
    '[^֐-׿a-zA-Z0-9\-]', '', 'g'
  ));
$$;

create or replace function public.set_girl_slug()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  base_slug text;
  candidate text;
  suffix int := 1;
begin
  if new.slug is not null and length(trim(new.slug)) > 0 then
    base_slug := public.slugify(new.slug);
  else
    base_slug := public.slugify(new.name);
  end if;

  if base_slug is null or length(base_slug) = 0 then
    base_slug := 'girl';
  end if;

  candidate := base_slug;
  while exists (
    select 1 from public.girls
    where slug = candidate and id is distinct from new.id
  ) loop
    suffix := suffix + 1;
    candidate := base_slug || '-' || suffix;
  end loop;

  new.slug := candidate;
  return new;
end;
$$;

drop trigger if exists girls_set_slug on public.girls;
create trigger girls_set_slug
  before insert or update of name, slug on public.girls
  for each row execute function public.set_girl_slug();

-- גיבוי לרשומות קיימות
update public.girls set slug = public.slugify(name) where slug is null;
update public.girls g1 set slug = g1.slug || '-' || sub.rn
from (
  select id, row_number() over (partition by slug order by created_at) as rn
  from public.girls
) sub
where g1.id = sub.id and sub.rn > 1;

alter table public.girls alter column slug set not null;
create unique index if not exists girls_slug_key on public.girls (slug);
