---
title: "feat: Build losgigantesguide.com static website"
type: feat
status: active
date: 2026-04-05
deepened: 2026-04-05
---

# feat: Build losgigantesguide.com static website

## Overview

Build a fully static, SEO-first, accessible local guide website for Los Gigantes, Tenerife targeting British tourists and long-stay visitors aged 35–65. The site lists activities, restaurants, services, dance lessons, and accommodation — with insider tips from the site owner's lived perspective. Built with Astro 5.x, styled with Tailwind CSS v4, and deployed on Cloudflare Pages. No CMS, no server-side rendering, no client-side JavaScript required for navigation.

## Problem Frame

British tourists and long-stay visitors to Los Gigantes currently rely on TripAdvisor and generic travel blogs that offer consensus-driven, hype-filled content. The site owner lives in Los Gigantes and runs salsa/bachata dance classes — they want a trusted, specific, and honest guide that also promotes their own services. The audience skews older (35–65), includes people with vision impairments, and expects real details (times, prices, insider tips) rather than marketing copy.

## Requirements Trace

- R1. Static site — no server, no database; all pages pre-rendered at build time
- R2. Hosted on Cloudflare Pages; deploy on git push
- R3. SEO-optimised: structured data, sitemap, canonical URLs, keyword strategy (primary: "Los Gigantes")
- R4. Accessible: WCAG 2.1 AA minimum, with senior-friendly typography (18px base, rem units, 1.7 line-height)
- R5. Brand guide compliant: Playfair Display headings, Inter body, colour tokens from `los_gigantes_brand_guide.html`
- R6. Content categories: activities, restaurants, services, dance lessons, accommodation
- R7. No-JavaScript tag filtering via pre-rendered `/tags/[tag]/` pages
- R8. Contact CTA: WhatsApp deep link (`wa.me`) + visible phone number for dance lessons and services
- R9. Listing schema: status field (`open | seasonal | closed`) with visual badges; content rot mitigation
- R10. Mobile-first responsive layout; correct lazy image loading with no layout shift (CLS = 0)

## Scope Boundaries

- No CMS — content is Markdown files committed to git by the site owner
- No client-side JavaScript filtering — all filter states are pre-rendered pages
- No booking system — CTAs link to WhatsApp/phone/email; no form processing
- No Spanish or German localisation in v1 — English only
- No blog/news section in v1
- No user accounts, comments, or ratings
- Tag pages will be `noindex` in v1 to avoid thin-content SEO penalty; can be flipped once each tag page has curated introductory copy

## Context & Research

### Relevant Code and Patterns

- `los_gigantes_brand_guide.html` — authoritative source for all design tokens, typography, voice, and brand preview
- No existing Astro patterns in this repo — this is a greenfield build

### Institutional Learnings

No `docs/solutions/` exists. This section will be populated as the build progresses.

### External References

- [Astro 5.x Content Layer API](https://docs.astro.build/en/guides/content-collections/) — `src/content.config.ts`, `glob()` loader, `schema: ({ image }) => z.object({})`
- [Astro Images](https://docs.astro.build/en/guides/images/) — built-in `astro:assets`, no `@astrojs/image`
- [Tailwind CSS v4 + Astro](https://tailwindcss.com/docs/guides/astro) — `@tailwindcss/vite` Vite plugin, not the deprecated `@astrojs/tailwind`
- [Cloudflare Pages static deployment](https://docs.astro.build/en/guides/deploy/cloudflare/) — `output: 'static'`, no adapter needed
- [WCAG 2.1 AA contrast](https://www.w3.org/TR/WCAG21/#contrast-minimum) — 4.5:1 normal text, 3:1 large text
- [schema.org TouristAttraction](https://schema.org/TouristAttraction) / [Restaurant](https://schema.org/Restaurant) / [LocalBusiness](https://schema.org/LocalBusiness)

## Key Technical Decisions

- **Astro 5.x over Next.js/SvelteKit**: Pure static output with zero client JS by default; content collections with Zod validation prevent content rot; Cloudflare Pages supports it natively with no adapter
- **Tailwind CSS v4 (`@tailwindcss/vite`)**: CSS-first theming via `@theme` block replaces `tailwind.config.js`; `@astrojs/tailwind` is deprecated in Astro 5
- **Content as Markdown files (no CMS)**: Solo owner with developer access; git history provides audit trail; no external service dependency or cost
- **No Cloudflare adapter for static output**: `output: 'static'` with no adapter is the correct choice for a purely pre-rendered site; `@astrojs/cloudflare` is for SSR
- **`--sky-water` (#7DD4E8) removed from text usage**: Contrast ratio vs `--sea-salt` background is ~2.1:1, failing WCAG AA. Body links and interactive text will use `--cliff-deep` (#1A6B8A) at ~5.3:1. Sky water remains valid for decorative accents on dark/volcanic backgrounds only
- **Self-host fonts via `@fontsource` packages instead of Google Fonts CDN**: Eliminates the Google Fonts CDN request that sends user IP to Google (UK GDPR concern); removes render-blocking cross-origin request; zero performance overhead; Playfair Display (`@fontsource/playfair-display`) and Inter (`@fontsource/inter`) are available on npm with subsetting support. Unit 2 imports from `@fontsource/*` rather than linking `fonts.googleapis.com`.
- **18px base font size (not 16px)**: Senior-friendly default; `rem` units throughout so browser zoom and user font-size preferences are respected; `clamp()` for headings
- **Dance CTA as WhatsApp deep link**: `https://wa.me/[number]` works on both mobile (opens app) and desktop (opens WhatsApp Web); paired with visible phone number as fallback
- **Tag pages as `noindex`**: Prevents thin-content SEO penalty in v1; decision can be reversed once each tag page has curated introductory copy
- **Status field on all listings**: `status: open | seasonal | closed` required in schema; category indexes render status badges rather than hiding closed listings — preserves trust and avoids misleading omission

## Open Questions

### Resolved During Planning

- **Dance CTA destination**: WhatsApp `wa.me` deep link + visible phone/email fallback. If user is on desktop without WhatsApp Web, phone number and email are visible as plain text alternatives.
- **`--sky-water` on light backgrounds**: Fails contrast; resolved to use `--cliff-deep` for all text links on `--sea-salt` backgrounds.
- **Tag page indexing strategy**: `noindex` for v1; add `<meta name="robots" content="noindex, follow">` to the tag page layout.
- **Services nav placement**: "Services" is a 5th top-level nav item (the brand guide preview was illustrative, not exhaustive; the owner explicitly mentioned handymen, photographers).
- **Price storage**: Structured `priceRange` frontmatter field (enum `free | € | €€ | €€€`) on all content types — enables future filtering without content migration.
- **Image workflow**: Images in `src/assets/images/[category]/`, committed at reasonable web resolution (max 2000px wide, <500KB before Astro optimises). Astro's Sharp pipeline handles WebP/AVIF conversion at build time.
- **Body text colour**: `--cliff-deep (#1A6B8A)` used for all normal body text on `--sea-salt` backgrounds (~5.3:1 contrast, WCAG AA compliant). `--atlantic (#2E8FAA)` reserved for large-text UI elements (navigation, category labels at ≥18px bold) where 3.7:1 passes AA Large.

### Deferred to Implementation

- **Exact WhatsApp number and contact details**: Not yet provided by site owner — placeholder must be replaced before go-live.
- **Cloudflare CSP policy tuning**: Content Security Policy in `_headers` will need refinement once any third-party embeds (maps, analytics) are decided.
- **OG image strategy**: Start with a single branded default 1200×630px OG image; per-listing OG images via `getImage()` can be added later if the owner provides hero photos for each listing.
- **Cloudflare Web Analytics**: Script tag placement deferred to final deployment unit; needs a Cloudflare account `token` available at that point.
- **Whether to embed maps**: Google Maps or OpenStreetMap iframe embeds in detail pages are desirable but require a CSP `frame-src` allowlist decision; deferred to implementation.

## High-Level Technical Design

> *This illustrates the intended approach and is directional guidance for review, not implementation specification. The implementing agent should treat it as context, not code to reproduce.*

```
Content Layer (Markdown files)
  src/content/activities/*.md
  src/content/restaurants/*.md
  src/content/services/*.md
  src/content/dance-lessons/*.md
  src/content/accommodation/*.md
        │
        │ Zod schema validation at build time
        ▼
src/content.config.ts (5 collections + siteConfig)
        │
        │ getCollection() / getStaticPaths() at build
        ▼
Page routing (src/pages/)
  /                          → index.astro (homepage)
  /activities/               → category index
  /activities/[id]/          → detail page
  /restaurants/[id]/         → detail page
  /services/[id]/            → detail page
  /dance-lessons/            → single page (pinned nav CTA)
  /accommodation/[id]/       → detail page
  /tags/[tag]/               → pre-rendered filter pages (noindex)
  /404                       → 404.astro
        │
        │ BaseLayout.astro wraps all pages
        ▼
BaseLayout
  <html lang="en">
  <head>: SEO component, JSON-LD, OG tags, font preconnect, sitemap link
  <body>:
    Skip link → #main-content
    Header (logo + nav: Things to do / Restaurants / Services / Stay / Dance lessons CTA)
    <main id="main-content">
      [page content]
    </main>
    Footer (contact, copyright)
        │
        ▼
Cloudflare Pages (static)
  dist/ (Astro output)
  public/_headers  → cache + security headers
  public/_redirects
  public/robots.txt
  public/sitemap-index.xml (generated by @astrojs/sitemap)
```

## Implementation Units

---

- [ ] **Unit 1: Project Scaffold & Tooling**

**Goal:** Initialise the Astro 5 project with all required dependencies, git, TypeScript config, and Cloudflare deployment config.

**Requirements:** R1, R2

**Dependencies:** None

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`
- Create: `wrangler.jsonc`
- Create: `.gitignore`
- Create: `src/styles/global.css`
- Create: `public/robots.txt`

**Approach:**
- Init with `npm create astro@latest` using the "Empty" template — not blog or documentation starters, which impose opinionated layouts
- Install: `@tailwindcss/vite`, `@astrojs/sitemap`
- Do NOT install `@astrojs/tailwind` (deprecated), `@astrojs/image` (deprecated), or `@astrojs/cloudflare` (not needed for static output)
- `astro.config.mjs`: set `output: 'static'`, `site: 'https://losgigantesguide.com'`, `trailingSlash: 'always'`, `build.format: 'directory'`, `vite.plugins: [tailwindcss()]`, include `@astrojs/sitemap` integration
- `global.css`: `@import "tailwindcss";` and the `@theme {}` block with all brand tokens (see Unit 2)
- `tsconfig.json`: strict mode, path aliases for `@components`, `@layouts`, `@assets`
- `wrangler.jsonc`: `assets.directory: './dist'`, `assets.not_found_handling: '404-page'`
- `robots.txt`: `Allow: /`, `Sitemap:` pointing to `sitemap-index.xml`
- `.gitignore`: `node_modules/`, `dist/`, `.astro/`

**Test expectation: none — this is pure scaffolding with no runtime behaviour**

**Verification:**
- `npm run build` completes without errors on the empty scaffold
- `dist/` directory is created
- TypeScript compiles with zero errors

---

- [ ] **Unit 2: Design Token System & Global Styles**

**Goal:** Implement the full brand design system as Tailwind v4 CSS tokens and base component styles. All colour, typography, spacing, and interactive element styles derive from `los_gigantes_brand_guide.html`.

**Requirements:** R4, R5

**Dependencies:** Unit 1

**Files:**
- Modify: `src/styles/global.css`
- Create: `src/components/ui/Button.astro`
- Create: `src/components/ui/Badge.astro` (for status indicators: Open / Seasonal / Closed)
- Create: `src/components/ui/Logo.astro`

**Approach:**
- Define all CSS custom properties inside `@theme {}` in `global.css`:
  - `--color-cliff-deep: #1A6B8A` (primary, headers)
  - `--color-atlantic: #2E8FAA` (large-text UI elements, navigation, secondary labels — NOT normal body text)
  - `--color-sky-water: #7DD4E8` (accent — dark backgrounds ONLY)
  - `--color-sunset-coral: #C85A2A` (CTAs, dance category)
  - `--color-golden-hour: #E8A830` (warm highlights — not in original CSS vars, add it)
  - `--color-sea-salt: #FDF8F0` (page background)
  - `--color-sea-salt-dark: #F5EDD8` (alternate background)
  - `--color-volcanic: #2A5C70` (nav bar)
  - `--color-border: rgba(30, 107, 138, 0.15)` (hairline borders)
  - `--font-serif: 'Playfair Display', Georgia, serif`
  - `--font-sans: 'Inter', system-ui, sans-serif`
- Base typography rules:
  - `html { font-size: 18px; }` — 18px base for senior readability (not 16px)
  - `body { font-family: var(--font-sans); line-height: 1.7; color: var(--color-cliff-deep); background: var(--color-sea-salt); }` — cliff-deep (#1A6B8A, ~5.3:1 contrast) for all normal body text to satisfy WCAG 2.1 AA; atlantic reserved for large-text UI elements (≥18px bold or ≥24px regular) where 3.7:1 is sufficient
  - Headings use `var(--font-serif)` with `clamp()` responsive sizes
  - `max-width: 70ch` on prose content containers
  - `rem` units throughout — never `px` for font sizes
- Link colours: `color: var(--color-cliff-deep)` on light backgrounds — NOT sky-water (contrast failure)
- `:focus-visible` outline: `3px solid #005fcc`, `outline-offset: 3px`, never suppressed
- Skip link CSS: `position: absolute; top: -100%` → `top: 0` on `:focus`
- Fonts: self-hosted via `@fontsource/playfair-display` and `@fontsource/inter` npm packages; import subset CSS in `global.css` (e.g., `@import "@fontsource/inter/400.css"`); no CDN dependency, no GDPR exposure, no render-blocking cross-origin request
- `Button.astro`: accepts `variant` prop (`primary | dark | secondary | ghost`), renders correct colours per brand guide
- `Badge.astro`: `status` prop (`open | seasonal | closed`) with semantic colours (green / amber / grey)
- `Logo.astro`: two-line typographic wordmark using Playfair Display + Inter, light and dark variants

**Patterns to follow:**
- Brand guide colour roles and button definitions in `los_gigantes_brand_guide.html`

**Test scenarios:**
- Happy path: `Button variant="primary"` renders with `background: #C85A2A` (coral) and `color: #FDF8F0`
- Happy path: `Button variant="dark"` renders with `background: #1A6B8A`
- Happy path: `Badge status="closed"` renders with grey/muted styling; `seasonal` renders amber
- Edge case: Sky water colour is NOT used as text on any light background — verify no light-bg class uses `--color-sky-water` for `color` or `text-*`
- Accessibility: `Button` has visible `:focus-visible` ring at all viewport sizes
- Accessibility: Body text uses `--cliff-deep (#1A6B8A)` on `--sea-salt (#FDF8F0)` at ~5.3:1 — passes WCAG AA ✓
- Accessibility: `--atlantic (#2E8FAA)` used only for large-text UI elements (navigation labels, category tags ≥18px bold) where 3.7:1 passes AA Large
- Accessibility: `--cliff-deep (#1A6B8A)` on `--sea-salt (#FDF8F0)` passes ~5.3:1 for links ✓

**Verification:**
- A browser preview of a simple test page shows all button variants and badges matching the brand guide swatches
- No TypeScript errors in component props

---

- [ ] **Unit 3: Content Schema & Sample Content**

**Goal:** Define Zod-validated Astro 5 content collections for all five content types. Create 2–3 sample Markdown files per category so pages can be built and tested against real content.

**Requirements:** R1, R6, R9, R10

**Dependencies:** Unit 1

**Files:**
- Create: `src/content.config.ts`
- Create: `src/content/activities/whale-watching.md`
- Create: `src/content/activities/sea-kayaking.md`
- Create: `src/content/restaurants/la-rampa.md`
- Create: `src/content/restaurants/el-rincon.md`
- Create: `src/content/services/local-handyman.md`
- Create: `src/content/dance-lessons/salsa-bachata.md`
- Create: `src/content/accommodation/apartamentos-gigantes.md`
- Create: `src/assets/images/activities/` (directory placeholder)
- Create: `src/assets/images/restaurants/` (directory placeholder)
- Create: `src/assets/images/services/` (directory placeholder)
- Create: `src/assets/images/dance/` (directory placeholder)
- Create: `src/assets/images/accommodation/` (directory placeholder)
- Create: `src/data/site-config.json` (site owner contact info, social links)

**Approach:**
- `src/content.config.ts` defines five collections using `glob()` loader and Zod schemas
- All imports: `{ defineCollection, reference }` from `'astro:content'`, `{ glob }` from `'astro/loaders'`, `{ z }` from `'astro/zod'`
- Define `baseSchema` as a factory function that accepts the `image()` helper: `const getBaseSchema = (image: ImageFunction) => z.object({...})`. Call it inside each collection's schema factory: `schema: ({ image }) => getBaseSchema(image).extend({ ...categoryFields })`. This is required because `coverImage` uses `image()` which is only available inside the schema factory argument — defining `baseSchema` at module scope without this pattern will cause a build error.
- Shared `baseSchema` fragment contains fields common to all categories: `title`, `description` (max 160 chars), `status` (`open | seasonal | closed`, default `open`), `seasonNote` (optional string for seasonal notes), `address`, `phone`, `website`, `tags`, `coverImage` (using `image()` helper), `coverImageAlt`, `priceRange` (`free | € | €€ | €€€`, optional), `featured` (boolean, default false), `publishedAt` (coerce.date), `updatedAt` (coerce.date, optional)
- **Activities collection** extends base with: `duration` (string, optional), `difficulty` (`easy | moderate | hard`, optional), `lat`/`lng` (numbers, optional)
- **Restaurants collection** extends base with: `cuisine` (array of strings), `openingHours` (string, optional)
- **Services collection** extends base with: `serviceType` (string — e.g., "Plumbing", "Photography"), `whatsapp` (string, optional)
- **Dance lessons collection**: single-entry or multi-entry; extends base with: `schedule` (string — e.g., "Tuesday & Thursday, 7pm"), `level` (array: `beginner | intermediate | all-levels`), `whatsapp` (string, required)
- **Accommodation collection** extends base with: `roomTypes` (array of strings), `sleeps` (number, optional)
- `siteConfig` collection uses `file()` loader pointing to `src/data/site-config.json` with: `phone`, `whatsapp`, `email`, `address`, `instagramUrl`
- Sample content: write 2–3 realistic entries per category following the brand voice — specific, honest, with real-sounding details. Include `status: seasonal` on one activity to test the badge.

**Patterns to follow:**
- Astro 5 Content Layer API: `schema: ({ image }) => z.object({})` function form for image references
- `render()` (not `entry.render()`) imported from `astro:content`

**Test scenarios:**
- Happy path: `getCollection('activities')` returns all non-draft activities with correct TypeScript types
- Edge case: A Markdown file missing a required field (e.g., `coverImage`) causes a build error, not a silent failure
- Edge case: `status: 'seasonal'` entry appears in collection results with correct data shape
- Edge case: A listing with no optional fields (`website`, `priceRange`) still builds and renders without crashing

**Verification:**
- `npm run build` succeeds with all sample content present and valid
- TypeScript infers correct types for `CollectionEntry<'activities'>` in a scratch page

---

- [ ] **Unit 4: Base Layout, Navigation & SEO Foundation**

**Goal:** Create the `BaseLayout.astro` wrapping all pages, `Header.astro` with 5-item nav, `Footer.astro`, skip link, reusable `SEO.astro` component, WebSite JSON-LD on homepage, and static SEO files.

**Requirements:** R3, R4, R5

**Dependencies:** Units 2, 3

**Files:**
- Create: `src/layouts/BaseLayout.astro`
- Create: `src/components/navigation/Header.astro`
- Create: `src/components/navigation/Footer.astro`
- Create: `src/components/SEO.astro`
- Modify: `public/robots.txt` (add sitemap URL once site domain confirmed)
- Modify: `astro.config.mjs` (sitemap integration with filter and i18n config)

**Approach:**
- `BaseLayout.astro` structure:
  ```
  <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <!-- Fonts are self-hosted via @fontsource/* npm packages — no CDN, no GDPR exposure -->
      <!-- @fontsource imports happen in global.css, not via <link> tags -->
      <link rel="sitemap" href="/sitemap-index.xml">
      <SEO {...props} />
      [JSON-LD slot]
    </head>
    <body>
      <a class="skip-link" href="#main-content">Skip to main content</a>
      <Header />
      <main id="main-content">
        <slot />
      </main>
      <Footer />
    </body>
  </html>
  ```
- Font loading: `@fontsource` imports in `global.css` (e.g. `@import "@fontsource/inter/400.css"`) — no `<link>` tags, no CDN requests, no async loading pattern needed; fonts are served from 'self' alongside other build output
- `Header.astro`: Logo on left; nav items: Things to do (`/activities/`), Restaurants (`/restaurants/`), Services (`/services/`), Stay (`/accommodation/`); Dance lessons as a primary coral CTA button (`/dance-lessons/`). Mobile: nav collapses to hamburger or wraps to 2 rows — ensure keyboard-accessible and focusable
- `Footer.astro`: Contact (WhatsApp link, email, phone from `siteConfig`), copyright line, short about blurb
- `SEO.astro` component accepts: `title`, `description`, `canonicalUrl`, `ogImage` (optional, defaults to branded default), `ogType` (`website | article`), `noindex` (boolean, default false). Renders: `<title>`, `<meta name="description">`, `<link rel="canonical">`, all OG tags, Twitter card tags, `<meta name="robots" content="noindex">` when `noindex=true`
- `WebSite` JSON-LD injected on homepage only
- Sitemap config: exclude `/tags/` pages (they are noindex — consistent not to put them in sitemap either); include `serialize()` function to set `lastmod` from frontmatter `updatedAt`

**Patterns to follow:**
- Brand guide header/nav preview, button styles, logo wordmark from `los_gigantes_brand_guide.html`

**Test scenarios:**
- Happy path: `BaseLayout` renders correct `<html lang="en">`, skip link, main landmark with `id="main-content"`
- Happy path: `SEO` with `noindex=true` renders `<meta name="robots" content="noindex, follow">`
- Happy path: `Header` nav contains all 5 items with correct href targets
- Accessibility: Skip link moves to `top: 0` on `:focus` and is the first focusable element on the page
- Accessibility: Dance lessons button in nav is a real `<a>` element (not `<button>`) linking to `/dance-lessons/`
- Accessibility: Nav landmark has `aria-label="Main navigation"`
- Edge case: `SEO` without `ogImage` prop uses the default branded image path without crashing

**Verification:**
- View-source on any built page shows correct `<html lang="en">`, canonical link, and skip link as first body element
- Lighthouse accessibility score ≥ 90 on the built homepage

---

- [ ] **Unit 5: Homepage**

**Goal:** Build the homepage — hero section, category navigation grid, and featured listings section with up to 6 featured entries from across all collections.

**Requirements:** R3, R5, R6

**Dependencies:** Units 3, 4

**Files:**
- Create: `src/pages/index.astro`
- Create: `src/components/home/Hero.astro`
- Create: `src/components/home/CategoryGrid.astro`
- Create: `src/components/home/FeaturedListings.astro`

**Approach:**
- `Hero.astro`: Full-width dark hero (`--cliff-deep` background), H1 in Playfair Display ("Your guide to Los Gigantes"), subheading in sky-water, primary coral CTA button. Brand voice copy: "Local tips, honest reviews, and hidden spots — by someone who lives here." Hero is purely typographic for v1 (no hero photograph required)
- `CategoryGrid.astro`: Grid of 5 category cards (Things to do / Restaurants / Services / Stay / Dance lessons). Each card links to the category index. Dance lessons card uses coral border accent per brand guide preview pattern.
- `FeaturedListings.astro`: Queries all 5 collections filtered by `featured: true`, merges into one array, renders up to 6 `PlaceCard` components (defined in Unit 6) with `headingLevel={3}` since the section has its own `<h2>`. Sort by `publishedAt` descending.
- Homepage JSON-LD: `WebSite` schema with `name`, `url`, `description`, and `inLanguage: 'en'`

**Test scenarios:**
- Happy path: Homepage renders with all 5 category links present and correct hrefs
- Happy path: Featured listings section shows only entries with `featured: true` across all collections
- Edge case: Zero featured entries → `FeaturedListings` renders nothing or a fallback message (no crashing)
- Edge case: More than 6 featured entries → only first 6 shown, sorted by `publishedAt` desc
- Accessibility: Hero `<h1>` is the first and only `<h1>` on the page; category grid headings are `<h2>` or lower
- Integration: WebSite JSON-LD is valid (verify with Google Rich Results Test after build)

**Verification:**
- Homepage renders in browser with correct visual hierarchy matching brand guide site preview
- `<h1>` is present and unique on the page

---

- [ ] **Unit 6: Category Listing Pages & PlaceCard Component**

**Goal:** Build the reusable `PlaceCard.astro` component and the five category index pages (`/activities/`, `/restaurants/`, `/services/`, `/dance-lessons/`, `/accommodation/`). Include tag filter link nav and status badges on cards.

**Requirements:** R4, R6, R7, R9, R10

**Dependencies:** Units 3, 4

**Files:**
- Create: `src/components/PlaceCard.astro`
- Create: `src/pages/activities/index.astro`
- Create: `src/pages/restaurants/index.astro`
- Create: `src/pages/services/index.astro`
- Create: `src/pages/dance-lessons/index.astro`
- Create: `src/pages/accommodation/index.astro`

**Approach:**
- `PlaceCard.astro` accepts: `entry` typed as an explicit union `CollectionEntry<'activities'> | CollectionEntry<'restaurants'> | CollectionEntry<'services'> | CollectionEntry<'dance-lessons'> | CollectionEntry<'accommodation'>`, `headingLevel` (2 | 3 | 4, default 2), `categorySlug` (string — determines link href base). PlaceCard accesses only `entry.data` fields guaranteed by `baseSchema` — this is safe across the union because all collections share those fields.
  - Renders: `<article>` with `<Picture>` cover image (AVIF + WebP, `loading="lazy"`, explicit width/height), heading (rendered as `<h${headingLevel}>`), status badge if `status !== 'open'`, description excerpt, `priceRange`, tag pills (linked to `/tags/[tag]/`)
  - Card heading is a link to the detail page: `/<categorySlug>/<entry.id>/`
  - Image: `formats={['avif', 'webp']}`, `width={400}`, `height={260}`, `loading="lazy"`, `decoding="async"` — correct explicit dimensions prevent CLS
  - Accessibility: card heading link text is the listing title; no `aria-label` needed if heading is descriptive; tag links have accessible text
- Category index pages:
  - Each queries its collection (all statuses included — no filtering on closed), partitions so open/seasonal entries appear first and closed entries appear last, renders tag filter nav + card grid
  - Tag filter nav: `<nav aria-label="Filter by tag">` with `<ul>` of `<a href="/tags/[tag]/">` links styled as pills — no JavaScript, plain links
  - Page `<h1>` follows keyword strategy: "Things to Do in Los Gigantes", "Restaurants in Los Gigantes", etc.
  - `meta.description` includes "Los Gigantes" and "Tenerife"
  - Closed listings appear last with visual de-emphasis (opacity, greyed status badge); seasonal listings appear with amber badge but normal weight
- Dance lessons index: treated as a near-landing page for the owner's primary commercial activity; includes schedule info from frontmatter, WhatsApp CTA button (coral, prominent), phone number, "Always confirm via WhatsApp before attending" advisory note baked into the page template

**Patterns to follow:**
- Brand guide card anatomy: 8px border-radius, 0.5px border, category tag label, heading, description
- `<Picture>` with `formats={['avif', 'webp']}` from `astro:assets`

**Test scenarios:**
- Happy path: Activities index renders all activities sorted by `publishedAt` desc with cover images
- Happy path: `PlaceCard` renders `<h2>` when `headingLevel={2}` and `<h3>` when `headingLevel={3}`
- Happy path: Tag filter nav shows all unique tags used in the category; each tag links to `/tags/[tag]/`
- Happy path: WhatsApp CTA on dance lessons page renders as `<a href="https://wa.me/...">` link
- Edge case: Listing with `status: 'closed'` renders with Badge "Closed", appears at end of list, not hidden
- Edge case: Listing with `status: 'seasonal'` + `seasonNote` text shows amber badge and note text
- Edge case: Listing with no cover image → graceful fallback (branded placeholder or `alt=""` hidden image), no build error
- Accessibility: All `<Picture>` / `<Image>` elements have non-empty `alt` text from `coverImageAlt` frontmatter
- Accessibility: Tag pill links are keyboard-reachable and have descriptive text
- Integration: Tag filter links navigate to correct pre-rendered tag pages (Unit 8) and back

**Verification:**
- All 5 category index pages build and render without errors
- Cover images render as WebP/AVIF in browsers that support them (check network tab)
- No layout shift when images load (verify in Lighthouse CLS score = 0)

---

- [ ] **Unit 7: Detail Pages & Structured Data**

**Goal:** Build per-category detail page routes, breadcrumb navigation, quick-info aside, rendered Markdown body, related listings section, and category-appropriate JSON-LD structured data.

**Requirements:** R3, R4, R6

**Dependencies:** Units 3, 4, 6

**Files:**
- Create: `src/pages/activities/[id].astro`
- Create: `src/pages/restaurants/[id].astro`
- Create: `src/pages/services/[id].astro`
- Create: `src/pages/accommodation/[id].astro`
- Create: `src/components/Breadcrumb.astro`
- Create: `src/components/QuickInfo.astro`
- Create: `src/components/RelatedListings.astro`

**Approach:**
- All detail pages share the same structure via `getStaticPaths()` + `render(entry)` (NOT `entry.render()` — Astro 5 breaking change)
- Page layout: Breadcrumb → `<h1>` (title) → hero image (above fold: `loading="eager"`, `decoding="sync"` for correct LCP) → `<QuickInfo>` aside → Markdown `<Content>` in `.prose` container → tags footer → `<RelatedListings>`
- `Breadcrumb.astro`: accepts `items` array `{ label, href? }[]`; renders `<nav aria-label="Breadcrumb"><ol>` with `aria-current="page"` on last item; includes `BreadcrumbList` JSON-LD
- `QuickInfo.astro`: renders address (with `<address>` element), phone (`<a href="tel:...">`), WhatsApp (`<a href="https://wa.me/...">`), website, opening hours, price range, status badge — all from frontmatter; gracefully omits absent fields
- `RelatedListings.astro`: queries same collection for entries sharing tags with current entry; excludes current entry; limits to 3; renders as `<PlaceCard headingLevel={3}>` grid
- JSON-LD per category:
  - Activities: `TouristAttraction` with geo coordinates when present; `BreadcrumbList`
  - Restaurants: `Restaurant` with `servesCuisine`, `priceRange`, `openingHoursSpecification`; `BreadcrumbList`
  - Services: `LocalBusiness` with service-specific name; `BreadcrumbList`
  - Accommodation: `LodgingBusiness`; `BreadcrumbList`
  - Dance lessons: `SportsActivityLocation` or `LocalBusiness` — use the most specific applicable type
- JSON-LD injected via `<script type="application/ld+json" set:html={JSON.stringify(schema)} />`
- SEO: Each detail page passes `title`, `description` (from frontmatter, max 160 chars), `canonicalUrl` (constructed from `Astro.site` + path), and `ogImage` (hero image URL if present) to `SEO.astro`

**Test scenarios:**
- Happy path: `/activities/whale-watching/` renders with all layout zones (breadcrumb, h1, image, quick-info, content, related) in correct order
- Happy path: Breadcrumb shows `Home > Things to Do > Whale Watching` with correct hrefs
- Happy path: `QuickInfo` renders phone as `<a href="tel:+34922000000">` and WhatsApp as `<a href="https://wa.me/...">`
- Happy path: `RelatedListings` shows up to 3 other activities sharing at least one tag
- Edge case: Entry with no `lat`/`lng` — JSON-LD omits `geo` property without crashing
- Edge case: Entry with no related listings → `RelatedListings` section is not rendered (no empty `<section>`)
- Edge case: Entry with no hero image → page builds without error; hero zone renders minimal/omitted rather than broken
- Accessibility: Hero image has `loading="eager"` and `decoding="sync"`; all subsequent images lazy-loaded
- Accessibility: `<h1>` is the only `<h1>` on the page; `<h2>` for section headings in Markdown body
- Integration: `BreadcrumbList` JSON-LD validates in Google Rich Results Test
- Integration: `TouristAttraction`/`Restaurant` JSON-LD validates in Google Rich Results Test

**Verification:**
- All detail page routes build for all sample content entries
- Google Rich Results Test shows valid structured data for at least one activity and one restaurant page
- No Lighthouse accessibility violations on detail page

---

- [ ] **Unit 8: Tag Filter Pages & 404 Page**

**Goal:** Generate pre-rendered `/tags/[tag]/` pages for all tags used across all five content collections. All tag pages carry `noindex`. Create the custom 404 page.

**Requirements:** R3, R7

**Dependencies:** Units 3, 4, 6

**Files:**
- Create: `src/pages/tags/[tag].astro`
- Create: `src/pages/404.astro`

**Approach:**
- `src/pages/tags/[tag].astro`: `getStaticPaths()` queries all 5 collections, merges, derives unique tag set, generates one path per tag; props include the filtered entries for that tag
  - Renders: `<h1>Places tagged: [tag]</h1>`, card grid with all matching entries (across all categories), using `<PlaceCard>` with `headingLevel={2}`
  - `SEO` component called with `noindex={true}` — tag pages carry `<meta name="robots" content="noindex, follow">`; tag pages are also excluded from the sitemap in `astro.config.mjs`
  - Tag pages are intentionally thin — they're useful navigation aids but not for search engine indexing in v1
- `src/pages/404.astro`: renders friendly 404 with nav header/footer; suggests: check spelling, go to homepage, browse categories. Uses brand styling. Cloudflare Pages serves `dist/404.html` for unmatched routes (configured in `wrangler.jsonc` with `not_found_handling: '404-page'`).

**Test scenarios:**
- Happy path: `/tags/family-friendly/` renders a card grid of all entries tagged `family-friendly` across all categories
- Happy path: Tag page carries `<meta name="robots" content="noindex, follow">` in source
- Happy path: 404 page renders with header/footer and helpful navigation links
- Edge case: A tag used by only one listing → tag page renders with exactly one card, no layout breakage
- Edge case: Cross-category tag page (e.g., `/tags/outdoor/`) shows entries from multiple categories with correct links to their respective detail page URLs
- Edge case: A tag string with spaces or special characters → verify `getStaticPaths` generates a URL-safe slug (Astro converts collection IDs to URL-safe strings by default; verify no encoding issues)

**Verification:**
- `npm run build` generates a `dist/tags/` directory with one subdirectory per tag
- Each tag page HTML contains `<meta name="robots" content="noindex">`
- `dist/404.html` exists and renders correctly in browser

---

- [ ] **Unit 9: Cloudflare Pages Deployment Configuration**

**Goal:** Complete all Cloudflare Pages deployment artefacts — HTTP headers, redirects, build configuration — and verify the full build + deploy pipeline.

**Requirements:** R1, R2, R3

**Dependencies:** All previous units

**Files:**
- Create: `public/_headers`
- Create: `public/_redirects`
- Modify: `wrangler.jsonc` (finalize)
- Create: `CLAUDE.md` (project-level AI instructions capturing brand tokens, voice rules, deploy target)

**Approach:**
- `public/_headers`:
  - `/_astro/*`: `Cache-Control: public, max-age=31536000, immutable` — Astro fingerprints asset filenames, so immutable cache is safe
  - `/images/*` and `/fonts/*` (if self-hosted): `Cache-Control: public, max-age=604800`
  - `/*.html` and `/*/index.html`: `Cache-Control: public, max-age=0, must-revalidate` — HTML revalidates on every request
  - `/*` (all routes): security headers — `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=()`
  - `Content-Security-Policy`: `default-src 'self'; img-src 'self' data: https:; font-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self'` — fonts.gstatic.com and fonts.googleapis.com are intentionally absent since fonts are self-hosted via @fontsource
  - CSP Note: if Google Maps embed is added later, `frame-src https://www.google.com` and `img-src ... https://maps.googleapis.com` must be added
- `public/_redirects`: minimal for now — just the catch-all 404 rule is handled by `wrangler.jsonc`; add explicit 301 redirects here only if URLs are restructured after go-live
- `CLAUDE.md`: document brand token CSS variables, voice/tone rules (from brand guide do/don't), content schema conventions, deploy command, and the contrast decision (sky-water banned on light backgrounds)
- **Cloudflare dashboard**: Configure build failure email notification in the Cloudflare Pages project settings — this is a manual step the owner must complete after connecting the repo; document in CLAUDE.md
- Final build check: `npm run build` on the full codebase, verify `dist/` structure, spot-check a few pages

**Test scenarios:**
- Happy path: `/_astro/` directory in built `dist/` — confirm `_headers` rule matches these paths
- Happy path: Build completes in under 3 minutes on Cloudflare Pages (typical for a static Astro site of this size)
- Happy path: Deploying to Cloudflare Pages serves `dist/404.html` for an unknown route
- Edge case: @fontsource CSS files fail to import (e.g., npm install issue) — verify system font fallbacks render readably (Georgia for headings, system-ui for body)
- Integration: Run `npm run build` and verify the `dist/sitemap-index.xml` + `dist/sitemap-0.xml` exist and contain the homepage, all category indexes, and all detail page URLs — but NOT `/tags/` pages
- Integration: Verify `dist/robots.txt` contains `Sitemap: https://losgigantesguide.com/sitemap-index.xml`

**Verification:**
- A preview deployment on Cloudflare Pages loads correctly in a browser
- Lighthouse scores on the deployed site: Performance ≥ 90, Accessibility ≥ 90, SEO = 100
- No 404s on internal links (can spot-check by crawling `dist/` directory structure)

---

## System-Wide Impact

- **Interaction graph:** No JavaScript event handlers; all interactions are HTML links. Cloudflare Pages CDN edge serves all pages. Astro's Sharp image pipeline runs only at build time.
- **Error propagation:** Zod schema validation in `src/content.config.ts` catches missing required fields at build time — build fails loudly rather than rendering broken pages silently. Cloudflare Pages build failure must be monitored via email notification (manual Cloudflare dashboard setting).
- **State lifecycle risks:** Content is static. The only "state" is the build output. Risk: stale content for time-sensitive information (dance class cancellations). Mitigated by "confirm via WhatsApp" advisory baked into dance lessons page template.
- **API surface parity:** Not applicable — no API. All pages are pre-rendered HTML.
- **Integration coverage:** The sitemap excludes `/tags/` pages; verify this exclusion propagates correctly (sitemap config filter + tag page noindex must be consistent).
- **Unchanged invariants:** The brand guide colour palette and typography are the design source of truth. Colour usage decisions made in Unit 2 (sky-water banned on light backgrounds) must not be reversed without a contrast audit.

## Risks & Dependencies

| Risk | Mitigation |
|------|------------|
| `--sky-water` contrast failure on light backgrounds | Resolved in Unit 2 design system — sky-water restricted to dark background usage; cliff-deep used for all links |
| Build failure not noticed by solo owner | Configure Cloudflare Pages email notification on build failure (documented in Unit 9 CLAUDE.md) |
| Content rot — stale phone numbers, retired businesses | `status` field + `updatedAt` frontmatter on all entries; owner commits regular review of `closed`/`seasonal` status |
| Dance class schedule changes faster than git → build cycle | "Confirm via WhatsApp before attending" note baked into dance lessons page template (not just content) |
| Image repository bloat from full-resolution photos | Image conventions documented: max 2000px wide, < 500KB pre-commit; Astro handles WebP/AVIF conversion |
| Google Fonts CDN GDPR exposure | Eliminated — fonts are self-hosted via `@fontsource` npm packages; no CDN request, no user IP sent to Google, no render-blocking cross-origin request |
| Tag pages generating thin content if indexed in future | noindex in v1; when adding curated intro paragraphs per tag, flip to indexable and add to sitemap |
| `--atlantic (#2E8FAA)` contrast (3.7:1) insufficient for normal body text | Resolved — body text uses `--cliff-deep (#1A6B8A)` at ~5.3:1; atlantic reserved for large-text UI elements (≥18px bold / ≥24px regular) where 3.7:1 passes AA Large |
| No analytics on a static site means no visibility into what content is popular | Add Cloudflare Web Analytics (privacy-preserving, cookie-free, no GDPR consent required) — a one-line script tag; document in Unit 9 |

## Alternative Approaches Considered

- **Next.js**: Rejected — adds unnecessary complexity (React, client-side hydration) for a content site with no interactive requirements. Astro's zero-JS default is better aligned with the static, SEO-first, no-JavaScript-required constraint.
- **Headless CMS (Contentful, Sanity)**: Rejected for v1 — the solo owner is technical enough to edit Markdown files via git; no CMS cost/complexity; no external service dependency. Can be added later by pointing Astro's content layer at a CMS API loader.
- **Cloudflare Workers (SSR)**: Rejected — the site has no per-request dynamic behaviour. Static pre-rendering is faster, cheaper (Cloudflare Pages free tier), and simpler to reason about.
- **JavaScript-based filtering**: Rejected — no-JS pre-rendered tag pages are better for accessibility (no JS dependency), SEO (crawlable filter states), and the 35-65 demographic (no interactive complexity).

## Phased Delivery

### Phase 1 — Foundation (Units 1–4)
Scaffolding, design system, content schema, base layout. Everything that must exist before any visible page can be built. End state: a correctly branded empty site deploys to Cloudflare Pages.

### Phase 2 — Core Pages (Units 5–7)
Homepage, listing pages, detail pages, structured data. End state: a working site with sample content that can be shared for feedback and verified against Lighthouse and Google Rich Results Test.

### Phase 3 — Completeness & Deployment (Units 8–9)
Tag pages, 404, deployment configuration, and production verification. End state: production-ready site on Cloudflare Pages with correct caching, security headers, sitemap, and accessibility score ≥ 90.

## Documentation / Operational Notes

- `CLAUDE.md` (created in Unit 9) acts as the persistent project brief for all future AI-assisted content or code work in this repo
- Site owner image workflow: add photos to `src/assets/images/[category]/`, commit, push — Astro handles the rest at build time
- New listing workflow: copy a sample Markdown file in the relevant `src/content/` subdirectory, fill in frontmatter, write body copy, commit and push
- Cloudflare Pages build times: typically 60–90 seconds for this site size
- To flip tag pages from noindex to indexable: remove `noindex` prop from `SEO` component in `src/pages/tags/[tag].astro` AND add a sitemap filter inclusion AND add curated `<h1>` + intro paragraph template to the tag page layout

## Sources & References

- Brand guide: `los_gigantes_brand_guide.html`
- Astro 5 Content Layer API: https://docs.astro.build/en/guides/content-collections/
- Astro images: https://docs.astro.build/en/guides/images/
- Tailwind v4 + Astro: https://tailwindcss.com/docs/guides/astro
- Cloudflare Pages deploy: https://docs.astro.build/en/guides/deploy/cloudflare/
- Cloudflare Pages headers: https://developers.cloudflare.com/pages/configuration/headers/
- WCAG 2.1 AA contrast: https://www.w3.org/TR/WCAG21/#contrast-minimum
- schema.org structured data: https://schema.org/TouristAttraction, /Restaurant, /LocalBusiness
- Google Rich Results Test: https://search.google.com/test/rich-results
