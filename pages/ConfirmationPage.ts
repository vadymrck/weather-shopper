import { expect, type Page } from "@playwright/test";

export class ConfirmationPage {
  public constructor(private readonly page: Page) {}

  // Locators
  private locateOutcomeHeading() {
    return this.page.getByRole("heading", { name: /PAYMENT (SUCCESS|FAILED)/ });
  }

  // Actions

  // Assertions
  public async toBeOpen(): Promise<void> {
    await expect(this.page).toHaveURL(/\/confirmation$/);
    await expect(this.locateOutcomeHeading()).toBeVisible();
  }

  public async toHaveSuccessfulPayment(): Promise<void> {
    await expect(this.locateOutcomeHeading()).toHaveText("PAYMENT SUCCESS");
    await expect(this.page.getByText(/Your payment was successful\./)).toBeVisible();
  }
}
