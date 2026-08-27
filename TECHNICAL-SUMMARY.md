# ARCODEMIA — Technical Summary

> Self-contained handoff document. Written so an AI assistant with no prior access to
> this repository can understand the project from a single read.
>
> **Generated:** 2026-08-17 · **Commit at time of writing:** `a0ccf32`
> **Repo root:** `c:\Users\hezie\OneDrive\Desktop\Projects\Personal\site-1`
>
> **Superseded:** this snapshot describes a later-removed server-side transactional email path. The current app opens `mailto:` / WhatsApp on the client and logs leads to Supabase. Follow `PROJECT_BRAIN.md` and `DEPLOY.md`, not the email/env setup below.

---

## 1. PROJECT OVERVIEW

### Elevator pitch

ARCODEMIA is a single-page, static Hebrew/RTL marketing landing page for a two-person
Israeli agency that builds landing pages for local businesses — barbershops, garages,
clinics, restaurants. The page *is* the product demo: the agency has no client portfolio,
so the site's own craft is the proof. Its single conversion goal is to get a business
owner to make contact, primarily via WhatsApp.

### Purpose and positioning

The commercial premise is documented in `MEMORY.md` §הבריף (the brief):

| Decision | Value |
|---|---|
| Brand | **ARCODEMIA** (was "Aristocraft" until 2026-08-06 — any remaining occurrence is a leftover) |
| Audience | Local Israeli businesses |
| Product | Landing pages only — nothing else |
| Proof | No real portfolio. **The page itself is the proof.** |
| Pricing | Never shown. CTA is always "contact us for a quote" |
| Delivery time | No number committed to; settled in the first call |
| Differentiator | Risk reversal — *"קודם רואים. רק אחר כך משלמים"* (see the design first; if you don't like it you walk away, no cancellation fee) |
| Stack | Static HTML/CSS/JS, single file |

### Main use cases

1. Visitor lands → reads pain-point cards → taps WhatsApp (message pre-filled).
2. Visitor fills the contact form → serverless function emails the owner → confirmation shown.
3. Visitor opens legal documents (privacy / terms / accessibility) from the footer.
4. Visitor with a disability opens the accessibility widget and applies display adjustments.
   **⚠️ This path is currently broken — see §8, defect 1.**

### Owner contact (hardcoded, real values)

- Email: `arcodemia.il@gmail.com`
- Phone (display): `052-382-2083` · (dial/WhatsApp): `+972523822083` / `972523822083`

### Deployment status

**Not live.** No git remote, no `.vercel/` directory, no domain. Everything is prepared;
step 1 of `DEPLOY.md` has not been executed.

---

## 2. TECH STACK

### Frontend — none

Plain HTML5 + CSS + vanilla ES2020 JavaScript.
**No React, Vue, Svelte, bundler, build step, CSS preprocessor, or `node_modules`.**

`index.html` is 1,583 lines / ~89 KB and contains everything:

| Block | Size |
|---|---|
| Inline `<style>` | 621 lines |
| Inline `<script>` | 315 lines |
| Markup + inline SVG + JSON-LD | remainder |

### Backend

One Vercel Serverless Function: `api/contact.js`.

- Node ≥ 20 (`package.json` → `engines`)
- ESM (`package.json` → `"type": "module"`)
- **Zero npm dependencies** — uses global `fetch`

### Database — none

Grepped for `supabase|postgres|mongo|mysql|sqlite|prisma|drizzle|sequelize|firebase|redis`
across all `.js`, `.json`, `.html`, `.cjs`, `.md` — **zero hits** outside the Hebrew
changelogs. No ORM, no raw queries, no persistence layer, no migrations, no seed files.

Form submissions are emailed and **never stored**. The only client-side persistence is
`localStorage` under key `arcodemia:a11y` for accessibility preferences.

### Hosting / deployment

Vercel, configured in `vercel.json` (`cleanUrls: true`, `trailingSlash: false`).
No Dockerfile, no CI workflow, no GitHub Actions.

### Dependencies

`package.json` declares **no `dependencies` and no `devDependencies`** — only:

```json
{
  "type": "module",
  "engines": { "node": ">=20" },
  "scripts": {
    "dev": "vercel dev",
    "deploy": "vercel --prod"
  }
}
```

**External services used at runtime:**

| Service | Role |
|---|---|
| **wa.me** | WhatsApp deep links with `encodeURIComponent`-escaped prefilled text. |
| **Vercel** | Static hosting + serverless runtime + security headers. |

**Build-time only (not shipped to users):**

| Tool | Role |
|---|---|
| **Node.js** | Runs `tools/render-crystals.cjs` |
| **Headless Chrome** (`--use-angle=d3d11`) | Executes the WebGL shader to render hero art |
| **Python `fontTools`** | Subset the Latin font files (used once; not committed as a script) |

---

## 3. PROJECT STRUCTURE

```
site-1/
├── index.html                    1,583 lines — the entire website
├── package.json                  scripts + engines only, no deps
├── vercel.json                   security headers + cache policy
├── robots.txt                    allows all, disallows /api/
├── .env.example                  SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_PROJECT_REF
├── .gitignore                    node_modules, .vercel, .env*, *.log, tools/_render.html
├── DEPLOY.md                     Hebrew step-by-step launch runbook
├── MEMORY.md                     project memory / index
├── log.md                        append-only decision journal
├── TECHNICAL-SUMMARY.md          this file
│
├── api/
│   └── contact.js                161 lines — POST /api/contact
│
├── fonts/                        10 files, 164 KB total — self-hosted Heebo
│   ├── heebo-hebrew-400.woff2    ~12 KB
│   ├── heebo-hebrew-500.woff2    ~12 KB
│   ├── heebo-hebrew-700.woff2    ~12 KB
│   ├── heebo-hebrew-800.woff2    ~12 KB
│   ├── heebo-hebrew-900.woff2    ~12 KB
│   ├── heebo-latin-400.woff2     ~16 KB (subset to used glyphs)
│   ├── heebo-latin-500.woff2     ~16 KB
│   ├── heebo-latin-700.woff2     ~16 KB
│   ├── heebo-latin-800.woff2     ~16 KB
│   └── heebo-latin-900.woff2     ~16 KB
│
├── img/
│   ├── hero-wide.webp            1800×1120, 89 KB — desktop hero art
│   └── hero-tall.webp             900×1150, 85 KB — mobile hero art
│
└── tools/
    └── render-crystals.cjs       17.8 KB — build-time WebGL image generator
```

### Folder responsibilities

- **`api/`** — Vercel convention: any file here becomes a serverless route at
  `/api/<filename>`.
- **`fonts/`** — self-hosted so the CSP can forbid *all* external origins and the privacy
  policy can honestly claim zero third-party requests.
- **`img/`** — pre-rendered hero art. Baked once; zero runtime cost.
- **`tools/`** — developer-only. The `.cjs` extension is deliberate: `package.json` sets
  `"type": "module"`, so a `.js` file would be parsed as ESM and `require()` would fail.

### Naming and organizational conventions

- Comments and git commit messages are in **Hebrew**; code identifiers in English.
- CSS uses **logical properties throughout** (`inset-inline-start`, `margin-block-end`,
  `padding-inline`) rather than physical ones — required for correct RTL behavior.
- BEM-ish class naming: `.hero__in`, `.card__icon`, `.dline__ic--wa`, `.a11y-btn`.
- CSS is organized into ~25 banner-commented sections. Comments explain *why*, and often
  record a specific bug that was hit and how it was fixed.
- `MEMORY.md` + `wiki/` are a deliberate persistent-memory system for cross-session
  continuity, not generated documentation. **Read `MEMORY.md` first.**

---

## 4. PAGES / ROUTES / SCREENS

**One HTML document. No router, no client-side navigation, no SPA behavior.**

| Route | Type | Purpose |
|---|---|---|
| `/` (`index.html`) | Static | The entire site |
| `/api/contact` | Serverless, POST only | Form → email |
| `/robots.txt` | Static | Crawler policy |

### In-page sections

Anchor navigation via `scroll-behavior: smooth` and `scroll-padding-block-start: 96px`.

| Anchor | Section class | Content |
|---|---|---|
| — | `.hero` | `<picture>` crystal art, H1, lead paragraph, WhatsApp + form CTAs, 3 trust chips |
| `#why` | `.pain` | 4 pain-point cards ("you're losing customers because…") |
| `#process` | — | 4 numbered steps (CSS counters) |
| `#risk` | — | Risk reversal: see design first, part as friends, you own the domain |
| `#faq` | — | 7 `<details>` accordions |
| `#contact` | — | Centered heading + 2 columns: direct contact lines / lead form |
| — | `footer.foot` | Copyright + 3 legal document triggers |

### Overlays

- Three native `<dialog>` elements: `#docPrivacy`, `#docTerms`, `#docA11y`, opened with
  `.showModal()`.
- One non-modal accessibility widget: `#a11yPanel`, toggled by `#a11yBtn`.

### Navigation flow

1. Nav links (`#why → #process → #risk → #faq → #contact`) scroll in-page.
2. Every WhatsApp CTA opens `wa.me` in a new tab with `rel="noopener noreferrer"`.
3. `#fab` (floating WhatsApp button) appears once `window.scrollY > 460`.
4. Footer buttons open legal dialogs. Dialogs close via the ✕ button, `Escape`, or a click
   outside the dialog rectangle — detected by comparing `e.clientX/clientY` against
   `getBoundingClientRect()`, because the backdrop is part of the `<dialog>` element and
   is not a separate event target.

---

## 5. COMPONENTS / MODULES

There are no components in the framework sense. These are CSS class families and JS IIFEs.

### CSS component families

| Family | Variants / notes |
|---|---|
| `.btn` | `--primary` (white), `--wa` (WhatsApp green), `--ghost` (outline), `--sm`, `--block` |
| `.card` | + `.card__icon`; `.pain .card__icon` is a tonal variant |
| `.stepc` | Process steps, numbered via CSS counters |
| `.faq details/summary` | Accordion with custom chevron, glow on hover |
| `.dline` | Direct-contact row; `__ic--wa` / `--ph` / `--ml` icon variants |
| `.field` | Form row: label + input/textarea |
| `.doc` | Legal `<dialog>`: `__bar`, `__x`, `__body`, `__updated` |
| `.a11y-panel` | Accessibility widget grid |
| `.fab` | Floating WhatsApp button |
| `.eyebrow` | Small letterspaced label with rule |
| `.rv` | Scroll-reveal wrapper |

### Design tokens

46 CSS custom properties on `:root`. The palette is deliberately three colors:

- **Pure black** canvas (`#000`)
- **White** type
- **Neon purple `#B14BFF`** — the single interactive accent

WhatsApp green is treated as an external brand mark, not a competing accent.

> `MEMORY.md` §"מה ירד ולמה — אל תחזיר את זה" explicitly forbids reintroducing gold
> accents or a serif typeface. Both were tried and rejected.

### JavaScript modules

All inside the single inline `<script>`.

| Name | Purpose |
|---|---|
| `CONFIG` | Single source of truth: `whatsapp`, `phone`, `phoneDial`, `email`, `endpoint` |
| `BRAND` | `'ARCODEMIA'` — interpolated into WhatsApp messages |
| `waURL(text)` | Builds a `wa.me` deep link with encoded prefilled message |
| `extLink(el, href)` | Sets `href` + `target="_blank"` + `rel="noopener noreferrer"` |
| `setBdi(id, value)` | Injects text via `createElement('bdi')` + `textContent` — **never `innerHTML`** |
| `say(msg, isErr)` | Renders form status into `#formOk` |
| `toWhatsApp(d)` | Fallback: packs form data into a WhatsApp message |
| `heroArt()` (IIFE) | Fades hero art in on image `load` / `error` |
| `a11y()` (IIFE) | Accessibility widget — **duplicated, see §8 defect 1** |
| `sweep()` | Safety net revealing any `.rv` element the IntersectionObserver missed |
| `showFab()` | Toggles `.is-on` on the floating button past 460 px scroll |
| `io` | `IntersectionObserver` driving `.rv` reveals, threshold `.12` |

### Progressive-enhancement pattern

`document.documentElement.classList.add('intro')` runs inline in `<head>`. CSS hides
animated elements **only** under `html.intro`. If JS is disabled the class is never added
and all content is visible immediately. The class is removed after 3,200 ms.

### Performance technique

`@supports (content-visibility: auto)` applies `content-visibility: auto` +
`contain-intrinsic-size: auto 620px` to below-fold sections. The hero is excluded so it
never pops in.

---

## 6. DATA MODELS & DATABASE SCHEMA

**There is no database and no persisted data model.** Nothing exists at the schema level.

Two ephemeral structures exist.

### A. Form payload

Client → `POST /api/contact`, JSON. Defined and validated in `api/contact.js`
(constants at line 14, validation at lines 65–71).

| Field | Type | Max | Validation |
|---|---|---|---|
| `name` | string | 80 | required, ≥ 2 chars after cleaning |
| `phone` | string | 30 | required, ≥ 7 digits after stripping non-digits |
| `business` | string | 80 | optional, free text |
| `message` | string | 2000 | optional |
| `_gotcha` | string | — | honeypot — if truthy, returns `200 {ok:true}` without sending |

> The `consent` checkbox (`#f-ok`) is enforced client-side via `reportValidity()` but is
> **not** transmitted to or validated by the server.

### B. Accessibility preferences

`localStorage["arcodemia:a11y"]`:

```js
{
  fs: 0 | 1 | 2 | 3,   // font-size step
  contrast: boolean,
  gray:     boolean,
  links:    boolean,
  nomotion: boolean,
  spacing:  boolean,
  readable: boolean
}
```

Applied as classes on `<html>` (`a11y-contrast`, `a11y-gray`, `a11y-links`,
`a11y-nomotion`, `a11y-spacing`, `a11y-readable`) plus a `data-fs` attribute.

---

## 7. BACKEND LOGIC & APIs

### `POST /api/contact` — `api/contact.js` (161 lines)

Default-exported Vercel handler. Pipeline in order:

1. **Method guard** — non-POST → `405` with `Allow: POST`.
2. **Rate limit** — `throttled(ip)` keeps a module-scoped `Map` of IP → timestamp.
   One request per IP per 20 s; entries pruned after 60 s. IP taken from
   `x-forwarded-for[0]`, falling back to `req.socket.remoteAddress`. → `429`.
   *The code comments honestly note this is best-effort only, since serverless instances
   are recycled and state is not shared between them.*
3. **Body parsing** — accepts object or JSON string → `400 bad_json` / `bad_body`.
4. **Honeypot** — `_gotcha` truthy → returns `200 {ok:true}` **deliberately**, so bots
   cannot learn they were caught.
5. **Sanitization** — two distinct helpers with different jobs:
   - `clean(s, max)` strips `\r`, `\n` and control characters →
     **prevents email header injection** through form fields.
   - `esc(s)` HTML-escapes `& < > " '` → prevents markup injection into the email body.
6. **Validation** → `400` with `error: 'name' | 'phone'`.
7. **Config check** — (removed in the current app; the handler no longer sends mail).
8. **Compose** — RTL HTML email (table-based layout, dark gradient header, ARCODEMIA
   wordmark, field rows, quoted message block, "Reply on WhatsApp" + "Call" buttons)
   plus a plain-text alternative. Timestamp via
   `toLocaleString('he-IL', { timeZone: 'Asia/Jerusalem' })`. A `wa.me` reply link is
   auto-derived from the submitted phone number.
9. **Send** — (removed in the current app; the visitor opens `mailto:` / WhatsApp).

#### Environment variables

See `.env.example` in the current tree (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_PROJECT_REF`). Real values go into Vercel project settings.

#### Response contract

| Status | Body | Meaning |
|---|---|---|
| `200` | `{ok:true}` | Sent (or honeypot silently absorbed) |
| `400` | `{ok:false, error:'bad_json'\|'bad_body'\|'name'\|'phone'}` | Validation failure |
| `405` | `{ok:false, error:'method_not_allowed'}` | Wrong method |
| `429` | `{ok:false, error:'too_many'}` | Rate limited |

### Client-side submit handler

In `index.html`. Behavior:

- Guards re-entry with a `sending` flag.
- Disables the submit button and swaps its label to `שולח…`.
- POSTs JSON to `CONFIG.endpoint`.
- `res.ok` → `form.reset()` + success message.
- `429` → "you just sent a message, wait a moment".
- Any other failure → **falls back to opening WhatsApp with the data prefilled**, so the
  form never dead-ends.
- If `CONFIG.endpoint` is empty string → skips the network entirely and goes straight to
  the WhatsApp fallback.

### Security posture

`vercel.json` sets, for all routes:

| Header | Value / note |
|---|---|
| `Content-Security-Policy` | `default-src 'self'`, `object-src 'none'`, `base-uri 'none'`, `frame-ancestors 'none'`, `upgrade-insecure-requests`. `'unsafe-inline'` required for script/style because everything is inline. |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` |
| `X-Content-Type-Options` | `nosniff` |
| `X-Frame-Options` | `DENY` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Cross-Origin-Opener-Policy` | `same-origin` |
| `Cross-Origin-Resource-Policy` | `same-origin` |
| `X-DNS-Prefetch-Control` | `off` |
| `Permissions-Policy` | denies 24 features (camera, microphone, geolocation, payment, USB, `interest-cohort`, …) |

Cache policy: `/fonts/*` and `/img/*` get `public, max-age=31536000, immutable`;
`/api/*` gets `no-store` + `X-Robots-Tag: noindex`; `/index.html` gets
`public, max-age=0, must-revalidate`.

> **Why CSP is in headers and not `<meta>`** — documented at `index.html:60`. Two reasons:
> headers can enforce `frame-ancestors` (meta ignores it entirely), and under the `file://`
> protocol the origin is opaque so `'self'` matches nothing, which would block the local
> fonts every time the file is opened by double-click for testing.

### Other application-level security measures

- No `innerHTML` anywhere — all dynamic text goes through `textContent` / `createElement`.
- All external links carry `rel="noopener noreferrer"`.
- The email address is injected by JS from `CONFIG`, so it does not appear in the static
  HTML and is not harvested by scrapers reading the source.
- Honeypot field `_gotcha` in the form, visually hidden and `tabindex="-1"`.

---

## 8. KNOWN DEFECTS AND GAPS

### 🔴 1. The accessibility widget is broken — verified by test, not inference

`(function a11y(){ … })()` is **duplicated verbatim** at `index.html:1468` and
`index.html:1527`. Both register a click listener on `#a11yBtn`. Each computes
`setOpen(!panel.hasAttribute('open'))` at its own execution time, so listener A opens the
panel and listener B immediately closes it again within the same click event.

Verified in headless Chrome by clicking the real button in a real DOM:

```
before click:   open=false
after 1 click:  open=false
after 2 clicks: open=false
a11y IIFE count in source: 2
```

**The panel can never be opened.** The site advertises this widget in its published
accessibility statement (`#docA11y`), which makes it a compliance exposure under Israeli
accessibility regulations, not merely a UI bug.

**Fix:** delete one of the two identical IIFE blocks.

### 🟡 2. `robots.txt` points to a nonexistent sitemap

References `https://arcodemia.co.il/sitemap.xml`. No `sitemap.xml` exists in the repo and
that domain is not registered or configured.

### 🟡 3. `DEPLOY.md` troubleshooting table is stale

Line 137 says the crystals may not appear on "a browser without WebGL". The crystals were
converted to static WebP images on 2026-08-06; **there is no runtime WebGL left in the
page.** That row should be removed or rewritten.

### 🟡 4. `tools/render-crystals.cjs` header comment is inaccurate

- Documents `node tools/render-crystals.js …` — wrong extension (file is `.cjs`).
- Documents a 4th positional argument `wide|tall` that the script **never reads**. Only
  `argv[2..4]` (W, H, TILE) are used.
- The tool does **not** write an image. It emits `tools/_render.html`, which must then be
  run through headless Chrome; the resulting base64 data-URI is extracted from the DOM
  manually and saved. This multi-step workflow is not spelled out in the header.

### 🟡 5. `consent` checkbox is not server-enforced

A direct POST to `/api/contact` bypasses the consent checkbox entirely.

---

## 9. NOTABLE IMPLEMENTATION DETAIL — the hero art pipeline

The crystals in the hero are **pre-rendered images**, not live 3D.

`tools/render-crystals.cjs` generates a WebGL page that raymarches a signed-distance
field — a hexagonal prism intersected with six angled planes, producing a doubly
terminated quartz crystal. Rendering features:

- **8-wavelength spectral dispersion** (per-wavelength index of refraction, 1.372 → 1.618)
  rather than a 3-channel RGB approximation
- **Rectangular softbox studio lighting** (`rectLight()`) rather than point lights — this
  is what makes facets read as polished glass instead of plastic
- **Beer's-law absorption** along the internal ray path
- Up to **three internal reflections** (total internal reflection chain)
- An internal **fracture field** (`crackField()` — minimum of three noise-warped sine planes)
- **Anamorphic lens flares** at the crystal tips (`flare()` — core + horizontal streak +
  star rays + halo)
- **4× supersampling** per pixel
- **Two-layer post-process bloom** applied on a 2D canvas (26 px and 7 px blurs composited
  with `globalCompositeOperation='lighter'`)

Rendering is split into **tiles** because a shader running longer than ~2 s continuously
triggers a GPU TDR (Timeout Detection and Recovery) reset and the WebGL context is lost.
Output is a WebP data-URI at quality `0.93`.

**Runtime cost of all of this is zero.** The page ships two `<picture>` sources and nothing
else — no shader, no canvas, no animation loop.

### Two responsive crops

| File | Dimensions | Served when |
|---|---|---|
| `img/hero-wide.webp` | 1800×1120 | `min-width: 834px` |
| `img/hero-tall.webp` | 900×1150 | `max-width: 833px` |

Both are `<link rel="preload" as="image">` with `fetchpriority="high"` and matching `media`
attributes, so only the needed one is fetched.

### Total page weight

Roughly **200 KB** on first load: `index.html` (89 KB) + one hero image (~85–89 KB) +
two preloaded Hebrew font weights (~24 KB). Fonts and images are immutably cached for a
year.

---

## 10. HOW TO WORK ON THIS PROJECT

### Local preview

Open `index.html` directly in a browser (double-click). Everything works except
`/api/contact`, which needs the Vercel runtime.

For the full stack including the API:

```bash
npm run dev        # → vercel dev
```

### Deploy

```bash
npm run deploy     # → vercel --prod
```

`DEPLOY.md` contains the complete first-time runbook in Hebrew: Vercel signup → `npx vercel login` → `npx vercel --prod` → two `npx vercel env add` commands for Supabase →
redeploy.

### Regenerate the hero art

```bash
node tools/render-crystals.cjs 1800 1120 450     # wide
node tools/render-crystals.cjs  900 1150 450     # tall
```

Then run the emitted `tools/_render.html` through headless Chrome with
`--use-angle=d3d11` (real GPU; without it SwiftShader software rendering is used and it is
far slower) and extract the base64 data-URI from `#out` in the dumped DOM.

### Read first

`MEMORY.md` — it records which design directions were tried and **rejected**, and why.
Several sections are explicit "do not reintroduce this" warnings that will save you from
repeating work that was already discarded.

---

*End of summary.*
