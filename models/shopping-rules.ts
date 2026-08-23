import type { ProductRule } from "./product";

export const moisturizerRules: readonly ProductRule[] = [
  {
    description: "the least expensive moisturizer containing Aloe",
    matches: (product) => /aloe/i.test(product.name),
  },
  {
    description: "the least expensive moisturizer containing Almond",
    matches: (product) => /almond/i.test(product.name),
  },
];

export const sunscreenRules: readonly ProductRule[] = [
  {
    description: "the least expensive sunscreen with SPF-50",
    matches: (product) => /spf-50/i.test(product.name),
  },
  {
    description: "the least expensive sunscreen with SPF-30",
    matches: (product) => /spf-30/i.test(product.name),
  },
];
