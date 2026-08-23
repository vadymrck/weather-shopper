import { expect, test } from "@playwright/test";

import { CartPage } from "../pages/CartPage";
import { ProductsPage } from "../pages/ProductsPage";
import { StripeCheckout } from "../pages/StripeCheckout";
import { expiredPayment } from "../test-data/payment.data";

test("should reject an expired card in Stripe Checkout @regression @payment", async ({ page }) => {
  const productsPage = new ProductsPage(page);
  const cartPage = new CartPage(page);
  const stripeCheckout = new StripeCheckout(page);

  await test.step("Prepare a minimal cart for checkout", async () => {
    await page.goto("/sunscreen");
    await productsPage.toBeOpen("sunscreens");

    const [firstProduct] = await productsPage.getProducts();
    await productsPage.addProduct(firstProduct.name);
    await productsPage.openCart();
    await cartPage.toBeOpen();
    await cartPage.toHaveItems([firstProduct]);
  });

  await test.step("Open Stripe Checkout and submit expired payment details", async () => {
    await cartPage.openStripeCheckout();
    await stripeCheckout.completePayment(expiredPayment);
  });

  await test.step("Verify Stripe rejects the expiry and checkout remains open", async () => {
    await stripeCheckout.toHaveInvalidExpiry();
    await expect(page).not.toHaveURL(/\/confirmation$/);
  });
});
