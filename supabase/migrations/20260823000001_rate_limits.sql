-- ============================================================
-- rate_limits — הגבלת קצב לפניות /api/contact
-- ============================================================
-- RLS פעיל ובלי policies: anon/authenticated לא רואים את הטבלה.
-- רק service_role (צד שרת, עוקף RLS) קורא וכותב.
-- ============================================================

create table rate_limits (
  ip text primary key,
  window_start timestamptz not null default now(),
  count int not null default 1,
  last_request_at timestamptz not null default now()
);

alter table rate_limits enable row level security;

-- צריכה אטומית: נעילת השורה, ואז החלטה לאפשר או לדחות.
-- true = מותר להמשיך, false = חסום (יותר מדי).
create or replace function public.consume_rate_limit(p_ip text)
returns boolean
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_now timestamptz := clock_timestamp();
  v_window timestamptz;
  v_count int;
  v_last timestamptz;
  v_xmax xid;
begin
  if p_ip is null or length(btrim(p_ip)) = 0 then
    p_ip := 'unknown';
  end if;

  /* ניקוי זול — בערך אחת מכל 20 קריאות, בלי cron. */
  if random() < 0.05 then
    delete from rate_limits
    where last_request_at < v_now - interval '24 hours';
  end if;

  insert into rate_limits as r (ip, window_start, count, last_request_at)
  values (p_ip, v_now, 1, v_now)
  on conflict (ip) do update
    set ip = excluded.ip
  returning r.window_start, r.count, r.last_request_at, xmax
  into v_window, v_count, v_last, v_xmax;

  /* שורה חדשה — xmax=0 ב-insert. */
  if v_xmax = 0 then
    return true;
  end if;

  if v_last > v_now - interval '20 seconds' then
    return false;
  end if;

  if v_window <= v_now - interval '1 hour' then
    update rate_limits
    set window_start = v_now, count = 1, last_request_at = v_now
    where ip = p_ip;
    return true;
  end if;

  if v_count >= 5 then
    return false;
  end if;

  update rate_limits
  set count = v_count + 1, last_request_at = v_now
  where ip = p_ip;
  return true;
end;
$$;

revoke all on function public.consume_rate_limit(text) from public;
revoke all on function public.consume_rate_limit(text) from anon, authenticated;
grant execute on function public.consume_rate_limit(text) to service_role;
