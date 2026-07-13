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

  const validationScenarios = [
    {
      field: "firstName",
      factoryMethod: "createCheckoutDataWithMissingFirstName" as const,
      expectedMessage: "Error: First Name is required"
    },

    {
      field: "lastName",
      factoryMethod: "createCheckoutDataWithMissingLastName" as const,
      expectedMessage: "Error: Last Name is required"
    },

    {
      field: "postalCode",
      factoryMethod: "createCheckoutDataWithMissingPostalCode" as const,
      expectedMessage: "Error: Postal Code is required"
    }
  ];

  for (const scenario of validationScenarios){
    test(`should display validation error and highlight input when ${scenario.field} is missing`, async ({
      productsPage,
      checkoutPage,
    }) => {
      await productsPage.addProductToCart(productName);
      await productsPage.goToCart();
      await checkoutPage.startCheckout();

      const invalidData = await CheckoutFactory[scenario.factoryMethod]();

      await checkoutPage.fillInformation(invalidData.firstName, invalidData.lastName, invalidData.postalCode);

      await checkoutPage.validateFieldError(scenario.field, scenario.expectedMessage);
    })
  }
});
