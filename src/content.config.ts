import { defineCollection, z } from 'astro:content';
import { glob, file } from 'astro/loaders';
import type { ImageFunction } from 'astro';
import { FOOD_TYPE_KEYS } from './data/food-types';

/**
 * Base schema factory — accepts the image() helper which is only available
 * inside a schema factory argument (not at module scope).
 */
const getBaseSchema = (image: ImageFunction) =>
  z.object({
    title: z.string(),
    description: z.string().max(160),
    status: z.enum(['open', 'seasonal', 'closed']).default('open'),
    seasonNote: z.string().optional(),
    address: z.string().optional(),
    phone: z.string().optional(),
    website: z.string().url().optional(),
    tags: z.array(z.string()).default([]),
    coverImage: image().optional(),
    coverImageAlt: z.string().optional(),
    priceRange: z.enum(['free', '€', '€€', '€€€']).optional(),
    featured: z.boolean().default(false),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
  });

/** Cover images must ship with alt text — enforced at build time. */
const requireAltWithImage = <T extends { coverImage?: unknown; coverImageAlt?: string }>(
  data: T,
  ctx: z.RefinementCtx,
) => {
  if (data.coverImage && !data.coverImageAlt) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['coverImageAlt'],
      message: 'coverImageAlt is required when coverImage is set',
    });
  }
};

const activities = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/activities' }),
  schema: ({ image }) =>
    getBaseSchema(image)
      .extend({
        duration: z.string().optional(),
        difficulty: z.enum(['easy', 'moderate', 'hard']).optional(),
        lat: z.number().optional(),
        lng: z.number().optional(),
        // Embedded Google Maps, placed under the section whose heading starts with `name`
        // (see src/plugins/rehype-location-maps.mjs). `query` is what Google Maps searches for;
        // `embed` is a link from Google Maps → Share → Embed a map, and wins over `query`.
        locations: z
          .array(
            z
              .object({ name: z.string(), query: z.string().optional(), embed: z.string().optional() })
              .refine((loc) => loc.query || loc.embed, { message: 'Each location needs a query or an embed link' }),
          )
          .default([]),
      })
      .superRefine(requireAltWithImage),
});

// Food & Drink: restaurants, cafés and bars
const food = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/food' }),
  schema: ({ image }) =>
    getBaseSchema(image)
      .extend({
        type: z.enum(FOOD_TYPE_KEYS).default('restaurant'),
        cuisine: z.array(z.string()).default([]),
        openingHours: z.string().optional(),
      })
      .superRefine(requireAltWithImage),
});

const services = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/services' }),
  schema: ({ image }) =>
    getBaseSchema(image)
      .extend({
        serviceType: z.string(),
        whatsapp: z.string().optional(),
      })
      .superRefine(requireAltWithImage),
});

const accommodation = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/accommodation' }),
  schema: ({ image }) =>
    getBaseSchema(image)
      .extend({
        roomTypes: z.array(z.string()).default([]),
        sleeps: z.number().optional(),
      })
      .superRefine(requireAltWithImage),
});

// Dated events. Own schema rather than the listing base: events have dates and a
// scheduled/cancelled state instead of open/seasonal/closed.
const events = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/events' }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string(),
        description: z.string().max(160),
        // Date only; times go in startTime/endTime (local Canary time, "HH:MM")
        startDate: z.coerce.date(),
        endDate: z.coerce.date().optional(),
        startTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
        endTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
        status: z.enum(['scheduled', 'cancelled', 'postponed']).default('scheduled'),
        venue: z.string().optional(),
        address: z.string().optional(),
        price: z.string().optional(), // free text: "Free", "€10", "€5 kids / €10 adults"
        organiser: z.string().optional(),
        website: z.string().url().optional(),
        // Where we found it, so a scraped event can be rechecked later
        sourceUrl: z.string().url().optional(),
        // Where to sign up or buy tickets, if anywhere
        registrationUrl: z.string().url().optional(),
        // Drafts (e.g. from the weekly event-finding task) build nowhere until set to false
        draft: z.boolean().default(false),
        tags: z.array(z.string()).default([]),
        coverImage: image().optional(),
        coverImageAlt: z.string().optional(),
        publishedAt: z.coerce.date(),
        updatedAt: z.coerce.date().optional(),
      })
      .refine((data) => !data.endDate || data.endDate >= data.startDate, {
        message: 'endDate must be on or after startDate',
        path: ['endDate'],
      })
      .superRefine(requireAltWithImage),
});

const siteConfig = defineCollection({
  loader: file('./src/data/site-config.json'),
  schema: z.object({
    id: z.string(),
    phone: z.string().optional(),
    email: z.string().email(),
    address: z.string(),
    instagramUrl: z.string().url().optional(),
  }),
});

export const collections = {
  activities,
  food,
  services,
  accommodation,
  events,
  siteConfig,
};
