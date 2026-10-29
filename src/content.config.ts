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
  siteConfig,
};
