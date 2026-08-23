import { expect, type Page } from "@playwright/test";

export type PaymentOutcome = "PAYMENT SUCCESS" | "PAYMENT FAILED";

export class ConfirmationPage {
  public constructor(private readonly page: Page) {}

  // Locators
  private locateOutcomeHeading() {
    return this.page.getByRole("heading", { name: /PAYMENT (SUCCESS|FAILED)/ });
  }

  // Actions
  public async getOutcome(): Promise<PaymentOutcome> {
    const outcome = await this.locateOutcomeHeading().innerText();

    if (outcome === "PAYMENT SUCCESS" || outcome === "PAYMENT FAILED") {
      return outcome;
    }

    throw new Error(`Unexpected payment confirmation heading: "${outcome}".`);
  }

  // Assertions
  public async toBeOpen(): Promise<void> {
    await expect(this.page).toHaveURL(/\/confirmation$/);
    await expect(this.locateOutcomeHeading()).toBeVisible();
  }

  public async toHaveOutcomeMessage(outcome: PaymentOutcome): Promise<void> {
    const expectedMessage =
      outcome === "PAYMENT SUCCESS"
        ? /Your payment was successful\./
        : /Your payment did not go through\./;

    await expect(this.page.getByText(expectedMessage)).toBeVisible();
  }
}
