import { test, expect } from "../../src/fixtures/baseTest";

test.describe("e-commerce UI - Product Management", () => {
  const productName = "Sauce Labs Backpack";
  test("should user login to the system and validate product added to cart", async ({
    page, 
    productsPage
  }) => {
    // Arrange
    await page.goto('/inventory.html');
    await expect(page).toHaveURL(/.*inventory.html/);

    // Action
    await productsPage.addProductToCart(productName);

    // Assertion    
    await productsPage.goToCart();
    await productsPage.validateProductInCart(productName);
  });
});
