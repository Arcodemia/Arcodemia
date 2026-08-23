# PROJECT_BRAIN — ARCODEMIA

A complete technical map of this repository, written so someone who has never seen the code can understand what was built, how it is structured, and why the key decisions were made.

**Generated from the tree at `HEAD` `9ff74c5` on `main` (2026-08-23).**  
**Remote:** `https://github.com/Arcodemia/Arcodemia.git` (`origin/main`).  
**There is no `README.md`.** Project memory lives in `MEMORY.md` (index / brief), `log.md` (append-only decision journal), `DEPLOY.md` (launch runbook, Hebrew), and `TECHNICAL-SUMMARY.md` (frozen snapshot of the **pre-Next.js** static site — do not treat it as current).

**Rule used while writing this file:** nothing here is guessed. Where the code, git history, or docs do not settle a point, it is marked **unclear from code**.

---

## 1. Overview

### What this project does

ARCODEMIA is a **single-page Hebrew/RTL marketing landing page** for a two-person Israeli agency that sells **landing pages only** to local businesses (barbershops, garages, clinics, restaurants — listed as examples in `MEMORY.md` and in the contact-form placeholder).

The page *is* the product demo. There is no real client portfolio in the UI. Conversion is contact, primarily WhatsApp, plus phone, email, and a lead form.

**Package name:** `arcodemia-landing` (`package.json`, version `1.0.0`, `"private": true`).  
**Description (package.json):** `ARCODEMIA — דף נחיתה לעסקים מקומיים (Next.js App Router)`.

### Who it is for

| Audience | Role |
|---|---|
| Local Israeli business owners | Visitors. The page is in Hebrew, `dir="rtl"`, `lang="he"`. |
| The agency owners | Recipients of form leads (logged in Supabase) and WhatsApp / mailto chats. |

### Business purpose (from `MEMORY.md` §הבריף)

| Decision | Value |
|---|---|
| Brand | **ARCODEMIA** (was **Aristocraft** until 2026-08-06; the old name survives only in `MEMORY.md` / `log.md` / `TECHNICAL-SUMMARY.md`, not in product code) |
| Product | Landing pages only |
| Proof | No real portfolio. The page itself is the proof |
| Pricing | Never shown. CTA is always “contact us for a quote” |
| Delivery time | No number committed on the page; settled on the first call |
| Differentiator | Risk reversal — *קודם רואים. רק אחר כך משלמים* (see the design first; if you don’t like it you walk away, no cancellation fee) |
| Legal posture | The site is not a shop, does not take payment, and has no checkout. Stated in `LegalDialogs.tsx` terms (`#docTerms` §2) |

### Public contact (hardcoded in `lib/config.ts` — these are displayed on the page, not secrets)

| Field | Value | Constant |
|---|---|---|
| WhatsApp (international, no `+`) | `972508674870` | `CONFIG.whatsapp` |
| Phone display | `050-867-4870` | `CONFIG.phone` |
| Phone dial | `+972508674870` | `CONFIG.phoneDial` |
| Email | `arcodemia.il@gmail.com` | `CONFIG.email` |
| Form endpoint | `/api/contact` | `CONFIG.endpoint` |
| Brand string | `ARCODEMIA` | `BRAND` |
| Legal-docs “updated” stamp | `2026-08-06` | `LEGAL_UPDATED` |

### Live status

- `MEMORY.md` previously said the site was not live pending Vercel. See current `DEPLOY.md` for the Vercel + Supabase env runbook.
- Git now has a GitHub remote (`origin`). Whether Vercel is connected to that remote, and whether any production URL is serving this commit, is **unclear from code** (no `.vercel/` in the repo — it is gitignored; no live URL in `MEMORY.md`).
- `public/robots.txt` advertises `https://arcodemia.co.il/sitemap.xml`. There is **no** `sitemap.xml` in the repo. Whether that domain is registered is **unclear from code**.

### Full tech stack (resolved versions from `package-lock.json`)

| Layer | Package | Declared | Locked |
|---|---|---|---|
| Framework | `next` | `^16.3.2` | **16.3.2** |
| UI | `react` / `react-dom` | `^19.2.8` | **19.2.8** |
| Database client | `@supabase/supabase-js` | `^2.112.3` | **2.112.3** |
| Server-only guard | `server-only` | `^0.0.1` | **0.0.1** |
| Types | `typescript` | `^6.0.3` | **6.0.3** |
| Lint | `eslint` | `^9.39.5` | **9.39.5** (lockfile marks this ESLint line as deprecated upstream) |
| Lint config | `eslint-config-next` | `^16.3.2` | **16.3.2** |
| Types | `@types/node` | `^26.2.0` | **26.2.0** |
| Types | `@types/react` | `^19.2.18` | **19.2.18** |
| Types | `@types/react-dom` | `^19.2.4` | **19.2.4** |
| CLI (dev) | `supabase` | `^2.115.0` | **2.115.0** |

**Runtime:** Node `>=20` (`package.json` → `engines`). `DEPLOY.md` says the author’s machine has Node 24 / npm 11 / Vercel CLI 58. That is a machine note, not an engine constraint.

**Not in the dependency tree:** CSS preprocessor, component library, analytics, payment SDK, auth library used by the app, test runner, Playwright/Puppeteer (mentioned in historical notes, not committed). The contact form does not use a transactional-email SDK; email mode opens a `mailto:` link.

**Language / module system:** `"type": "module"` in `package.json`. TypeScript `strict` with `noUncheckedIndexedAccess`, `noImplicitOverride`, `noFallthroughCasesInSwitch`. Path alias `@/*` → repo root (`tsconfig.json`).

**Styling:** one global stylesheet, `app/globals.css`. No Tailwind, no CSS modules, no styled-components. Logical CSS properties throughout (`inset-inline-*`, `margin-block-*`, `padding-inline`) for RTL.

**Fonts:** self-hosted Heebo via `next/font/local` in `app/layout.tsx`. Two separate `localFont()` calls (Hebrew subset + Latin subset) so each family gets its own `unicode-range`. Files live in `app/fonts/`. No Google Fonts request at runtime — this is required for the CSP (`font-src 'self'`) and for the privacy claim of “zero third-party requests on page load”.

---

## 2. Architecture & Folder Structure

### Complete tree (tracked source — excluding `.git`, `node_modules`, `.next`)

```
Arcodemia/
├── app/
│   ├── layout.tsx                 Root layout: metadata, JSON-LD, fonts, intro script, hero preloads
│   ├── page.tsx                   Client page that composes every section
│   ├── globals.css                Entire visual system (~630 lines, ~46 tokens)
│   ├── fonts/                     10× Heebo woff2 (5 Hebrew + 5 Latin weights 400/500/700/800/900)
│   └── api/contact/route.ts       POST /api/contact — validate + log lead to Supabase
├── components/                    One component per page section + overlays
│   ├── Nav.tsx
│   ├── Hero.tsx
│   ├── PainPoints.tsx
│   ├── Process.tsx
│   ├── RiskReversal.tsx
│   ├── FAQ.tsx
│   ├── ContactSection.tsx
│   ├── ContactForm.tsx
│   ├── Footer.tsx
│   ├── WhatsAppFab.tsx
│   ├── A11yWidget.tsx
│   ├── LegalDialogs.tsx           Context + three legal <dialog>s
│   ├── Dialog.tsx                 Native <dialog> wrapper
│   └── icons.tsx                  Inline SVGs (WhatsApp, logo, phone, mail, a11y, check)
├── hooks/
│   ├── useA11yPreferences.ts      localStorage-backed a11y state (useSyncExternalStore)
│   ├── useReveal.ts               IntersectionObserver scroll-reveal + intro timeout
│   └── useScrolledPast.ts         Scroll-Y threshold for the WhatsApp FAB
├── lib/
│   ├── config.ts                  CONFIG, BRAND, LEGAL_UPDATED
│   ├── whatsapp.ts                waURL / toWhatsAppMessage / openWhatsApp
│   ├── mailto.ts                  mailtoURL / toMailtoBody / openMailto
│   ├── types.ts                   ContactPayload / ContactErrorCode / ContactResponse
│   ├── env.ts                     requireEnv / optionalEnv (server-only)
│   ├── supabase.ts                service-role client (server-only)
│   └── database.types.ts          Hand-written Database types for leads + portfolio_items
├── public/
│   ├── robots.txt
│   └── img/
│       ├── hero-wide.webp         90,766 bytes — desktop hero art
│       └── hero-tall.webp         86,704 bytes — mobile hero art
├── supabase/
│   ├── config.toml                Local CLI config; project_id = "arcodemia"
│   └── migrations/
│       ├── 20260817000001_leads.sql
│       └── 20260817000002_portfolio_items.sql
├── tools/
│   └── render-crystals.cjs        Offline WebGL raymarcher that emits tools/_render.html
├── .env.example                   Variable *names* only
├── .gitignore
├── AGENTS.md / CLAUDE.md          Next.js 16 agent-rules stub (auto-reinserted by `next dev`)
├── DEPLOY.md                      Hebrew first-launch runbook
├── MEMORY.md                      Project memory / brief / open checklist
├── log.md                         Chronological decision journal
├── TECHNICAL-SUMMARY.md           Pre-Next.js handoff (stale relative to current stack)
├── eslint.config.mjs
├── next.config.mjs                Security headers + cache (replaced vercel.json)
├── package.json / package-lock.json
└── tsconfig.json
```

**Not in the tree, but referenced:**

| Path | Status |
|---|---|
| `supabase/seed.sql` | Listed in `config.toml` `[db.seed] sql_paths` — **file does not exist** |
| `sitemap.xml` | Referenced by `robots.txt` — **file does not exist** |
| `vercel.json` | Removed in the Next.js migration (`afdb9b4`). Headers now live in `next.config.mjs` |
| `index.html` / `api/contact.js` | Removed. Restore point: commit `d1b6ba6` |
| `.env.local` | gitignored. Exists locally; do not commit. Required keys: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` (and optional `SUPABASE_PROJECT_REF`) |
| `.github/` | **Does not exist.** No Actions workflows |
| `middleware.ts` | **Does not exist** |
| Admin / dashboard routes | **Do not exist** (`MEMORY.md` Phase 3: planned, not built) |

### How the code is organized

**Routing.** Next.js App Router. There is one page route (`app/page.tsx` → `/`) and one Route Handler (`app/api/contact/route.ts` → `/api/contact`). No `app/` nested folders, no route groups, no parallel routes, no `loading.tsx` / `error.tsx` / `not-found.tsx`.

**Server vs client.**

| File | `'use client'`? | Why |
|---|---|---|
| `app/layout.tsx` | no | Server: metadata, fonts, JSON-LD |
| `app/page.tsx` | **yes** | Needs `useReveal()` and wraps the tree in `LegalProvider` |
| `app/api/contact/route.ts` | n/a (server) | `runtime = 'nodejs'`, `dynamic = 'force-dynamic'` |
| `lib/env.ts`, `lib/supabase.ts` | n/a | `import 'server-only'` — importing these from a client component **fails the build** |
| `Hero`, `ContactForm`, `Footer`, `A11yWidget`, `LegalDialogs`, `Dialog`, `WhatsAppFab` | yes | State, effects, context, or native `<dialog>` |
| `Nav`, `PainPoints`, `Process`, `RiskReversal`, `FAQ`, `ContactSection` | no | Static markup. `ContactSection` is a server component that renders the client `ContactForm` |

**Config as a single source of truth.** Anything a human might need to change (phone, WhatsApp, email, form endpoint, brand, legal date) is in `lib/config.ts`. Comments there say so explicitly.

**No shared UI kit.** Buttons, cards, fields, dialogs are CSS class families in `globals.css` (`.btn`, `.card`, `.field`, `.doc`, `.fab`, `.a11y-*`). Icons are inline SVG in `components/icons.tsx` so the CSP can keep `img-src 'self' data:` with no extra requests.

**Comments and commits are Hebrew; identifiers are English.** That is a deliberate convention (`TECHNICAL-SUMMARY.md`, `log.md`).

### Key architectural decisions (and why)

1. **The page is the proof.** No portfolio UI. `portfolio_items` exists in the schema for a later phase; nothing in the app reads it.
2. **Hero crystals are pre-rendered WebP, not live WebGL.** Runtime cost is zero. The raymarcher lives only in `tools/render-crystals.cjs`. Live WebGL and SVG crystals were tried and deleted (`log.md` 2026-08-06).
3. **No third-party requests on page load.** Self-hosted fonts, no analytics, no cookies. WhatsApp and `mailto:` are opt-in (click / form submit).
4. **CSP as HTTP headers, not `<meta>`.** Headers can enforce `frame-ancestors`; a meta tag cannot. Documented in `next.config.mjs`.
5. **Entrance animations cannot be what makes content visible.** Default CSS is visible. `html.intro` / `html.rv-on` are added by a tiny inline script before first paint. If JS never runs, nothing is hidden. (`app/layout.tsx` `INTRO_SCRIPT`, `hooks/useReveal.ts`, comments in `globals.css`.)
6. **Supabase is an observability layer, never a gate.** `logLead()` never throws. Both modes return 200 after validation. (`app/api/contact/route.ts`, `log.md` 2026-08-23.)
7. **Service-role key never ships to the browser.** Variable is `SUPABASE_SERVICE_ROLE_KEY` (no `NEXT_PUBLIC_`). Client module imports `server-only`.
8. **`next/font` needs string literals and two `localFont()` calls.** A variable in `declarations.value` is silently dropped at compile time. One call would stamp the same `unicode-range` on all ten files and the two files of a given weight would clobber each other. (`app/layout.tsx` comments; `log.md`.)
9. **CSP `'unsafe-eval'` is gated on `phase === PHASE_DEVELOPMENT_SERVER`, not `NODE_ENV`.** `NODE_ENV` is not trustworthy when `next.config` loads; the leak to production was caught with `curl -sI`. (`next.config.mjs`.)

---

## 3. Pages & Routes

### HTTP routes

| Route | File | Kind | Purpose |
|---|---|---|---|
| `/` | `app/page.tsx` | Client page | The entire marketing site |
| `/api/contact` | `app/api/contact/route.ts` | Route Handler | Lead intake. `POST` implemented; `GET` returns `405` with `Allow: POST` |
| `/robots.txt` | `public/robots.txt` | Static | `Allow: /`, `Disallow: /api/`, Sitemap line pointing at a missing file |
| `/img/hero-wide.webp` | `public/img/hero-wide.webp` | Static | Desktop hero (`<source>` / default `<img>`) |
| `/img/hero-tall.webp` | `public/img/hero-tall.webp` | Static | Mobile hero (`<source media="(max-width:833px)">`) |
| `/_next/static/…` | Next build output | Static | JS/CSS/font hashes. Fonts served from here via `next/font` |

There are no other `app/**/page.tsx` files. There is no `/admin`, `/login`, `/portfolio`, `/sitemap.xml`, or `/privacy` URL — legal copy is in-page dialogs.

### In-page sections on `/` (assembled in `app/page.tsx`)

`Page` calls `useReveal()`, wraps everything in `LegalProvider`, then renders:

| Order | Anchor | Component | What it does | Key children / helpers |
|---|---|---|---|---|
| 0 | — | skip link `.skip` | Keyboard skip to `#main` | — |
| 0 | — | `.grain` | SVG-noise overlay (kills “flat CSS gradient” look) | `aria-hidden` |
| 0 | — | `.frame` | Thin side rules, desktop only (`display:none` ≤833px) | `aria-hidden` |
| 1 | — | `Nav` | Sticky header: logo → in-page links → WhatsApp CTA | `LogoMark`, `waURL` |
| 2 | `#top` | `Hero` | Crystal `<picture>`, H1, lead, two CTAs, three trust chips | `waURL`, fade-in on image `load`/`error`/`complete` |
| 3 | `#why` | `PainPoints` | Four pain-point cards | inline SVGs in the file |
| 4 | `#process` | `Process` | Four numbered steps (CSS counters `.stepc::before`) | — |
| 5 | `#risk` | `RiskReversal` | Risk-reversal copy + WhatsApp CTA | `CheckIcon` |
| 6 | `#faq` | `FAQ` | Seven native `<details>` accordions | no JS accordion |
| 7 | `#contact` | `ContactSection` | Direct WhatsApp / tel / mailto + form | `ContactForm` |
| 8 | — | `Footer` | © year + three legal openers | `useLegal()` |
| 9 | — | `WhatsAppFab` | Floating WhatsApp, shown after 460px scroll | `useScrolledPast(460)` |
| 10 | — | `A11yWidget` | Accessibility panel (start side, opposite the FAB) | `useA11yPreferences`, `useLegal` |

`LegalProvider` (in `LegalDialogs.tsx`) also mounts three native `<dialog>`s, independent of scroll position:

| Dialog id | Title | Opened from |
|---|---|---|
| `docPrivacy` | מדיניות פרטיות | Footer; consent checkbox link in `ContactForm` |
| `docTerms` | תנאי שימוש | Footer |
| `docA11y` | הצהרת נגישות | Footer; a11y panel footer |

### Nav links (`components/Nav.tsx` `LINKS`)

`#why` · `#process` · `#risk` · `#faq` · `#contact`. Smooth scroll via `html { scroll-behavior:smooth; scroll-padding-block-start:96px }`. Links hidden below 900px; WhatsApp CTA remains.

### JSON-LD (`app/layout.tsx` `JSON_LD`)

A `@graph` of `ProfessionalService` + `FAQPage`. The FAQPage encodes **five** questions. The on-page `FAQ` component has **seven**. The two extra on-page items are “אני לא מבין כלום בטכנולוגיה…” and “אפשר לשנות דברים אחרי שהדף עולה?”. Wording of the shared five is close but not identical. This is a real content drift, not a guess.

### Metadata (`app/layout.tsx`)

- `title`: `ARCODEMIA — דפי נחיתה לעסקים מקומיים`
- `description` / Open Graph / Twitter `summary_large_image`
- `locale: 'he_IL'`, `themeColor: '#000000'`, `viewportFit: 'cover'`
- Favicon is an inline SVG data-URI (black rounded square + white triangle + purple bar — same geometry as `LogoMark`)

---

## 4. Data Model & Supabase

Supabase was added on 2026-08-23 (commits `289ef21`, `9ff74c5`). `log.md` / `MEMORY.md` state that **migrations have not been applied** (`supabase db push` / `link` not done). The schema below is what the migration files *define*. Whether those tables exist on a hosted project is **unclear from code** (this workspace has no `.env.local`; `MEMORY.md` on another machine said `public.leads` did not exist yet).

`lib/database.types.ts` is **hand-written** to match the migrations. A comment says they can later be regenerated with `npx supabase gen types typescript --linked`.

**There are no foreign keys.** Both tables set `Relationships: []` in the TypeScript schema because postgrest-js requires the field, and the SQL has none.

Types are `type` aliases, not `interface`. The file documents why: postgrest-js requires `Record<string, …>`; an `interface` without an index signature falls through to `never` and produces `LeadInsert is not assignable to never[]`.

### Table `leads`

Defined in `supabase/migrations/20260817000001_leads.sql`. Purpose: store contact-form submissions.

| Column | SQL type | Constraints / default | `LeadRow` / `LeadInsert` |
|---|---|---|---|
| `id` | `uuid` | PK, `gen_random_uuid()` | row only |
| `created_at` | `timestamptz` | `not null default now()` | row only |
| `name` | `text` | `not null` | required on insert |
| `phone` | `text` | `not null` | required on insert |
| `business` | `text` | nullable; `char_length <= 80` | optional |
| `message` | `text` | nullable; `char_length <= 2000` | optional |
| `contact_method` | `text` | `not null`, check `in ('email','whatsapp')` | required (`ContactMethod`) |
| `status` | `text` | `not null default 'new'`, check `in ('new','contacted','closed')` | optional on insert (`LeadStatus`) |
| `source` | `text` | `not null default 'website'` | optional on insert; **the API does not send it**, so the default applies |

`logLead()` in `app/api/contact/route.ts` inserts `{ name, phone, business, message, contact_method, status: 'new' }`.

**Who writes:** only the Node Route Handler, via the service-role client (`lib/supabase.ts` `getSupabase()`). The browser never talks to Supabase for leads.

### Table `portfolio_items`

Defined in `supabase/migrations/20260817000002_portfolio_items.sql`. Purpose (comment): works for display on the site.

| Column | SQL type | Constraints / default |
|---|---|---|
| `id` | `uuid` | PK, `gen_random_uuid()` |
| `created_at` | `timestamptz` | `not null default now()` |
| `title` | `text` | `not null` |
| `image_url` | `text` | nullable |
| `project_url` | `text` | nullable |
| `sort_order` | `int` | `not null default 0` |
| `published` | `boolean` | `not null default false` |

**No application code selects, inserts, or updates this table.** `MEMORY.md` Phase 3: public portfolio UI planned, not built.

### Row Level Security

**`leads`**

```sql
alter table leads enable row level security;
```

**Zero policies.** With RLS on and no policies, the `anon` and `authenticated` keys cannot read or write. Only the service-role key (which bypasses RLS) can. This is explicit in the migration comment: the browser must never hit this table.

**`portfolio_items`**

```sql
alter table portfolio_items enable row level security;

create policy "public can view published portfolio items"
  on portfolio_items
  for select
  using (published = true);
```

`log.md` records that the original instruction was **cut off** at `create policy "public can view published portfolio items" on` and that `for select using (published = true)` was the only completion that matched the policy name and the comment. Marked **awaiting confirmation**. Unpublished rows are invisible to anyone except service-role.

No `INSERT`/`UPDATE`/`DELETE` policies exist on either table.

### Storage buckets

- `supabase/config.toml` enables local Storage (`[storage] enabled = true`, `file_size_limit = "50MiB"`).
- The example bucket block `[storage.buckets.images]` is **commented out**.
- No migration creates a bucket.
- No TypeScript references Storage.

**Conclusion:** no Storage buckets are in use by this application.

### Local CLI config (`supabase/config.toml`)

- `project_id = "arcodemia"`
- Local API `54321`, DB `54322`, Studio `54323`, Postgres major **17**
- Auth is **enabled in the default local config** (`[auth] enabled = true`, `site_url = "http://127.0.0.1:3000"`). That is stock `supabase init` configuration. **The Next.js app does not call Supabase Auth.**
- `[db.seed] sql_paths = ["./seed.sql"]` — file missing, so a local `db reset` would not seed anything even if seed were enabled.

### Client (`lib/supabase.ts`)

```ts
createClient<Database>(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
  global: { headers: { 'x-application-name': 'arcodemia-site' } },
});
```

Cached in module scope. Returns `null` if `SUPABASE_URL` or `SUPABASE_SERVICE_ROLE_KEY` is missing. Note: `getSupabase()` reads `process.env` directly and does **not** treat `REPLACE_ME` as empty; `logLead()` *does* go through `optionalEnv()`, which does. `isSupabaseConfigured()` also skips the `REPLACE_ME` check.

---

## 5. Authentication & Authorization

### Login / logout

**There is none.** No login page, no session cookie, no middleware, no `createBrowserClient`, no `supabase.auth.*` calls in application code. `lib/supabase.ts` sets `persistSession: false`.

The accessibility widget stores preferences in `localStorage` under `arcodemia:a11y`. That is not an account.

### Permission levels (regular user vs admin)

**There are no user roles in the application.** Every visitor is anonymous.

The schema anticipates a later admin workflow via `leads.status` (`new` | `contacted` | `closed`), but nothing in the app updates that column. `MEMORY.md` Phase 3: “דשבורד ניהול לצפייה בפניות ולעדכון `status` — לא נבנה”.

### How the admin panel is protected

**There is no admin panel.** Nothing to protect.

The only authorization model that exists today is **database RLS + a server-only service-role key**:

| Actor | What they can do |
|---|---|
| Browser | Submit `POST /api/contact`. Cannot hold the service-role key. Cannot query `leads`. Could theoretically `select` `portfolio_items` where `published = true` if a future client used the anon key — no such client exists. |
| Route Handler (`/api/contact`) | Inserts into `leads` with service-role. Rate-limited per IP in process memory. |
| Service-role (if leaked) | Bypasses RLS on both tables. This is why the key has no `NEXT_PUBLIC_` prefix and why `lib/supabase.ts` imports `server-only`. |

Supabase local Auth being “on” in `config.toml` does not create an app login.

---

## 6. External Integrations

### mailto: (`lib/mailto.ts`)

Email mode of the contact form builds a `mailto:` URL addressed to `CONFIG.email`, with `encodeURIComponent` on the subject and body (name, phone, business, message). `openMailto()` uses `window.open` on the same click tick as WhatsApp, so popup blockers do not swallow it. The server does not send mail.

### WhatsApp (`https://wa.me/…`)

Built by `waURL()` in `lib/whatsapp.ts`:

```ts
`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}`
```

Used from: `Nav` CTA, `Hero` CTA, `RiskReversal` CTA, `ContactSection` direct line, `WhatsAppFab`, and WhatsApp-mode form (opens **synchronously** in the click handler so popup blockers don’t swallow `window.open` after `await`). All `target="_blank"` links also set `rel="noopener noreferrer"` except `openWhatsApp()`, which uses `window.open(url, '_blank', 'noopener')`.

### Supabase

Server-side insert into `leads` only. See §4. Failure is `console.error` only.

### Vercel

Intended host (`DEPLOY.md`, `next.config.mjs` comments). Auto-detects Next.js and runs `next build`. No `vercel.json`. Whether a Vercel project is actually linked is **unclear from code**.

### GitHub

Remote `origin` = `https://github.com/Arcodemia/Arcodemia.git`. No Actions. No other GitHub integration in the repo.

### Not integrated (confirmed absent)

Payments, Stripe, PayPal, Google Analytics, Meta Pixel, Google Fonts CDN, Google Maps, SMS, Sentry, i18n libraries, CMS.

`LegalDialogs.tsx` privacy §7 names hosting, the visitor’s own mail app (`mailto:`), and WhatsApp/Meta.

---

## 7. Environment Variables

Names only. Source of truth: `.env.example` + `lib/env.ts` `ENV_KEYS`.

`lib/env.ts` treats missing, empty, **or the literal `REPLACE_ME`** as unset. Two accessors:

- `requireEnv(key)` — throws `EnvError` naming the key. **Not currently called from application code.**
- `optionalEnv(key)` — returns `null`. Used by the contact route so a missing Supabase key cannot crash the handler.

| Name | Required at runtime? | Used by | Purpose |
|---|---|---|---|
| `SUPABASE_URL` | No for visitor success. If missing, `logLead()` logs and returns. | `logLead()`, `lib/supabase.ts` | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Same as URL. **Bypasses RLS. Must never be `NEXT_PUBLIC_`.** | same | Server insert into `leads` |
| `SUPABASE_PROJECT_REF` | Not read by app code. `.env.example` says it is for `supabase link`. Not a secret. | CLI only | Project ref |

**There are no `NEXT_PUBLIC_*` variables.** That is intentional.

`supabase/config.toml` also mentions `OPENAI_API_KEY`, `SUPABASE_AUTH_SMS_TWILIO_AUTH_TOKEN`, `SUPABASE_AUTH_EXTERNAL_APPLE_SECRET`, and S3 keys under `[experimental]`. Those are **stock commented/templated CLI config**, not used by this app.

`DEPLOY.md` adds `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` to Vercel production.

---

## 8. Deployment

### How it is supposed to be deployed

`DEPLOY.md` (Hebrew) is the runbook:

1. Create a Vercel Hobby account, `npx vercel login`, `npx vercel link`, `npx vercel --prod`.
2. `npx vercel env add SUPABASE_URL production` and `npx vercel env add SUPABASE_SERVICE_ROLE_KEY production`, then `npx vercel --prod` again.
3. Optional paid domain (Namecheap/Cloudflare mentioned), then add it in Vercel.

Vercel is expected to detect Next.js and build with `next build`. Security headers and cache policy come from `next.config.mjs` `headers()`, not `vercel.json`.

### Environments

| Environment | Evidence |
|---|---|
| Local | `npm run dev` → `next dev`. Documented. |
| Production | `DEPLOY.md` only shows `vercel env add … production` and `vercel --prod`. |
| Preview | **unclear from code.** No preview env docs, no GitHub-integration config in the repo. Vercel preview deploys would exist *if* the GitHub repo were linked — that link is not in this tree. |
| Staging | Not mentioned. |

`next.config.mjs` distinguishes **dev vs everything else** for CSP (`PHASE_DEVELOPMENT_SERVER` adds `'unsafe-eval'` and `connect-src` `ws:` / `http:`). Production CSP must not include `'unsafe-eval'`.

### Cache / robots headers (`next.config.mjs`)

| Source | Headers |
|---|---|
| `/:path*` | CSP + HSTS (`max-age=63072000; includeSubDomains; preload`) + `X-Content-Type-Options: nosniff` + `X-Frame-Options: DENY` + `Referrer-Policy: strict-origin-when-cross-origin` + COOP `same-origin` + CORP `same-origin` + `X-DNS-Prefetch-Control: off` + Permissions-Policy denying 24 features (camera, mic, geolocation, payment, `interest-cohort`, …; `fullscreen=(self)`) |
| `/img/:path*` | `Cache-Control: public, max-age=31536000, immutable` |
| `/api/:path*` | `Cache-Control: no-store` + `X-Robots-Tag: noindex` |

CSP production: `default-src 'self'`; `base-uri 'none'`; `object-src 'none'`; `img-src 'self' data:`; `style-src 'self' 'unsafe-inline'`; `font-src 'self'`; `script-src 'self' 'unsafe-inline'`; `connect-src 'self'`; `form-action 'self'`; `frame-ancestors 'none'`; `upgrade-insecure-requests`. `'unsafe-inline'` is required for Next hydration and runtime CSS.

Also: `reactStrictMode: true`, `poweredByHeader: false`.

### CI/CD

**None in the repository.** No `.github/workflows`, no `vercel.json` git hook, no test script in `package.json`.

`package.json` scripts:

```
dev        → next dev
build      → next build
start      → next start
lint       → eslint .
typecheck  → tsc --noEmit
```

Updates after the first launch, per `DEPLOY.md`: edit a component, `npm run build`, `vercel --prod`. Rollback via Vercel dashboard / `vercel rollback`.

`DEPLOY.md` still contains an old local path (`c:\Users\hezie\OneDrive\Desktop\Projects\Personal\site-1`) from before this working copy.

---

## 9. History & Milestones

Git was initialized **after** the product already existed. The first commit is `1a9ac54` (2026-08-06), “ARCODEMIA — דף נחיתה מוכן לפריסה”. Pre-git history is in `log.md` (from 2026-07-29). Both are summarized below. Commit hashes are from `git log` on `main`.

### Pre-git (from `log.md` only)

| Date | What happened |
|---|---|
| 2026-07-29 | Folder created. Decision: landing page that *sells* landing pages to local businesses. Stack: static HTML. Conversion: WhatsApp + form + phone. No real portfolio. |
| 2026-07-30 | Brand **Aristocraft**. Purple-cyan on navy. Three-step service picker that built a WhatsApp message. Version 1 in a single `index.html`. Prices and delivery times not shown. |
| 2026-07-30 | Client rejected v1 as “AI generic”. Diagnosis: the **palette**, not the layout. |
| 2026-07-30 | Version 2: drop cyan; charcoal + neon purple `#B14BFF` + gold; Frank Ruhl Libre; decode/scan intro. Sample-work section removed at client request. Security pass: CSP, `noopener`, honeypot, no `innerHTML`. |
| 2026-08-06 | Brand → **ARCODEMIA**. Real phone/email. **Version 2 thrown out.** Version 3 from a dark fintech-with-crystals reference. Explicit bans: gold, serif, running-code background. Palette: pure black / white / neon purple. Rainbow only inside crystals. |
| 2026-08-06 | SVG crystals (rejected: “plastic candy”) → improved SVG (still rejected) → **live WebGL raymarching**. Legal dialogs + consent checkbox. Accessibility widget. Service picker removed; business field becomes free text. Number strip (0 ₪ / 100%) removed. Legal copy rewritten with **no placeholders** because the owner had no registered business yet. |
| 2026-08-06 | Live WebGL completed (lightning, TIR, beer-law absorption, GPU tiling lessons). Intro animations made fail-open. Heebo self-hosted. CSP moved to headers. `api/contact.js` + transactional email. Git + `DEPLOY.md`. |
| 2026-08-06 | Client: live 3D is too heavy. **Bake the raymarcher to static WebP.** WebGL/SVG/charging animation deleted from the page. Runtime cost → zero. |
| 2026-08-06 | Studio lighting rewrite (`rectLight`), thicker crystals, internal crack field, two-layer bloom. |
| 2026-08-17 | Transparent glass (ambient was too high → milky). Glowing title. Generator moved into the repo as `tools/render-crystals.cjs` after a scratchpad script was lost. |
| 2026-08-17 | “Lightning” in the reference was **lens flare**, not electric zigzags. `flare()` added (core + anamorphic streak + star rays + halo). |

### Git history (`git log`, oldest → newest)

| Date | Hash | Subject | Why it matters |
|---|---|---|---|
| 2026-08-06 | `1a9ac54` | ARCODEMIA — דף נחיתה מוכן לפריסה | First snapshot: static site + contact API + vercel.json + security headers + self-hosted fonts |
| 2026-08-06 | `d0ed432` | עדכון זיכרון הפרויקט לסוף הסשן | Memory update |
| 2026-08-06 | `d0a00db` | הקריסטלים עברו לתמונה סטטית שרונדרה מראש | Live WebGL removed; two WebP crops; radial dim overlay for title contrast |
| 2026-08-06 | `e839d15` | עדכון הזיכרון: הקריסטלים כתמונה סטטית | Memory |
| 2026-08-06 | `908f3da` | ניקוי מידע מיושן מהזיכרון | Legal placeholders already gone; charging / number strip / SVG fallback removed from docs |
| 2026-08-06 | `110487c` | קריסטלים: תאורת סטודיו במקום מקורות נקודתיים | Lighting, not geometry, was the gap vs the reference |
| 2026-08-17 | `30a5a85` | זכוכית שקופה, כותרת זוהרת, ומחולל התמונות עבר לפרויקט | `tools/render-crystals.cjs` committed so the generator cannot be lost again |
| 2026-08-17 | `a0ccf32` | התלקחויות עדשה בקצוות הגבישים | Lens flare; Hebrew “ברק” had been misread as electricity |
| 2026-08-23 | `d1b6ba6` | מסמך סיכום טכני לפני המעבר ל-Next.js | **Restore point for the static site.** `TECHNICAL-SUMMARY.md` describes this era |
| 2026-08-23 | `afdb9b4` | מעבר ל-Next.js 16 — App Router + TypeScript strict | 1:1 conversion. Intentional exception: fix the duplicated `a11y()` IIFE that made the widget unopenable. `vercel.json` → `next.config.mjs`. Accessibility verified against a production build |
| 2026-08-23 | `289ef21` | Phase 2 חלקי — תשתית Supabase | Migrations + server client + env. Contact-channel logic **not** built — the spec was truncated. No `link`/`push` |
| 2026-08-23 | `1c50fe1` | הוצאת tsconfig.tsbuildinfo מ-git | Build artifact |
| 2026-08-23 | `9ff74c5` | Phase 2: בחירת אמצעי קשר + שכבת Supabase | `mode: 'email' \| 'whatsapp'`. Same validation pipeline; split only after. `logLead()` never throws. Type trap: schema types must be `type`, not `interface` |

### Significant refactors

1. **v1 → v2 → v3 design** (palette and type, not architecture).
2. **SVG crystals → live WebGL → baked WebP.** Each step was a client rejection plus a technical lesson (SVG cannot do dispersion; live GL was too heavy; bake the expensive shader).
3. **Static `index.html` + `api/contact.js` + `vercel.json` → Next.js 16 App Router + Route Handler + `next.config.mjs`.** Claimed 1:1 visually. One bugfix (a11y). Four conversion traps documented in `log.md` (`next/font` literals, two font families, CSP phase vs `NODE_ENV`, `suppressHydrationWarning` on `<html>`).
4. **Email-only form → email | WhatsApp mode + optional Supabase log.** Principle: the visitor-facing channel is source of truth; the database is not allowed to fail the visitor.

### Decisions explicitly banned from being reintroduced (`MEMORY.md`)

- Gold accents
- Frank Ruhl Libre / any serif
- Running-code background, scan lines, “decode” intro
- Cyan as a UI color (rainbow only inside crystal art)
- Live WebGL / SVG crystals in the page without an explicit request
- Entrance animations that hide content unless JS runs
- Rewriting `clean()` “by eye” (it contains raw control characters `NUL`–`0x1F` and `DEL`)

---

## 10. Known Issues, Technical Debt & TODOs

### TODO / FIXME in code

The only `TODO`/`FIXME` hit in `*.{ts,tsx,js,mjs,sql,css}`:

```ts
// app/api/contact/route.ts
// TODO: server-side consent enforcement, see known issues
```

The `consent` checkbox (`#f-ok`, `name="consent"`, `required`) is enforced in the browser via `form.reportValidity()` in `ContactForm.onSubmit`. It is **not** part of `ContactPayload` and is **not** checked on the server. A direct `POST /api/contact` bypasses it. This was already documented for the static site in `TECHNICAL-SUMMARY.md` §8.5 and was carried forward on purpose.

### Documented but unfinished (`MEMORY.md` “פתוחים” + Phase 3)

These are checklist items, not code comments:

| Item | Evidence |
|---|---|
| Apply migrations (`supabase db push`) | `MEMORY.md`, `log.md` 2026-08-23 |
| Owner: run `npx vercel --prod` | `MEMORY.md`, `DEPLOY.md` |
| Register as עוסק פטור before taking first payment | Legal copy + `DEPLOY.md` + `MEMORY.md` |
| Lawyer review of the three legal dialogs | `MEMORY.md` — they are templates, not legal advice |
| Confirm risk-reversal wording (“לא אהבתם? נפרדים כידידים”) | `MEMORY.md` |
| Real logo (currently `LogoMark` triangle SVG with a purple bar) | `MEMORY.md` |
| Own domain, then update `robots.txt` Sitemap | `MEMORY.md`, `DEPLOY.md` |
| Photograph the page on a real device | `MEMORY.md` (headless Chrome enforces a minimum width and does not render the crystals the way a phone does) |
| Admin dashboard to view leads / set `status` | Phase 3, not built |
| Public portfolio UI reading `portfolio_items` | Table + RLS policy exist; no UI |
| Confirm the truncated `portfolio_items` SELECT policy | `log.md` — awaiting confirmation |

### Gaps visible in the current tree (not always labeled TODO)

1. **`.linklike` has no CSS.** `ContactForm` uses `className="linklike"` on the privacy-policy `<button>`. Grep finds no `.linklike` rule. `.consent a` exists but this control is a `button`, so it will not get the neon underline. Visual treatment of that control is incomplete.

2. **Hero intro CSS is gone.** `INTRO_SCRIPT` still adds `html.intro`, and `useReveal` still removes it after 3200 ms (“1.2 delay + 1.5 longest animation + slack”). In `globals.css` the only `intro` rule is `html:not(.intro) .hero__art img { opacity:1 }`. There are **no `@keyframes`** and no `html.intro .hero__in` hide/animate rules. The fail-open comment remains; the actual title entrance animation from the static site was not ported (or was deleted). Image fade-in still works via `.hero__art img` opacity + `.is-on`.

3. **Leftover crystal selectors.** `@media (prefers-reduced-motion:reduce)` still has `.cr svg` / `.cr { animation:none }`. No `.cr` markup exists. Harmless dead CSS from the SVG era.

4. **`robots.txt` Sitemap 404.** Points at `https://arcodemia.co.il/sitemap.xml`. No sitemap file. Domain status **unclear from code**.

5. **Hero `<picture>` dimension attributes do not match the files.** Comments and history say 1800×1120 (wide) and 900×1150 (tall). `Hero.tsx` sets `<source … width={900} height={1100}>` and `<img … width={1920} height={840}>`. These attributes affect aspect-ratio hinting, not decoding. Whether the mismatch is leftover from an older crop is **unclear from code**.

6. **JSON-LD FAQ (5 items) ≠ on-page FAQ (7 items)** plus small wording differences. See §3.

7. **`TECHNICAL-SUMMARY.md` is stale.** It describes plain HTML, `api/contact.js`, `vercel.json`, zero npm dependencies, no database. Useful as a snapshot of `d1b6ba6`. Misleading if read as current.

8. **`DEPLOY.md` is partially stale.** Next.js note at the top is current; env step omits Supabase; local path is from another machine; crystal troubleshooting is updated to `public/img/` (good).

9. **`MEMORY.md` is partially stale.** Says no git remote — `origin` now exists. Says `.env.local` has five keys filled — that file is not in this workspace.

10. **`tools/render-crystals.cjs` header is inaccurate** (also in `TECHNICAL-SUMMARY.md` §8.4, still true):
    - Documents `node tools/render-crystals.js` — file is `.cjs`.
    - Documents a 4th positional `wide|tall`. The script only reads `argv[2..4]` as `W`, `H`, `TILE`.
    - The tool does **not** write a WebP. It writes `tools/_render.html` (gitignored). A human must run headless Chrome (`--use-angle=d3d11` for a real GPU) and extract the `#out` data-URI.

11. **Rate limiter is best-effort.** `throttled(ip)` is a module-scoped `Map`, 1 request / 20 s / IP, prune after 60 s. IP from `x-forwarded-for[0]` else `x-real-ip` else `'unknown'`. Serverless instances do not share this Map. Documented in the static-era summary; the same pattern is in `route.ts`.

12. **Honeypot returns success.** If `_gotcha` is truthy, the handler returns `{ ok:true, mode }` without inserting or emailing, so bots cannot learn they were caught.

13. **WhatsApp-mode “success” does not prove the chat opened.** The API returns 200 after `logLead()`. The client opens `wa.me` in the same click. Popup blockers / in-app browsers can still fail the user-facing step; the form then shows “פתחנו לכם וואטסאפ עם הפרטים.” anyway on `res.ok`.

14. **`seed.sql` missing** while `config.toml` references it.

15. **No tests in the repo.** Historical notes mention Puppeteer/headless Chrome checks during the Next.js migration; those scripts are not committed.

16. **ESLint 9.39.5** is flagged `deprecated` in the lockfile.

17. **`clean()` contains raw control characters.** `MEMORY.md` warns: do not rewrite the regex by what it *looks like* in an editor (`[` plus invisible chars plus `-]`), or you will strip spaces/hyphens and break phone numbers **and** the header-injection defense.

18. **`getSupabase()` vs `optionalEnv()` on `REPLACE_ME`.** Inconsistent (see §4). Low risk today because only `logLead()` calls the client, and it checks `optionalEnv` first.

---

## 11. Running the Project Locally

### Prerequisites

- Node.js **≥ 20** (`package.json` `engines`). `DEPLOY.md` author’s machine: Node 24.
- npm (lockfile is v3).
- Optional: Vercel CLI (only if you want to mimic production deploy).
- Optional: Supabase CLI (`supabase` is already a devDependency) if you want a local database.
- Optional: Chrome with `--use-angle=d3d11` if you need to regenerate hero art.

`node_modules` is **not** present in this workspace snapshot; install is required.

### 1. Install

```bash
npm install
```

### 2. Environment

```bash
cp .env.example .env.local
```

Fill names from §7. Empty or `REPLACE_ME` counts as unset.

**Minimum to see the page:** none. The marketing page is static from the visitor’s point of view.

**Minimum for the email path of the form:** none on the server. Email mode opens a `mailto:` link to `CONFIG.email`.

**Minimum to persist leads:** `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`, **and** the `leads` table already on that project. Without them the form still opens WhatsApp/mail for the visitor; the server logs that the lead was not recorded.

This workspace has a local `.env.local` (gitignored).

### 3. (Optional) Supabase schema

From `log.md`, this has **not** been done for the hosted project:

```bash
npx supabase link   # needs SUPABASE_PROJECT_REF
npx supabase db push
```

Local stack (optional, `config.toml` present):

```bash
npx supabase start
```

Expect `seed.sql` to be missing if you `db reset`.

### 4. Dev server

```bash
npm run dev
```

Open the URL Next prints (typically `http://localhost:3000`). RTL landing page at `/`. Form posts to `/api/contact`.

### 5. Checks used in this repo

```bash
npm run typecheck
npm run lint
npm run build
npm start          # after a successful build
```

### 6. Regenerate hero crystals (optional, offline)

```bash
node tools/render-crystals.cjs 1800 1120 450
node tools/render-crystals.cjs 900 1150 450
```

Then run the emitted `tools/_render.html` through headless Chrome with a real GPU, dump the DOM, and save the `#out` WebP data-URI as `public/img/hero-wide.webp` / `hero-tall.webp`. The header comment’s `.js` filename and unused `wide|tall` argument are wrong; `argv` is `W H TILE` only.

### What you will not get locally without extra accounts

- A row in `leads`, without a real (or local) Supabase project **and** the `leads` table present.
- Vercel production headers exactly as in production — `next dev` CSP includes `'unsafe-eval'` and looser `connect-src`. To inspect production CSP: `curl -sI` against a production URL, not the eye test (`log.md`).

---

## Appendix A — Contact API contract

`POST /api/contact` (`app/api/contact/route.ts`). JSON body shaped as `ContactPayload` (`lib/types.ts`).

| Field | Client | Server |
|---|---|---|
| `name` | string | `clean()`, max 80, length ≥ 2 or `400 name` |
| `phone` | string | `clean()`, max 30, must match `/\d{7,}/` after stripping non-digits or `400 phone` |
| `business` | string | `clean()`, max 80; empty → `null` in DB |
| `message` | string | sliced to 2000, trimmed; **not** passed through `clean()` (newlines kept for the mail/WhatsApp body); empty → `null` |
| `mode` | `'email'` \| `'whatsapp'` | anything other than `'whatsapp'` becomes `'email'` (`parseMode`) |
| `_gotcha` | honeypot | truthy → `{ ok:true, mode }` with no side effects |
| `consent` | checkbox, not in JSON | ignored on the server |

Pipeline order: IP throttle → JSON parse → honeypot → sanitize/validate → `logLead` → `200` for both modes.

| Status | Body | When |
|---|---|---|
| 200 | `{ ok:true, mode }` | After validation (both modes); honeypot |
| 400 | `{ ok:false, error:'bad_json'\|'bad_body'\|'name'\|'phone' }` | Parse / validation |
| 405 | `{ ok:false, error:'method_not_allowed' }` | `GET` (explicit). Other methods: Next default 405 |
| 429 | `{ ok:false, error:'too_many' }` | Same IP within 20 s |

Client (`ContactForm`): opens WhatsApp or `mailto:` **before** `fetch`. `429` → wait message; other API failures still leave the opened app as the visitor-facing result. If `CONFIG.endpoint` is `''`, skip the network.

`clean()` strips `\r`, `\n`, and control chars `U+0000–U+001F` plus `DEL` (`U+007F`), then trim + slice — header-injection defense.

### Accessibility store (`hooks/useA11yPreferences.ts`)

`localStorage` key `arcodemia:a11y`:

```ts
{
  fs: 0 | 1 | 2 | 3,  // html[data-fs], font-size 112% / 124% / 138%
  contrast: boolean,  // html.a11y-contrast — also hides hero art, grain, frame
  gray: boolean,      // html.a11y-gray
  links: boolean,     // html.a11y-links
  nomotion: boolean,  // html.a11y-nomotion
  spacing: boolean,   // html.a11y-spacing
  readable: boolean   // html.a11y-readable → Arial/Segoe UI
}
```

`useSyncExternalStore` so it is SSR-safe (server snapshot is the frozen `INITIAL`). Implemented this way to avoid `react-hooks/set-state-in-effect`. The duplicated-IIFE bug from `index.html` is fixed: one `useState` in `A11yWidget`, one click handler. Escape, outside click, and focus-on-open are implemented.

---

## Appendix B — Design tokens (from `app/globals.css` `:root`)

| Token | Value | Role |
|---|---|---|
| `--bg` | `#000000` | Canvas |
| `--neon` | `#B14BFF` | Sole interactive accent |
| `--neon-hi` | `#C97BFF` | Hover / eyebrow |
| `--ink` | `#FFFFFF` | Headings / primary button fill |
| `--wa` | `#25D366` | WhatsApp brand, not a competing accent |
| `--ir-1`…`--ir-5` | pink/purple/cyan | **Named for crystals; not used as UI chrome** |
| `--font` | `--font-heebo-he`, `--font-heebo-latin`, system | |
| `--t-display` | `clamp(2.05rem, 5.6vw, 4.15rem)` | H1 |
| `--lock` | `1240px` | `.wrap` max width |
| Breakpoints in CSS | 360 / 400 / 520 / 640 / 833–834 / 900 / 1000 | 833/834 is the hero art-direction split |

Gold is mentioned in a CSS banner comment (“קו דק בלבד, לא שטח”) but there is no gold color token in `:root`. Do not add one (`MEMORY.md` ban).

---

*End of PROJECT_BRAIN. If a sentence is not in this file, it was not settled by the repository at `9ff74c5`.*
