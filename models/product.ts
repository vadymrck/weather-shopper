export interface Product {
  readonly name: string;
  readonly price: number;
}

export interface ProductRule {
  readonly description: string;
  readonly matches: (product: Product) => boolean;
}

export type ShoppingCategory = "moisturizers" | "sunscreens";
