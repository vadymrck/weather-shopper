import { test } from "@playwright/test";

import { moisturizerRules, sunscreenRules } from "../models/shopping-rules";
import { CartPage } from "../pages/CartPage";
import { ProductsPage } from "../pages/ProductsPage";
import { calculateProductTotal } from "../utils/money";

test.describe("Product selection rules", () => {
  test("should add the cheapest Aloe and Almond moisturizers to the cart @regression", async ({
    page,
  }) => {
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);

    await test.step("Open the moisturizer catalogue", async () => {
      await page.goto("/moisturizer");
      await productsPage.toBeOpen("moisturizers");
    });

    const selectedItems =
      await test.step("Add the two cheapest required moisturizers", async () =>
        productsPage.addCheapestMatchingProducts(moisturizerRules));

    const expectedTotal = calculateProductTotal(selectedItems);

    await test.step("Verify moisturizer cart items and total", async () => {
      await productsPage.openCart();
      await cartPage.toBeOpen();
      await cartPage.toHaveItems(selectedItems);
      await cartPage.toHaveTotal(expectedTotal);
    });
  });

  test("should add the cheapest SPF-50 and SPF-30 sunscreens to the cart @regression", async ({
    page,
  }) => {
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);

    await test.step("Open the sunscreen catalogue", async () => {
      await page.goto("/sunscreen");
      await productsPage.toBeOpen("sunscreens");
    });

    const selectedItems =
      await test.step("Add the two cheapest required sunscreens", async () =>
        productsPage.addCheapestMatchingProducts(sunscreenRules));

    const expectedTotal = calculateProductTotal(selectedItems);

    await test.step("Verify sunscreen cart items and total", async () => {
      await productsPage.openCart();
      await cartPage.toBeOpen();
      await cartPage.toHaveItems(selectedItems);
      await cartPage.toHaveTotal(expectedTotal);
    });
  });
});
