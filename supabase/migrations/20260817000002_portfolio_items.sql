-- ============================================================
-- portfolio_items — עבודות לתצוגה באתר
-- ============================================================
-- זו הטבלה היחידה עם policy ציבורית, והיא מוגבלת לקריאה בלבד
-- ולשורות שסומנו published. פריטים שלא פורסמו אינם נראים לאיש
-- מלבד ה-service-role.
-- ============================================================

create table if not exists portfolio_items (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  title text not null,
  image_url text,
  project_url text,
  sort_order int not null default 0,
  published boolean not null default false
);

alter table portfolio_items enable row level security;

-- ⚠️ ההנחיה המקורית נקטעה בדיוק כאן ("... on"). זהו ההשלמה
--    היחידה שמתיישבת עם שם ה-policy ועם ההערה שמעליה:
--    קריאה בלבד, ורק לשורות שפורסמו. ממתין לאישור.
create policy "public can view published portfolio items"
  on portfolio_items
  for select
  using (published = true);
