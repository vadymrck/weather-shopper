import { test } from "@playwright/test";

import type { ProductRule, ShoppingCategory } from "../models/product";
import { moisturizerRules, sunscreenRules } from "../models/shopping-rules";
import { CartPage } from "../pages/CartPage";
import { ConfirmationPage } from "../pages/ConfirmationPage";
import { HomePage } from "../pages/HomePage";
import { ProductsPage } from "../pages/ProductsPage";
import { StripeCheckout } from "../pages/StripeCheckout";
import { validPayment } from "../test-data/payment.data";

const rulesByCategory: Record<ShoppingCategory, readonly ProductRule[]> = {
  moisturizers: moisturizerRules,
  sunscreens: sunscreenRules,
};

test("should complete the weather-appropriate purchase @smoke @payment", async ({ page }) => {
  const homePage = new HomePage(page);
  const productsPage = new ProductsPage(page);
  const cartPage = new CartPage(page);
  const stripeCheckout = new StripeCheckout(page);
  const confirmationPage = new ConfirmationPage(page);

  const category = await test.step("Open the home page and determine the required shopping path", async () => {
    await homePage.goto();
    const temperature = await homePage.getTemperature();
    return homePage.getRequiredCategory(temperature);
  });

  const selectedItems = await test.step("Add the two cheapest required products", async () => {
    await homePage.openCategory(category);
    await productsPage.toBeOpen(category);

    return productsPage.addCheapestMatchingProducts(rulesByCategory[category]);
  });

  await test.step("Verify the cart before payment", async () => {
    await productsPage.openCart();
    await cartPage.toBeOpen();
    await cartPage.toHaveItems(selectedItems);
    await cartPage.toHaveTotalFor(selectedItems);
  });

  await test.step("Submit payment and verify the successful confirmation", async () => {
    await cartPage.openStripeCheckout();
    await stripeCheckout.completePayment(validPayment);
    await confirmationPage.toBeOpen();
    await confirmationPage.toHaveSuccessfulPayment();
  });
});
