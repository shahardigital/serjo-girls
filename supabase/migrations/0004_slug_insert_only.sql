-- slug נשאר יציב לאורך זמן (חשוב ל-SEO - לא רוצים לשבור קישורים מאונדקסים
-- כשבעל העסק פשוט משנה שם תצוגה). נוצר פעם אחת ביצירה, לא משתנה אוטומטית בעדכון.
drop trigger if exists girls_set_slug on public.girls;
create trigger girls_set_slug
  before insert on public.girls
  for each row execute function public.set_girl_slug();
