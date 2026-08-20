# 📘 Study Guide: Hybrid E2E Testing (API Seeding & Session Injection)

This guide covers the hybrid automation architecture that leverages REST APIs to seed application state and injects authorization tokens to bypass slow UI login screens.

---

## 1. The Challenge of Traditional UI Flows

Traditional E2E UI automation tests interact with forms visually to log in or create entities (addresses, credit cards) for every test run.
- **The Overhead:** A typical UI sign-in/registration takes 5-10 seconds per test. In a suite with 100 tests, this adds 15 minutes of execution time.
- **The Flakiness:** Spawning browsers, entering text, clicking buttons, and waiting for page transitions are highly prone to network and rendering instabilities.

---

## 2. The Hybrid Solution: Shift-Left Seeding

In hybrid automation, we complete all prerequisite setup steps directly via background REST API calls before spawning the UI browser window.

```
       [Test Start] ──► [REST API: Create User] ──► [REST API: Seed Address]
                                                             │
       [Direct UI Navigation: /basket] ◄── [Inject JWT Token]┘
```

### The Seeding Process:
1.  Use an API client inside a test hook (`beforeAll` or base fixture) to register a user.
2.  Send POST requests to seed the required entities (e.g. adding items to shopping basket, saving a delivery address).
3.  Receive the generated database IDs and session JWT tokens.

---

## 3. Session State Injection

Once the user is registered and the basket is filled via the backend, we must authenticate the browser context instantly without navigating to the login page.

### Storage Injection Pattern:
Modern single-page applications (SPAs) store JWT tokens and session data in `localStorage` or `sessionStorage`. We inject these values into the browser's context using `page.addInitScript` before the first page load:

```typescript
// Injection helper in Page Object
async injectSession(jwtToken: string, basketId: number): Promise<void> {
  await this.page.addInitScript(({ token, bid }) => {
    window.localStorage.setItem('token', token);
    window.localStorage.setItem('bid', String(bid));
    window.sessionStorage.setItem('bid', String(bid));
  }, { token: jwtToken, bid: basketId });
}
```
This bypasses the UI login form entirely, taking the browser from an unauthenticated state to a fully logged-in, data-seeded checkout page in milliseconds!
