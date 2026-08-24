import { expect, type Locator, type Page } from "@playwright/test";

import type { Product, ProductRule, ShoppingCategory } from "../models/product";
import { parsePrice } from "../utils/money";
import { selectCheapestMatchingProducts } from "../utils/product-selection";

export class ProductsPage {
  public constructor(private readonly page: Page) {}

  // Locators
  private locateProductCards(): Locator {
    return this.page.locator(".text-center.col-4");
  }

  private locateProductCard(name: string): Locator {
    return this.locateProductCards().filter({
      has: this.page.getByText(name, { exact: true }),
    });
  }

  private locateCartButton(): Locator {
    return this.page.getByRole("button", { name: /Cart -/ });
  }

  // Actions
  public async getProducts(): Promise<Product[]> {
    const cards = this.locateProductCards();
    const count = await cards.count();
    const products: Product[] = [];

    for (let index = 0; index < count; index += 1) {
      const cardText = await cards.nth(index).innerText();
      const [name] = cardText
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);

      if (!name) {
        throw new Error(`Could not parse product name from card ${index}.`);
      }

      products.push({ name, price: parsePrice(cardText) });
    }

    return products;
  }

  public async addProduct(name: string): Promise<void> {
    const card = this.locateProductCard(name);
    await expect(
      card,
      `Expected product card for "${name}" to be visible.`,
    ).toHaveCount(1);
    await card.getByRole("button", { name: "Add" }).click();
  }

  public async addCheapestMatchingProducts(
    rules: readonly ProductRule[],
  ): Promise<Product[]> {
    const selectedProducts = selectCheapestMatchingProducts(
      await this.getProducts(),
      rules,
    );

    for (const [index, product] of selectedProducts.entries()) {
      await this.addProduct(product.name);
      await expect(this.locateCartButton()).toHaveText(
        `Cart - ${index + 1} item(s)`,
      );
    }

    return selectedProducts;
  }

  public async openCart(): Promise<void> {
    await Promise.all([
      this.page.waitForURL(/\/cart$/),
      this.locateCartButton().click(),
    ]);
  }

  // Assertions
  public async toBeOpen(category: ShoppingCategory): Promise<void> {
    const heading = category === "moisturizers" ? "Moisturizers" : "Sunscreens";
    await expect(
      this.page.getByRole("heading", { name: heading }),
    ).toBeVisible();
  }
}
