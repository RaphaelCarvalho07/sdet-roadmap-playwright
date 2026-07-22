import { test, expect } from "../../src/fixtures/juiceTest";

test.describe("owasp Juice Shop - Hybrid E2E Session Injection", () => {
  test("should open UI pre-authenticated bypassing login form", async ({
    juiceShopPage,
  }) => {
    // 1. Open the Account Menu in the top navbar
    await juiceShopPage.openAccountMenu();

    // 2. Assert that the logged-in User Profile button is visible
    await expect(juiceShopPage.userProfileButton).toBeVisible();
  });
});
