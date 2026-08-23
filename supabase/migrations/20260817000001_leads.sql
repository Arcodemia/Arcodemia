-- ============================================================
-- leads — פניות מטופס יצירת הקשר
-- ============================================================
-- אין כאן שום policy ציבורית, וזה מכוון.
-- RLS פעיל ובלי policies אף לקוח אנונימי או מחובר לא יכול
-- לקרוא או לכתוב. רק ה-service-role client (צד שרת בלבד, עוקף
-- RLS לחלוטין) ניגש לטבלה. הדפדפן לעולם לא מדבר ישירות עם
-- Supabase בשביל leads — הכל עובר דרך ה-Route Handler.
-- ============================================================

create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  phone text not null,
  business text,
  message text,
  contact_method text not null check (contact_method in ('email', 'whatsapp')),
  status text not null default 'new' check (status in ('new', 'contacted', 'closed')),
  source text not null default 'website',
  constraint business_len check (business is null or char_length(business) <= 80),
  constraint message_len check (message is null or char_length(message) <= 2000)
);

alter table leads enable row level security;
