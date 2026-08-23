import { expect, type Page } from "@playwright/test";

import type { ShoppingCategory } from "../models/product";

export class HomePage {
  public constructor(private readonly page: Page) {}

  // Locators
  private locateTemperature() {
    return this.page.locator("#temperature");
  }

  private locateCategoryLink(category: ShoppingCategory) {
    const name = category === "moisturizers" ? "Buy moisturizers" : "Buy sunscreens";
    return this.page.getByRole("link", { name });
  }

  // Actions
  public async goto(): Promise<void> {
    await this.page.goto("/");
    await this.toBeOpen();
  }

  public async getTemperature(): Promise<number> {
    const text = await this.locateTemperature().innerText();
    const temperature = Number.parseInt(text, 10);

    if (Number.isNaN(temperature)) {
      throw new Error(`Could not parse temperature from: "${text}".`);
    }

    return temperature;
  }

  public getRequiredCategory(temperature: number): ShoppingCategory {
    if (temperature < 19) {
      return "moisturizers";
    }

    if (temperature > 34) {
      return "sunscreens";
    }

    throw new Error(
      `Unsupported temperature ${temperature}°C: the assignment defines no shopping task for 19–34°C.`,
    );
  }

  public async openCategory(category: ShoppingCategory): Promise<void> {
    const expectedPath = category === "moisturizers" ? /\/moisturizer$/ : /\/sunscreen$/;

    await Promise.all([
      this.page.waitForURL(expectedPath),
      this.locateCategoryLink(category).click(),
    ]);
    await this.page.waitForLoadState("load");
  }

  // Assertions
  public async toBeOpen(): Promise<void> {
    await expect(this.page.getByRole("heading", { name: "Current temperature" })).toBeVisible();
  }
}
