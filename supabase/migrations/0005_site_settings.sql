-- הגדרות אתר גלובליות (שורה יחידה) - טלפון/וואטסאפ, תבנית הודעה, באנר, תקנון
create table if not exists public.site_settings (
  id text primary key default 'default',
  phone_display text not null default '054-914-0720',
  phone_tel text not null default '0549140720',
  phone_intl text not null default '972549140720',
  whatsapp_template text not null default 'מעוניין ב{שם}',
  banner_enabled boolean not null default false,
  banner_text text not null default '',
  terms_content text not null default '',
  updated_at timestamptz not null default now()
);

drop trigger if exists site_settings_set_updated_at on public.site_settings;
create trigger site_settings_set_updated_at
  before update on public.site_settings
  for each row execute function public.set_updated_at();

alter table public.site_settings enable row level security;

drop policy if exists "public can read site settings" on public.site_settings;
create policy "public can read site settings"
  on public.site_settings for select
  to anon, authenticated
  using (true);

drop policy if exists "authenticated can update site settings" on public.site_settings;
create policy "authenticated can update site settings"
  on public.site_settings for update
  to authenticated
  using (id = 'default')
  with check (id = 'default');

insert into public.site_settings (id, terms_content)
values ('default', $terms$# 1. כללי והסכמה לתנאים
תקנון זה מסדיר את תנאי השימוש באתר ובשירותים המוצגים בו. גלישה באתר, יצירת קשר דרכו או הזמנת שירות מהווים הסכמה מלאה ומודעת לכל התנאים המפורטים להלן. אם אינך מסכים לתנאי כלשהו מתנאי תקנון זה, אנא הימנע משימוש באתר.

# 2. הגדרות
"האתר" - אתר האינטרנט על כל דפיו ותכניו. "בעל האתר" - מפעיל השירות ובעל האתר. "המשתמש" / "הלקוח" - כל אדם הגולש באתר או פונה דרכו ליצירת קשר או הזמנת שירות. "השירות" - מופעי בידור וריקוד המוצגים באתר.

# 3. הצהרת גיל ובגרות
השימוש באתר והשירותים המוצגים בו מיועדים לבגירים מגיל 18 ומעלה בלבד. בעצם השימוש באתר ו/או יצירת קשר לצורך הזמנה, המשתמש מצהיר ומאשר כי הוא בגיר כאמור, וכי הוא פועל מרצונו החופשי.

# 4. אופי השירות
השירות המוצע הינו מופע בידור המבוסס על ריקוד, נוכחות ואווירה, המיועד לאירועים פרטיים כגון מסיבות רווקים ואירועים חברתיים. למען הסר ספק: השירות אינו כולל, ולא יכלול בשום צורה, שירותי מין מכל סוג. כל בקשה החורגת מגבולות מופע הבידור תידחה ותביא להפסקה מיידית של השירות ללא החזר כספי.

# 5. הזמנה, תשלום וביטולים
ההזמנה מתבצעת באמצעות יצירת קשר טלפוני או בוואטסאפ, ותיחשב סופית רק לאחר אישור בעל פה משני הצדדים. פרטי התשלום, המחיר וזמני ההגעה ייקבעו מראש בעת ההזמנה. ביטול הזמנה יש לבצע בהקדם האפשרי טרם מועד האירוע; ביטול בסמוך למועד האירוע עלול להיות כרוך בדמי ביטול, כפי שיוסכם בעת ההזמנה.

# 6. דיסקרטיות ופרטיות
אנו מייחסים חשיבות עליונה לפרטיות ולדיסקרטיות של לקוחותינו. פרטי ההזמנה, יצירת הקשר ותוכן השיחות נשמרים בסודיות מלאה ואינם מועברים לצד שלישי כלשהו, למעט אם נדרש הדבר על פי דין.

# 7. התנהגות והתחייבויות הלקוח
הלקוח מתחייב לנהוג בכבוד, באדיבות ובהתאם לגבולות שהוגדרו מראש כלפי נותנת השירות. כל התנהגות פוגענית, מטרידה, אלימה או החורגת מגבולות המופע המוסכם עלולה להביא להפסקה מיידית של השירות, ללא החזר כספי, וללא כל אחריות מצד בעל האתר.

# 8. הגבלת אחריות
בעל האתר פועל כגורם מתווך בין הלקוח לבין נותנות השירות, ואינו אחראי לכל נזק, ישיר או עקיף, שייגרם כתוצאה מהשימוש בשירות, לרבות אך לא רק עיכובים, שינויים או ביטולים שאינם בשליטתו.

# 9. קניין רוחני
כל התכנים המוצגים באתר - לרבות טקסטים, תמונות, עיצוב ולוגו - הינם רכושו הבלעדי של בעל האתר או מוצגים ברשותו, ואין להעתיקם, לשכפלם או להשתמש בהם ללא אישור מראש ובכתב.

# 10. שינויים בתקנון
בעל האתר רשאי לעדכן תקנון זה מעת לעת, לפי שיקול דעתו הבלעדי וללא הודעה מוקדמת. הנוסח המחייב הוא זה המפורסם באתר בכל עת נתונה.

# 11. יצירת קשר
לכל שאלה, בקשה או תלונה בנוגע לתקנון זה או לשירות, ניתן לפנות אלינו דרך פרטי הקשר המופיעים בתחתית האתר.$terms$)
on conflict (id) do nothing;

-- מונה קליקים על כפתורי וואטסאפ/חיוג לכל חשפנית
alter table public.girls add column if not exists whatsapp_clicks integer not null default 0;
alter table public.girls add column if not exists call_clicks integer not null default 0;

-- פונקציה מוגנת להגדלת מונה - לא מאפשרת לצד ציבורי לכתוב שדות אחרים בטבלה
create or replace function public.increment_girl_click(p_girl_id uuid, p_kind text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_kind = 'whatsapp' then
    update public.girls set whatsapp_clicks = whatsapp_clicks + 1 where id = p_girl_id;
  elsif p_kind = 'call' then
    update public.girls set call_clicks = call_clicks + 1 where id = p_girl_id;
  end if;
end;
$$;

grant execute on function public.increment_girl_click(uuid, text) to anon, authenticated;
