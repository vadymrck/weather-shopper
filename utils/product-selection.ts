import type { Product, ProductRule } from "../models/product";

export function selectCheapestMatchingProducts(
  products: readonly Product[],
  rules: readonly ProductRule[],
): Product[] {
  return rules.map((rule) => selectCheapestMatchingProduct(products, rule));
}

function selectCheapestMatchingProduct(products: readonly Product[], rule: ProductRule): Product {
  const matchingProducts = products.filter(rule.matches);

  if (matchingProducts.length === 0) {
    throw new Error(`No product matches rule: ${rule.description}.`);
  }

  return matchingProducts.reduce((cheapest, product) =>
    product.price < cheapest.price ? product : cheapest,
  );
}
