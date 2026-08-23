import { expect, type Page } from "@playwright/test";

import type { Product } from "../models/product";
import { calculateTotal } from "../utils/money";

export class CartPage {
  public constructor(private readonly page: Page) {}

  // Locators
  private locateItemRows() {
    return this.page.locator("table tbody tr");
  }

  private locateTotal() {
    return this.page.getByText(/Total: Rupees \d+/);
  }

  private locatePayWithCardButton() {
    return this.page.getByRole("button", { name: "Pay with Card" });
  }

  // Actions
  public async openStripeCheckout(): Promise<void> {
    await this.locatePayWithCardButton().click();
  }

  // Assertions
  public async toBeOpen(): Promise<void> {
    await expect(this.page.getByRole("heading", { name: "Checkout" })).toBeVisible();
  }

  public async toHaveItems(expectedItems: readonly Product[]): Promise<void> {
    const rows = this.locateItemRows();
    await expect(rows, `Expected ${expectedItems.length} cart item row(s).`).toHaveCount(expectedItems.length);

    for (const [index, expectedItem] of expectedItems.entries()) {
      const row = rows.nth(index);
      await expect(row, `Expected cart row ${index + 1} to contain "${expectedItem.name}".`).toContainText(
        expectedItem.name,
      );
      await expect(row, `Expected cart row ${index + 1} to contain price ${expectedItem.price}.`).toContainText(
        String(expectedItem.price),
      );
    }
  }

  public async toHaveTotalFor(items: readonly Product[]): Promise<number> {
    const expectedTotal = calculateTotal(items.map((item) => item.price));
    await expect(this.locateTotal(), `Expected cart total to equal ${expectedTotal}.`).toHaveText(
      `Total: Rupees ${expectedTotal}`,
    );
    return expectedTotal;
  }

}
