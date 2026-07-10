import { test, expect } from "../../src/fixtures/baseTest";
import { CheckoutFactory } from "../../src/factories/checkoutFactory";

test.describe("e-commerce UI - Checkout Flow", () => {
  const productName = "Sauce Labs Backpack";

  test.beforeEach(async ({ page }) => {
    // Direct navigate to inventory, since global setup handles auth bypass
    await page.goto("/inventory.html");
    await expect(page).toHaveURL(/.*inventory.html/);
  });

  test("should successfully complete a purchase using valid dynamic data", async ({
    productsPage,
    checkoutPage,
  }) => {
    // 1. Add product to cart and go to cart page
    await productsPage.addProductToCart(productName);
    await productsPage.goToCart();

    // 2. Start checkout step-one form
    await checkoutPage.startCheckout();

    // 3. Generate dynamic checkout data using the Object Mother factory
    const validCheckoutData = await CheckoutFactory.createValidCheckoutData();

    // 4. Fill billing details and submit step-one
    await checkoutPage.fillInformation(
      validCheckoutData.firstName,
      validCheckoutData.lastName,
      validCheckoutData.postalCode
    );

    // 5. Finish checkout and verify completion
    await checkoutPage.finishCheckout();
    await checkoutPage.validateCheckoutComplete();
  });

  test("should display validation error when first name is missing", async ({
    productsPage,
    checkoutPage,
  }) => {
    // 1. Add product to cart and go to cart page
    await productsPage.addProductToCart(productName);
    await productsPage.goToCart();

    // 2. Start checkout
    await checkoutPage.startCheckout();

    // 3. Generate checkout data missing the first name using the Object Mother variant
    const invalidData = await CheckoutFactory.createCheckoutDataWithMissingFirstName();

    // 4. Fill details and verify the validation error matches expected SauceDemo behavior
    await checkoutPage.fillInformation(
      invalidData.firstName,
      invalidData.lastName,
      invalidData.postalCode
    );
    await checkoutPage.validateErrorMessage("Error: First Name is required");
  });
});
