import { test as base, expect, Page } from "@playwright/test";
import { UserClient } from "../api/UserClient";
import { UserFactory } from "../factories/userFactory";
import { JuiceShopPage } from "../pages/JuiceShopPage";

type JuiceFixtures = {
  juiceShopPage: JuiceShopPage;
  authenticatedUserPage: Page;
};

export const test = base.extend<JuiceFixtures>({
  juiceShopPage: async ({ authenticatedUserPage }, use) => {
    await use(new JuiceShopPage(authenticatedUserPage));
  },

  authenticatedUserPage: async ({ page, request }, use) => {
    const userClient = new UserClient(request);
    const juicePage = new JuiceShopPage(page);

    // 1. Seed user data via API
    const registrationPayload = await UserFactory.createValidJuiceUserPayload();
    const registrationResponse =
      await userClient.registerUser(registrationPayload);
    expect(registrationResponse.ok()).toBeTruthy();

    // 2. Authenticate via API to retrieve JWT token
    const loginPayload = UserFactory.createJuiceLoginPayload(
      registrationPayload.email,
      registrationPayload.password,
    );

    const loginResponse = await userClient.loginUser(loginPayload);
    expect(loginResponse.ok()).toBeTruthy();
    const responseBody = await loginResponse.json();
    const token = responseBody.authentication.token;

    // 3. Inject session token into browser localStorage before navigation
    await juicePage.injectSessionToken(token);

    // 4. Open UI directly in authenticated state
    await juicePage.navigate();
    await juicePage.dismissOverlays();

    // 5. Yield pre-authenticated page context to the test
    await use(page);
  },
});

export { expect } from "@playwright/test";
