import { config, fields, collection } from '@keystatic/core';
import { FOOD_TYPES, FOOD_TYPE_KEYS } from './src/data/food-types';

const contentField = fields.markdoc({
  label: 'Content',
  extension: 'md',
});

const baseFields = {
  description: fields.text({
    label: 'Description',
    description: 'Max 160 characters — used in search results and social sharing.',
    multiline: false,
    validation: { length: { max: 160 } },
  }),
  status: fields.select({
    label: 'Status',
    options: [
      { label: 'Open', value: 'open' },
      { label: 'Seasonal', value: 'seasonal' },
      { label: 'Closed', value: 'closed' },
    ],
    defaultValue: 'open',
  }),
  seasonNote: fields.text({
    label: 'Season note',
    description: 'Shown when status is Seasonal.',
    multiline: false,
  }),
  address: fields.text({ label: 'Address', multiline: false }),
  phone: fields.text({ label: 'Phone', multiline: false }),
  website: fields.url({ label: 'Website' }),
  tags: fields.array(fields.text({ label: 'Tag' }), {
    label: 'Tags',
    itemLabel: (props) => props.value,
  }),
  coverImage: fields.image({
    label: 'Cover image',
    directory: 'src/content',
    publicPath: '../../content',
  }),
  coverImageAlt: fields.text({ label: 'Cover image alt text', multiline: false }),
  priceRange: fields.select({
    label: 'Price range',
    options: [
      { label: 'Free', value: 'free' },
      { label: '€', value: '€' },
      { label: '€€', value: '€€' },
      { label: '€€€', value: '€€€' },
    ],
    defaultValue: '€€',
  }),
  featured: fields.checkbox({ label: 'Featured on homepage', defaultValue: false }),
  publishedAt: fields.date({ label: 'Published date' }),
  updatedAt: fields.date({ label: 'Last updated' }),
};

export default config({
  storage: { kind: 'local' },

  collections: {
    activities: collection({
      label: 'Activities',
      slugField: 'title',
      path: 'src/content/activities/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        ...baseFields,
        duration: fields.text({ label: 'Duration', multiline: false }),
        difficulty: fields.select({
          label: 'Difficulty',
          options: [
            { label: 'Easy', value: 'easy' },
            { label: 'Moderate', value: 'moderate' },
            { label: 'Hard', value: 'hard' },
          ],
          defaultValue: 'easy',
        }),
        lat: fields.ignored(),
        lng: fields.ignored(),
        locations: fields.array(
          fields.object({
            name: fields.text({
              label: 'Name',
              description: 'The map goes under the heading that starts with this name; unmatched ones go at the end.',
              multiline: false,
            }),
            query: fields.text({
              label: 'Google Maps search',
              description: 'What to search for, e.g. "Mirador de Archipenque, Tenerife".',
              multiline: false,
            }),
            embed: fields.text({
              label: 'Google Maps embed (optional)',
              description: 'Paste from Google Maps → Share → Embed a map, for an exact pin. Used instead of the search.',
              multiline: false,
            }),
          }),
          {
            label: 'Map locations',
            description: 'Each one gets an embedded Google Map in the listing text.',
            itemLabel: (props) => props.fields.name.value,
          },
        ),
        content: contentField,
      },
    }),

    food: collection({
      label: 'Food & Drink',
      slugField: 'title',
      path: 'src/content/food/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        ...baseFields,
        type: fields.select({
          label: 'Type',
          options: FOOD_TYPE_KEYS.map((key) => ({ label: FOOD_TYPES[key].label, value: key })),
          defaultValue: 'restaurant',
        }),
        cuisine: fields.array(fields.text({ label: 'Cuisine type' }), {
          label: 'Cuisine',
          itemLabel: (props) => props.value,
        }),
        openingHours: fields.text({ label: 'Opening hours', multiline: false }),
        content: contentField,
      },
    }),

    services: collection({
      label: 'Services',
      slugField: 'title',
      path: 'src/content/services/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        ...baseFields,
        serviceType: fields.text({ label: 'Service type', multiline: false }),
        whatsapp: fields.text({ label: 'WhatsApp number', multiline: false }),
        content: contentField,
      },
    }),

    accommodation: collection({
      label: 'Accommodation',
      slugField: 'title',
      path: 'src/content/accommodation/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        ...baseFields,
        roomTypes: fields.array(fields.text({ label: 'Room type' }), {
          label: 'Room types',
          itemLabel: (props) => props.value,
        }),
        sleeps: fields.number({ label: 'Sleeps (max guests)' }),
        content: contentField,
      },
    }),

    events: collection({
      label: 'Events',
      slugField: 'title',
      path: 'src/content/events/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        description: baseFields.description,
        startDate: fields.date({ label: 'Start date', validation: { isRequired: true } }),
        endDate: fields.date({ label: 'End date', description: 'Only for events that run over several days.' }),
        startTime: fields.text({ label: 'Start time', description: '24-hour, e.g. 20:00', multiline: false }),
        endTime: fields.text({ label: 'End time', description: '24-hour, e.g. 23:30', multiline: false }),
        status: fields.select({
          label: 'Status',
          options: [
            { label: 'Scheduled', value: 'scheduled' },
            { label: 'Cancelled', value: 'cancelled' },
            { label: 'Postponed', value: 'postponed' },
          ],
          defaultValue: 'scheduled',
        }),
        venue: fields.text({ label: 'Venue', multiline: false }),
        address: baseFields.address,
        price: fields.text({ label: 'Price', description: 'e.g. Free, €10, €5 kids / €10 adults', multiline: false }),
        organiser: fields.text({ label: 'Organiser', multiline: false }),
        website: baseFields.website,
        sourceUrl: fields.url({ label: 'Source', description: 'Where the event was found, for rechecking later.' }),
        registrationUrl: fields.url({ label: 'Sign-up / tickets link', description: 'Where people register or buy tickets, if anywhere.' }),
        draft: fields.checkbox({ label: 'Draft (hidden from the site)', defaultValue: false }),
        tags: baseFields.tags,
        coverImage: baseFields.coverImage,
        coverImageAlt: baseFields.coverImageAlt,
        publishedAt: baseFields.publishedAt,
        updatedAt: baseFields.updatedAt,
        content: contentField,
      },
    }),
  },
});
