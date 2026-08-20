# 📘 Study Guide: Test Data Management & Object Mother Pattern

This guide covers strategies for generating, managing, and isolating test data to eliminate flaky tests and environment pollution.

---

## 1. The Anti-Pattern: Shared Static Data

Using static, hardcoded payloads in automated tests (e.g. `user_test@example.com` with a static address) leads to systematic test failures:
- **Concurrency Collision:** If two workers run tests simultaneously using the same credentials, they will overwrite each other's sessions.
- **State Pollution:** Previous runs leave residue (items in shopping cart, duplicate address entries) that breaks the assertions of subsequent runs.

---

## 2. The Solution: Dynamic Data Generation (Factories)

We use packages like `@faker-js/faker` to generate unique random values (unique emails, random names, valid phone numbers) on every execution, guaranteeing that each test runs in complete isolation.

### The Challenge of ESM in CommonJS:
Modern libraries (like Faker 8+) default to ECMAScript Modules (ESM). In projects configured as CommonJS (`"type": "commonjs"`), trying to import them synchronously throws compilation errors.
*   **The Fix:** Use dynamic asynchronous imports inside the factories to load the modules on-demand:
    ```typescript
    static async createValidUserPayload() {
      const { faker } = await import('@faker-js/faker');
      return {
        email: faker.internet.email(),
        password: faker.internet.password(),
      };
    }
    ```

---

## 3. The Object Mother Pattern

The **Object Mother** is a creational pattern that wraps data factories to provide pre-configured domain objects with specific states (e.g., a user with missing name, an expired credit card).

```
   [Faker Library] ──► [Factories] ──► [Object Mother] ──► Test Spec
                                       ├─ createValidUser()
                                       └─ createUserWithMissingEmail()
```

### Why we use it:
It keeps the test specs clean of data-generation details, serving as a single source of truth for test data shapes:
```typescript
// Test file
const invalidData = await CheckoutFactory.createCheckoutDataWithMissingFirstName();
await checkoutPage.fillInformation(invalidData);
```
