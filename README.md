# SDET Automation Framework - Hybrid Architecture (UI & API)

This repository contains a high-performance, fully decoupled automation framework designed under strict software engineering principles for both UI and API testing layers using **TypeScript** and **Playwright**.

## 🚀 Key Architectural Features

- **Domain Decoupling:** Complete separation of concerns between API and UI execution contexts inside the configuration layers.
- **Dependency Injection & POM:** Advanced Page Object Model blueprint utilizing custom Playwright Fixtures to inject page abstractions dynamically.
- **Session-State Bypass:** Global setup layer designed to authenticate once and inject cookies/storage states via encrypted local sessions, speeding up UI execution.
- **Dynamic Test Data Factories:** Automated data payload generation using `@faker-js/faker` wrapped inside Object Factories for resilient, state-independent API test runs.
- **Network Interception & Mocking:** Bulletproof resilience validations via Playwright routing to simulate API network faults (HTTP 500) and artificial network throttling (Slow 3G).
- **Strict Linting:** Enforced code quality and formatting guidelines powered by ESLint and TypeScript strict mode.

---

## 🛠️ Local Setup & Execution

### Prerequisites

Make sure you have a `.env` file configured in the root directory of the project with your local environment targets.

**CRITICAL:** Never commit your real credentials. Replicate the structure below inside your local `.env`:

```env
UI_URL=https://www.saucedemo.com
API_URL=https://reqres.in
REQRES_API_KEY=your_free_key_from_reqres_interface
```

### Installation

Cloning the repository and installing the ecosystem's development dependencies:

```bash
npm install
```

### Code Quality Validation (Linter)

Execute the rules engine to check for TypeScript syntax adherence and structural code guidelines before any test execution:

```bash
npm run lint
npm run lint:fix
```

### Test Execution Control Deck

Run the sovereign command to execute the entire hybrid testing suite across all sandboxed layers:

```bash
npm test
```

Or target specific engineering scopes to speed up your local validation workflow:

```bash
# Execute only isolated API contract and mutation tests with dynamic data
npm run test:api

# Execute UI regressions over Google Chromium using the injected auth session
npm run test:ui

# Validate responsive layout and cross-browser rendering across multiple browser engines
npm run test:ui:crossbrowser
```

**Developed as a core milestone in the transition roadmap toward Software Development Engineer in Test (SDET).**
