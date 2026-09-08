# Serjo Girls - קטלוג חשפניות להזמנה

פרויקט React + TypeScript + Vite + Tailwind + shadcn/ui + Supabase, בנוי לפי [CLAUDE.md](./CLAUDE.md).
שלב זה הוא בנייה מקומית בלבד; בסוף התהליך הפרויקט יועבר ל-Lovable.

## התקנה

```bash
npm install
cp .env.example .env
```

מלאו ב-`.env` את פרטי הפרויקט ב-Supabase:

```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=xxxxx
```

## הרצה מקומית

```bash
npm run dev
```

## הקמת Supabase

1. צרו פרויקט Supabase חדש (או השתמשו בקיים).
2. הריצו את המיגרציה `supabase/migrations/0001_init.sql` (דרך Supabase Dashboard → SQL Editor, או `supabase db push`).
   המיגרציה יוצרת:
   - טבלת `girls` עם כל השדות הדרושים
   - מדיניות RLS: קריאה ציבורית לרשומות `active=true` בלבד, כתיבה רק למשתמש מאומת
   - Storage bucket ציבורי בשם `girls-images` עם מדיניות מתאימה
3. צרו משתמש אדמין: Supabase Dashboard → Authentication → Users → Add user (email + password).
   זהו המשתמש שישמש להתחברות ל-`/admin`.

## מבנה

ראו `CLAUDE.md` לפירוט המלא של הדרישות, מוסכמות העיצוב ומבנה הפרויקט.

## בנייה לפרודקשן

```bash
npm run build
npm run preview
```
