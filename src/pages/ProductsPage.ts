import { Page, Locator } from "@playwright/test";

export class ProductsPage {
  private readonly page: Page;
  private readonly cartLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartLink = this.page.getByTestId("shopping-cart-link");
  }
  // Actions
  async addProductToCart(productName: string): Promise<void> {
    const formattedName = productName.toLowerCase().replace(/\s+/g, "-");
    await this.page.getByTestId(`add-to-cart-${formattedName}`).click();
  }

  async goToCart(): Promise<void> {
    await this.cartLink.click();
  }

  // Assertions
  async validateProductInCart(productName: string): Promise<void> {
    const cartItemContainer = this.page
      .locator(".cart_item")
      .filter({ hasText: productName });

    const itemNameLocator = cartItemContainer.getByTestId(
      "inventory-item-name",
    );
    await itemNameLocator.waitFor({ state: "visible" });
  }
}
