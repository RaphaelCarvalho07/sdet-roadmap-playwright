# SDET Automation Framework - Hybrid Architecture (UI & API)

This repository contains a high-performance, fully decoupled automation framework designed under strict software engineering principles for both UI and API testing layers using **TypeScript**, **Playwright**, **Zod 4**, and **Docker**.

## 🚀 Key Architectural Features

- **Domain Decoupling:** Complete separation of concerns between API and UI execution contexts inside the configuration layers.
- **Contract Schema Validation:** Strict runtime response schema validation using **Zod 4** and dynamic TypeScript type inference (`z.infer`).
- **Object Mother & Dynamic Data:** Payload generation using `@faker-js/faker` wrapped inside `UserFactory` for state-independent, isolated test runs.
- **Hybrid E2E Session Injection:** Background REST API data seeding combined with browser session injection (`page.addInitScript`) to bypass UI login forms in milliseconds.
- **Global Cookie Scoping:** Pre-injection of `welcomebanner_status` and `cookieconsent_status` in `document.cookie` (`path=/`) to eliminate Angular Material backdrop overlays.
- **CI/CD Service Containers:** Automated GitHub Actions pipeline executing API and UI cross-browser runs against Docker service containers with consolidated HTML reports deployed to GitHub Pages.
- **Strict Code Quality:** Enforced ESLint rules and TypeScript strict mode adherence.

---

## 🛠️ Local Setup & Execution

### Prerequisites

Make sure Docker is installed and running on your system. 

Configure your local `.env` file in the root directory:

```env
API_URL=http://localhost:3000
UI_URL=http://localhost:3000
```

### Installation

Clone the repository and install the development dependencies:

```bash
npm install
```

### 🐳 Docker Container Management

Manage the local **OWASP Juice Shop** container with dedicated npm scripts:

```bash
# Start the local Docker container (auto-pulls image if missing)
npm run docker:start

# View live container application logs in real-time
npm run docker:logs

# Stop the local Docker container
npm run docker:stop
```

### Code Quality Validation (Linter)

Execute ESLint to verify TypeScript syntax adherence and structural code guidelines:

```bash
npm run lint
```

### Test Execution Control Deck

Run the complete test suite across all sandboxed layers:

```bash
# Start the local environment and run all tests
npm run docker:start
npm test
```

Or target specific engineering scopes to speed up your local validation workflow:

```bash
# Execute isolated API contract and mutation tests
npm run test:api

# Execute UI tests on Google Chrome
npm run test:ui

# Execute cross-browser regression (Chrome, Firefox, WebKit)
npm run test:ui:crossbrowser

# Open interactive Playwright Test UI Mode
npm run test:ui:visual

# View generated Playwright HTML execution report
npm run report
```

---

**Developed as a core milestone in the transition roadmap toward Software Development Engineer in Test (SDET).**
