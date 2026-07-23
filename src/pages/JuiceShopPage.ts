import { Page, Locator } from "@playwright/test";

export class JuiceShopPage {
  readonly page: Page;
  readonly welcomeBannerDismissButton: Locator;
  readonly cookieConsentDismissButton: Locator;
  readonly navbarAccountButton: Locator;
  readonly userProfileButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.welcomeBannerDismissButton = page.locator(
      'button[aria-label="Close Welcome Banner"]',
    );
    this.cookieConsentDismissButton = page.locator(
      'a[aria-label="dismiss cookie message"]',
    );
    this.navbarAccountButton = page.locator("#navbarAccount");
    this.userProfileButton = page.locator(
      'button[aria-label="Go to user profile"]',
    );
  }

  /**
   * Injects the JWT token and suppresses all UI overlays in localStorage
   * BEFORE navigating to the page, bypassing login forms and popups.
   */
  async injectSessionToken(token: string): Promise<void> {
    await this.page.addInitScript((jwtToken: string) => {
      window.localStorage.setItem("token", jwtToken);
      document.cookie = "welcomebanner_status=dismiss; path=/";
      document.cookie = "cookieconsent_status=dismiss; path=/";
    }, token);
  }

  /**
   * Navigates to the Juice Shop home page
   */
  async navigate(): Promise<void> {
    await this.page.goto("/#/search");
  }

  /**
   * Dismisses welcome banner and cookie overlays safely using forced DOM clicks
   */
  async dismissOverlays(): Promise<void> {
    try {
      if (await this.welcomeBannerDismissButton.isVisible({ timeout: 4000 })) {
        await this.welcomeBannerDismissButton.click({ force: true });
        await this.page
          .locator(".cdk-overlay-backdrop")
          .waitFor({ state: "detached", timeout: 4000 })
          .catch(() => {});
      }
    } catch {
      // Silently ignore if welcome banner is absent
    }

    try {
      if (await this.cookieConsentDismissButton.isVisible({ timeout: 3000 })) {
        await this.cookieConsentDismissButton.click({ force: true });
      }
    } catch {
      // Silently ignore if cookie banner is absent
    }
  }

  /**
   * Opens the account menu in the top navbar
   */
  async openAccountMenu(): Promise<void> {
    await this.navbarAccountButton.click();
  }
}
