import type { CollectionEntry } from 'astro:content';

type Event = CollectionEntry<'events'>;

// Event dates are date-only and parse as UTC midnight, so format in UTC to
// avoid shifting a day either side.
const dayFormat = new Intl.DateTimeFormat('en-GB', {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
  timeZone: 'UTC',
});
const fullFormat = new Intl.DateTimeFormat('en-GB', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});

/** "YYYY-MM-DD" for the last day of the event — compared as strings. */
export const lastDay = (event: Event) =>
  (event.data.endDate ?? event.data.startDate).toISOString().slice(0, 10);

/** Today in Tenerife, as "YYYY-MM-DD". */
export const todayInTenerife = () =>
  new Intl.DateTimeFormat('en-CA', { timeZone: 'Atlantic/Canary' }).format(new Date());

export const isPast = (event: Event) => lastDay(event) < todayInTenerife();

export const sortByStart = (a: Event, b: Event) =>
  a.data.startDate.getTime() - b.data.startDate.getTime() ||
  (a.data.startTime ?? '').localeCompare(b.data.startTime ?? '');

/** "Sat 15 Nov" or "Sat 15 Nov to Mon 17 Nov". */
export function formatDateRange(event: Event, style: 'short' | 'long' = 'short') {
  const fmt = style === 'long' ? fullFormat : dayFormat;
  const { startDate, endDate } = event.data;
  if (!endDate || endDate.getTime() === startDate.getTime()) return fmt.format(startDate);
  return `${fmt.format(startDate)} to ${fmt.format(endDate)}`;
}

/** "20:00", "20:00 to 23:30", or undefined. */
export function formatTimeRange(event: Event) {
  const { startTime, endTime } = event.data;
  if (!startTime) return undefined;
  return endTime ? `${startTime} to ${endTime}` : startTime;
}

/** ISO datetime for schema.org, with Tenerife's offset left off (local time). */
export function isoStart(event: Event) {
  const day = event.data.startDate.toISOString().slice(0, 10);
  return event.data.startTime ? `${day}T${event.data.startTime}` : day;
}

export function isoEnd(event: Event) {
  const { endDate, endTime } = event.data;
  if (!endDate && !endTime) return undefined;
  const day = (endDate ?? event.data.startDate).toISOString().slice(0, 10);
  return endTime ? `${day}T${endTime}` : day;
}
