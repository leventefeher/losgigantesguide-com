import { defineCollection, z } from 'astro:content';
import { glob, file } from 'astro/loaders';
import type { ImageFunction } from 'astro';

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

const activities = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/activities' }),
  schema: ({ image }) =>
    getBaseSchema(image).extend({
      duration: z.string().optional(),
      difficulty: z.enum(['easy', 'moderate', 'hard']).optional(),
      lat: z.number().optional(),
      lng: z.number().optional(),
    }),
});

const restaurants = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/restaurants' }),
  schema: ({ image }) =>
    getBaseSchema(image).extend({
      cuisine: z.array(z.string()).default([]),
      openingHours: z.string().optional(),
    }),
});

const services = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/services' }),
  schema: ({ image }) =>
    getBaseSchema(image).extend({
      serviceType: z.string(),
      whatsapp: z.string().optional(),
    }),
});

const danceLessons = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/dance-lessons' }),
  schema: ({ image }) =>
    getBaseSchema(image).extend({
      schedule: z.string(),
      level: z.array(z.enum(['beginner', 'intermediate', 'all-levels'])),
      whatsapp: z.string(),
    }),
});

const accommodation = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/accommodation' }),
  schema: ({ image }) =>
    getBaseSchema(image).extend({
      roomTypes: z.array(z.string()).default([]),
      sleeps: z.number().optional(),
    }),
});

const fitness = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/fitness' }),
  schema: ({ image }) =>
    getBaseSchema(image).extend({
      duration: z.string().optional(),
      difficulty: z.enum(['easy', 'moderate', 'hard']).optional(),
      indoorOutdoor: z.enum(['indoor', 'outdoor', 'both']).optional(),
    }),
});

const dayTrips = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/day-trips' }),
  schema: ({ image }) =>
    getBaseSchema(image).extend({
      destination: z.string().optional(),
      distance: z.string().optional(),
      duration: z.string().optional(),
      howToGetThere: z.string().optional(),
    }),
});

const walks = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/walks' }),
  schema: ({ image }) =>
    getBaseSchema(image).extend({
      distance: z.string().optional(),
      duration: z.string().optional(),
      difficulty: z.enum(['easy', 'moderate', 'hard']).optional(),
      startPoint: z.string().optional(),
      elevationGain: z.string().optional(),
    }),
});

const siteConfig = defineCollection({
  loader: file('./src/data/site-config.json'),
  schema: z.object({
    id: z.string(),
    phone: z.string(),
    whatsapp: z.string(),
    email: z.string().email(),
    address: z.string(),
    instagramUrl: z.string().url().optional(),
  }),
});

export const collections = {
  activities,
  restaurants,
  services,
  accommodation,
  siteConfig,
};
