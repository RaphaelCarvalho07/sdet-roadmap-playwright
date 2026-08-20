# 📘 Study Guide: Advanced Page Object Model (POM) & Locator Resiliency

This guide covers the advanced design patterns of the **Page Object Model (POM)** and strategies for constructing resilient, future-proof element locators.

---

## 1. The Core Paradigm of POM

The Page Object Model is a design pattern that structures tests by separating the **Test Specifications (what to test)** from the **UI Details (how to interact with elements)**.

```
       ┌────────────────────────────────┐
       │           Test Spec            │
       │   (Business flows & Asserts)   │
       └───────────────┬────────────────┘
                       │ Calls actions
                       ▼
       ┌────────────────────────────────┐
       │          Page Objects          │
       │   (Locators & Element Actions) │
       └────────────────────────────────┘
```

### Why we use POM:
- **Single Source of Truth:** If an ID or button class changes on the checkout page, you update it once in the POM class constructor, not in dozens of test spec files.
- **Improved Readability:** Tests read like business cases: `await checkoutPage.fillInformation(data)` instead of raw selector calls like `await page.click('#submit-btn')`.

---

## 2. Resilient Locators: Avoiding the Fragility Trap

Many automation engineers fall into the trap of using fragile selectors like XPath based on tag indexation (`/html/body/div[2]/div/button`) or styling classes (`.btn-primary.btn-lg`). These break at the slightest change in CSS layout.

### Best Practice Locator Hierarchy (Playwright):
1.  **Strict Test IDs (Best):** Explicit testing attributes added by developers for automation (e.g. `data-testid`).
    *   *Usage:* `page.getByTestId('submit-button')`
2.  **Accessibility Roles & Text (Highly Recommended):** Locators that mimic how a human sees the screen, enforcing accessibility compliance.
    *   *Usage:* `page.getByRole('button', { name: 'Submit' })`
3.  **Chained and Filtered Locators:** When elements share identical selectors, filter the scope to target the precise target.
    *   *Usage:*
        ```typescript
        const targetCard = page.locator('mat-card').filter({ hasText: 'Product Name' });
        const buyButton = targetCard.getByRole('button', { name: 'Buy' });
        await buyButton.click();
        ```

---

## 3. Dependency Injection via Custom Fixtures

Instantiating Page Objects inside every test file (`const loginPage = new LoginPage(page)`) creates redundant boilerplate code. 

### The SDET Pattern: Base Test Fixtures
We extend Playwright's native test engine to automatically instantiate Page Objects and inject them directly into the test arguments:

```typescript
import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

type MyFixtures = {
  loginPage: LoginPage;
};

export const test = base.extend<MyFixtures>({
  loginPage: async ({ page }, use) => {
    // 1. Instantiation before the test executes
    const loginPage = new LoginPage(page);
    // 2. Yield the page to the test
    await use(loginPage);
    // 3. Optional cleanup steps after the test finishes
  },
});
```
Test files just import this custom `test` and use `({ loginPage })` directly in their callback signature.
