# Weekly event finder

Instructions for the scheduled task that looks for upcoming local events and drafts
entries for review. It runs from the desktop app on Levente's machine; edit this file to
change what it does.

## Goal

Find events in the next 8 weeks in or near Los Gigantes and write each one as a **draft**
Markdown file in `src/content/events/`. A human reviews drafts, edits them and sets
`draft: false` before they appear on the site. Never commit, push or publish anything.

## Area

Include events in:

- the municipality of Santiago del Teide: Los Gigantes, Puerto de Santiago, Playa de la
  Arena, Santiago del Teide village, Tamaimo, Arguayo, Valle de Arriba, El Molledo
- **Alcalá** (in Guía de Isora, 10 minutes down the coast): always include
- Playa San Juan (also Guía de Isora): only if it would interest visitors

Skip everything else in Guía de Isora (Guía town, Chío, Tejina and so on) and the rest of
Tenerife.

## Sources

Use only these.

1. **Ayuntamiento de Santiago del Teide calendar**, via Google Calendar's public feed (start here,
   it's the most reliable source):

   ```bash
   curl -s "https://calendar.google.com/calendar/ical/ghnamt6c73k4tb677ugb241ahi9ml8da%40import.calendar.google.com/public/basic.ics"
   ```

   This is the council's own events calendar (the same events as
   santiagodelteide.es/eventos/lista/) mirrored by Google, so it can be read without
   fetching the council site. Notes:
   - Times end in `Z` but are **local Tenerife time**: `DTSTART:20261109T080000Z` means
     08:00 local. Don't convert them.
   - All-day events use `DTSTART;VALUE=DATE:20261212`; leave out start/end times for these.
     For all-day events `DTEND` is the day *after* the last day.
   - Use the event's `URL` as `sourceUrl`, but don't fetch it (it's on santiagodelteide.es).
     Everything you need is in `SUMMARY`, `DESCRIPTION` and `LOCATION`.
   - Titles are often in capitals with emoji: write a normal English title.

2. **Ayuntamiento de Guía de Isora calendar** (covers Alcalá), an iCal feed on a site with
   no robots.txt restrictions:

   ```bash
   curl -s "https://www.guiadeisora.org/corp/feed/eo-events/"
   ```

   It's often sparse. Keep only events in Alcalá or Playa San Juan. Use each event's `URL`
   as `sourceUrl`; you may fetch that page if the feed's description is too thin. Unlike
   the feed above, times here may be true UTC (Tenerife is UTC+1 from late March to late
   October), so take the start time from the "Inicio:" line on the event page.

For the websites below, read each host's `/robots.txt` before the first fetch in a run
and skip any path it disallows for generic user agents.

3. El Digital Sur, Santiago del Teide section: https://eldigitalsur.com/tenerifesur/santiagodelteide/
   and Guía de Isora section: https://eldigitalsur.com/tenerifesur/guiadeisora/ (for Alcalá)
   (news articles in Spanish; read articles from the last ~3 weeks that announce events)
4. Web Tenerife agenda: https://www.webtenerife.com/agenda/ (filter or scan for the south zone)
5. Cabildo de Tenerife events: https://www.tenerife.es/eventos

**Do not fetch** santiagodelteide.es (its robots.txt blocks bots; the calendar above covers it), Facebook, Instagram,
Eventbrite, or anything that needs a login. Don't follow links to other sites except to
read a single event's own page from one of the sources above.

## What counts

Events a visitor or resident could turn up to: fiestas, concerts, markets, festivals,
sport events open to spectators, talks, exhibitions, charity events. Skip council
meetings, job/training courses for residents only, closed registrations, and events that
have already finished.

## Duplicates

Before writing, read the frontmatter of every file in `src/content/events/`. Skip an event
if an existing file has the same `sourceUrl`, or the same start date and an obviously
matching title or venue. If an existing **draft** file's details have changed at the
source (new date, cancelled), update that draft and set `updatedAt` to today.

## File format

File name: kebab-case English title, e.g. `src/content/events/christmas-market-puerto-de-santiago.md`.
If the title repeats yearly, add the year: `fiestas-del-carmen-2026.md`.

```yaml
---
title: "Christmas Market in Puerto de Santiago"
description: "One line, max 160 characters, saying what it is, where and when."
startDate: 2026-12-12
endDate: 2026-12-13        # only if it runs over several days
startTime: "18:00"         # 24-hour local time, only if the source gives it
endTime: "22:00"
status: scheduled          # scheduled | cancelled | postponed
venue: "Plaza de Puerto de Santiago"
address: ""
price: "Free"              # only if the source says; otherwise leave the field out
organiser: "Ayuntamiento de Santiago del Teide"
website: ""                # organiser's own page if there is one
sourceUrl: "https://..."   # the page you found it on (required)
draft: true                # always true
tags: []
publishedAt: 2026-11-05    # today
---
```

Then a short body (2 to 4 sentences, or a short list) in English.

Rules:

- **Only use facts the source states.** Leave a field out rather than guess. If the
  year, date or time is unclear, still write the draft but add a line at the top of the
  body starting `CHECK:` that says what's uncertain.
- Translate Spanish into plain British English. Keep proper names in Spanish.
- Voice: a knowledgeable local friend. Specific and practical (parking, what to bring,
  if it's in Spanish only). No hype words ("amazing", "stunning", "hidden gem", "unmissable").
- No em dashes anywhere in the file. Use commas, colons or "to" for ranges.
- Omit empty fields instead of writing `""`.
- No images.

## Finish

1. Run `npm run build` and fix any schema errors in the files you wrote.
2. Reply with a short summary: drafts created (title, date, file name), drafts updated,
   sources that failed or were skipped by robots.txt, and anything marked `CHECK:`.
   If nothing new was found, say so in one line.
