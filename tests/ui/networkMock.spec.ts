import { test, expect } from "../../src/fixtures/baseTest";

test.describe("e-commerce UI - Network Interception & Mocking", () => {
  test("should gracefully handle API server failure (HTTP 500) on inventory load", async ({
    page,
    productsPage,
  }) => {
    // Arrange
    await page.route("**/inventory.html", async (route) => {
      await route.fulfill({
        status: 500,
        contentType: "text/plain",
        body: "Internal Server Error - Inventory Microservice is down :'(",
      });
    });
    // Action
    await page.goto("/inventory.html");
    
    // Assert
    await productsPage.validateProductsAreNotVisible();
  });

  test("should intercept and modify static asset requests (Image Replacement)", async ({ page }) => {
    // Arrange
    const response = await page.request.get("https://playwright.dev/img/playwright-logo.svg");
    const imageBuffer = await response.body();
    
    await page.route("**/*.jpg", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "image/svg+xml",
        body: imageBuffer
      });
    });
    // Action
    await page.goto("/inventory.html");
    // Assert
    const firstProductImage = page.locator(".inventory_item_img").first();
    await expect(firstProductImage).toBeVisible();
  });

  test("should simulate network latency (Slow 3g Connection) on inventory page", async ({page}) => {
    // Arrange
    await page.route("**/inventory.html", async (route) => {
      await new Promise(resolve => setTimeout(resolve, 3000)); // Simulate 3 seconds delay
      await route.continue();
    })
    // Action
    const startTime = Date.now();
    await page.goto("/inventory.html");
    const duration = Date.now() - startTime; 

    // Assert
    expect(duration).toBeGreaterThanOrEqual(3000); // Assert that the duration is at least 3 seconds
  })
});
