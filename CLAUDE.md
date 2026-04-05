# Los Gigantes Guide — Project Brief

This is a static website for **losgigantesguide.com**, a local guide to Los Gigantes, Tenerife.
Built with Astro 6.x, Tailwind CSS v4, hosted on Cloudflare Pages.

## Deploy

```bash
npm run build       # Builds to dist/
npm run dev         # Local dev server
```

Deploy happens automatically on push to `main` via Cloudflare Pages.
Build command: `npm run build` | Output directory: `dist`

## Brand & Design

### Colour roles

| Variable | Hex | Use |
|---|---|---|
| `--color-cliff-deep` | `#1A6B8A` | Primary, headers, hero bg, body text (~5.3:1 on sea-salt) |
| `--color-atlantic` | `#2E8FAA` | Large-text UI elements (nav, category labels ≥18px bold) only — NOT normal body text (3.7:1 insufficient) |
| `--color-sky-water` | `#7DD4E8` | Accent on dark/volcanic backgrounds ONLY — BANNED as text on light backgrounds (2.1:1 fails WCAG AA) |
| `--color-sunset-coral` | `#C85A2A` | CTAs, dance lessons |
| `--color-golden-hour` | `#E8A830` | Warm highlights |
| `--color-sea-salt` | `#FDF8F0` | Page background |
| `--color-volcanic` | `#2A5C70` | Nav bar background |

### Typography

- Base font size: **18px** (not 16px) — senior readability
- Headings: `Playfair Display` (self-hosted via `@fontsource/playfair-display`)
- Body: `Inter` (self-hosted via `@fontsource/inter`)
- No Google Fonts CDN — fonts served from `'self'` (GDPR compliant)

### Contrast decisions

- Body text uses `--cliff-deep` on `--sea-salt` (~5.3:1) ✓ WCAG AA
- `--atlantic` passes AA Large (3.7:1) for nav items ≥18px bold
- `--sky-water` fails AA on light backgrounds — decorative/dark-bg only

## Voice & Tone

Be the knowledgeable local friend:
- **Do**: Give specific details (times, prices, what to order), mention what to skip, be honest about limitations
- **Don't**: Use hype words ("amazing", "stunning", "hidden gem"), be vague, write like a travel brochure

## Content

### Adding a new listing

1. Copy a sample `.md` file from the relevant `src/content/[category]/` folder
2. Fill in all frontmatter fields (required: `title`, `description` ≤160 chars, `publishedAt`, `status`)
3. Write the body in Markdown — be specific, honest, useful
4. Commit and push — Cloudflare Pages rebuilds automatically

### Content frontmatter (all categories)

```yaml
---
title: ""
description: ""           # max 160 characters
status: open              # open | seasonal | closed
seasonNote: ""            # optional — shown when status: seasonal
address: ""
phone: ""
website: ""
tags: []
coverImage: ./image.jpg   # optional — must be in src/assets/images/[category]/
coverImageAlt: ""         # required when coverImage is set
priceRange: "€€"         # free | € | €€ | €€€
featured: false
publishedAt: 2026-04-01
updatedAt: 2026-04-01
---
```

### Image workflow

- Place images in `src/assets/images/[category]/`
- Max 2000px wide, under 500KB before commit — Astro handles WebP/AVIF conversion at build time
- Reference with `coverImage: ./your-image.jpg` in frontmatter

## Content Rot Prevention

- Set `status: closed` for businesses that have shut — keeps the listing visible but clearly marked
- Set `status: seasonal` + `seasonNote` for businesses that close off-season
- Update `updatedAt` whenever you review a listing

## Architecture Notes

- `src/content.config.ts` — Zod schemas for all 5 collections; `getBaseSchema(image)` factory pattern required for `image()` helper
- `src/layouts/BaseLayout.astro` — wraps all pages; accepts `jsonLd` prop for structured data
- Tag pages (`/tags/[tag]/`) are `noindex` in v1 — to enable indexing: remove `noindex` from `src/pages/tags/[tag].astro` AND add to sitemap filter AND add curated `<h2>` + intro paragraph
- Sitemap excludes `/tags/` pages — configured in `astro.config.mjs`

## Cloudflare Pages Setup (manual, one-time)

1. Connect your GitHub/GitLab repo in the Cloudflare Pages dashboard
2. Build command: `npm run build`
3. Output directory: `dist`
4. Node version: 22 (set as environment variable `NODE_VERSION=22`)
5. Enable **build failure email notifications** in Settings → Notifications
6. Add domain `losgigantesguide.com` under Custom Domains

## WhatsApp contact

Replace the placeholder `34XXXXXXXXX` in `src/data/site-config.json` and the dance lesson `whatsapp` frontmatter field with the real international number (digits only, no `+`, no spaces).
