/**
 * Kinds of place in the Food & Drink collection. The keys are what's stored in
 * frontmatter (`type:`); `schemaType` is the schema.org type used in JSON-LD.
 */
export const FOOD_TYPES = {
  restaurant: { label: 'Restaurant', schemaType: 'Restaurant' },
  cafe: { label: 'Café', schemaType: 'CafeOrCoffeeShop' },
  bar: { label: 'Bar', schemaType: 'BarOrPub' },
} as const;

export type FoodType = keyof typeof FOOD_TYPES;

export const FOOD_TYPE_KEYS = Object.keys(FOOD_TYPES) as [FoodType, ...FoodType[]];
