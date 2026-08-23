import { expect, type FrameLocator, type Page } from "@playwright/test";

import type { PaymentData } from "../test-data/payment.data";

export class StripeCheckout {
  public constructor(private readonly page: Page) {}

  // Locators
  private locateFrame(): FrameLocator {
    return this.page.frameLocator('iframe[name="stripe_checkout_app"]');
  }

  // Actions
  public async completePayment(payment: PaymentData): Promise<void> {
    const frame = this.locateFrame();

    await this.toBeOpen();
    await frame.getByPlaceholder("Email").fill(payment.email);
    await frame.getByPlaceholder("Card number").fill(payment.cardNumber);
    await frame.getByPlaceholder("MM / YY").fill(payment.expiry);
    const cvcInput = frame.getByPlaceholder("CVC");
    await cvcInput.fill(payment.cvc);
    await cvcInput.press("Tab");

    const zipInput = frame.getByPlaceholder("ZIP Code");
    if (await zipInput.isVisible()) {
      await zipInput.fill(payment.zip);
    }

    await frame.getByRole("button", { name: /Pay/ }).click();
  }

  // Assertions
  public async toBeOpen(): Promise<void> {
    await expect(this.locateFrame().getByPlaceholder("Email")).toBeVisible();
  }

  public async toHaveInvalidExpiry(): Promise<void> {
    await expect(this.locateFrame().getByPlaceholder("MM / YY")).toHaveClass(/\binvalid\b/);
  }
}
