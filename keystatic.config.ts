import { config, fields, collection } from '@keystatic/core';

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
        content: contentField,
      },
    }),

    restaurants: collection({
      label: 'Restaurants',
      slugField: 'title',
      path: 'src/content/restaurants/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        ...baseFields,
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

  },
});
