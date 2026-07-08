# 📘 LOGBOOK & BACKUP - SDET JOURNEY

> **Context Instruction:** This file serves as the central, linear memory of my career transition to SDET. It must be kept updated incrementally with each technical mentorship session conducted in the Antigravity IDE.

---

## 1. Incremental Update Prompt (End of Session)

Whenever you finish a technical discussion, bug resolution, or test architecture design, copy the prompt below, paste it into the IDE chat, and send it:

```prompt
Open the @jornada_sdet_backup.md file and add a new section at the end of it with the summary of our current conversation. Strictly follow this Markdown template for the new section:

## [Today's Date] - [Subject Title]
### 1. Scenario and Technical Challenge
[Insert the summary of the problem we solved here]
### 2. Structured Solution & Recommended Patterns
[Insert the code blocks and architecture we consolidated here]
### 3. Next Study Steps
[Insert the immediate action plan here]

Keep the rest of the file intact and just append this new section.
```

## 2. Git Versioning Flow (Post-Session)

After the AI confirms it has saved the new section to the file, open your personal repository terminal and run the following commands to secure your progress in the cloud:

```bash
git add jornada_sdet_backup.md
git commit -m "docs: add mentorship about [Today's Subject] to the logbook"
git push origin main
```

---

## 06/07/2026 - Mentorship History Consolidation (Origin: WebApp)

### 1. Scenario and Technical Challenge
The journey began with the goal of making a career transition from **QA Automation Engineer** to **SDET (Software Development Engineer in Test)**, focusing on upgrading isolated functional tests to a production-grade robust architecture. Initially, we worked with a linear, procedural UI test script (`tests/ecommerce.spec.ts`) targeting the SauceDemo e-commerce website.

During the evolution of the project, we faced the following engineering challenges:
- **OOP & Encapsulation Paradigm:** Moving away from sequential scripts to structure reusable classes with private and strongly typed element selectors (`Locator`).
- **Ambiguity and Hardcoded Data:** Dealing with duplicate selectors in the shopping cart and the risk of silent failures due to hardcoded product strings in the UI.
- **TypeScript Compilation Errors:** Fixing recurring scope errors and missing imports (such as the `expect` object).
- **Setup and Execution Speed (Login Bypass):** Avoiding having to run the login flow in every individual UI test, which significantly increased test execution time.
- **Hybrid Environment Isolation (API & UI):** Preventing API tests from leaking context or failing due to a lack of an appropriate `baseURL`, or rejection due to the absence of authentication headers required by the ReqRes WAF.
- **Module Conflict (CommonJS vs ESM):** Resolving compilation issues when integrating the modern `@faker-js/faker` package (ESM) into a project configured with CommonJS.

### 2. Structured Solution & Recommended Patterns
To solve these technical challenges and build the foundation of a professional framework, we implemented the following architectural solutions:

- **Dynamic Page Object Model (POM):** Centralizing locators in the constructor of classes like `LoginPage` and `ProductsPage`. We used regular expressions (kebab-case `Regex`) to dynamically map human-readable product names to HTML `data-test` identifiers, resolving element collisions:
  ```ts
  const formattedName = productName.toLowerCase().replace(/\s+/g, "-");
  const productButton = this.page.getByTestId(`add-to-cart-${formattedName}`);
  await productButton.click();
  ```
- **Locator Centralization & Chaining:** Chaining locators from filtered scopes in POM to reuse class properties and mitigate failures due to layout changes:
  ```ts
  const scopedItemContainer = this.cartItemContainer.filter({ hasText: productName });
  const itemNameLocator = scopedItemContainer.locator(this.productItemName);
  await itemNameLocator.waitFor({ state: "visible" });
  ```
- **Dependency Injection with Custom Fixtures:** We extended Playwright's native test engine (`base.extend`) in `src/fixtures/baseTest.ts` to automatically initialize the login and products pages, eliminating instantiation boilerplate in every test file:
  ```ts
  export const test = base.extend<MyFixtures>({
    loginPage: async ({ page }, use) => {
      await use(new LoginPage(page));
    },
    productsPage: async ({ page }, use) => {
      await use(new ProductsPage(page));
    },
  });
  ```
- **Session-State Bypass (Global Authentication):** Configuring a global setup (`tests/global.setup.ts`) to authenticate the user and save the session state to `.auth/user.json`. UI projects reuse this state dynamically, optimizing the overall execution time.
- **Strict Project Isolation (`playwright.config.ts`):** A clear division in the Playwright configuration file, surgically binding the `testDir` to `./tests/api` and `./tests/ui` subfolders to prevent worker overlap.
- **HTTP Client Refactoring (`UserClient.ts`):** Centralizing routes with relative paths in the HTTP client class and correctly handling headers (`Content-Type`, `x-api-key`) for API integration tests.
- **Dynamic Data Factory (`UserFactory.ts`):** Implementing factories with dynamic asynchronous imports (`await import('@faker-js/faker')`) to bypass module compatibility issues and ensure a unique dataset for each run.
- **Network Mocking & Resilience:** UI tests intercepting requests with mocks to validate resilient frontend behavior in the face of critical failures (HTTP 500), dynamic static asset replacement, and network latency simulation (Slow 3G).

### 3. Next Study Steps
- **CI/CD Pipeline in GitHub Actions:** Develop and implement the `.github/workflows/pipeline.yml` file for parallel headless execution on GitHub's Linux runners.
- **Secure Secrets Management:** Configure repository secrets (`API_URL`, `UI_URL`, `REQRES_API_KEY`) to run tests securely in the cloud.
- **Expanding Data Factories:** Create new dynamic object factories and apply the pattern more broadly across the framework.
- **Reporting & Debugging Best Practices:** Configure robust HTML reports in CI for fast troubleshooting of failures.

---

## 08/07/2026 - Advanced CI/CD Pipeline Optimization (Parallel Jobs & Blob Merge)

### 1. Scenario and Technical Challenge
The initial GitHub Actions pipeline (`pipeline.yml`) ran all tests sequentially, installing browser binaries for all execution contexts. This caused a time bottleneck in API test executions (which do not require browsers) and created fragmented HTML reports that were difficult to audit when running in parallel jobs. Additionally, a version mismatch was identified in the Dockerfile base image (`1.49.0` vs. `1.61.0` of the framework) and bugs referencing non-existent projects in the `npm run test:ui:crossbrowser` script of `package.json`.

### 2. Structured Solution & Recommended Patterns
We developed a high-efficiency restructuring in the CI/CD pipeline:
- **Container Synchronization:** Updated the [Dockerfile](file:///Users/raphaelcarvalho/Projects/SDET/sdet-roadmap-playwright/Dockerfile) to sync with the official `playwright:v1.61.0-noble` image.
- **Mapping Correction:** Adjusted the `test:ui:crossbrowser` script in [package.json](file:///Users/raphaelcarvalho/Projects/SDET/sdet-roadmap-playwright/package.json) to mirror the exact definitions of `playwright.config.ts`.
- **Parallel Execution Jobs (Split API & UI):** We created distinct asynchronous jobs in [.github/workflows/pipeline.yml](file:///Users/raphaelcarvalho/Projects/SDET/sdet-roadmap-playwright/.github/workflows/pipeline.yml):
  - API test job without the overhead of browser installation.
  - UI test job installing dependencies required only for its scope.
- **Report Consolidation via Blob Merge:** Both test jobs generate lightweight binary blob reports (`--reporter=blob`), which are combined in a final job executing `npx playwright merge-reports`.
- **Automated Deploy to GitHub Pages:** The final job automatically publishes the consolidated HTML report to GitHub Pages (`gh-pages` branch), providing a direct web link.

### 3. Next Study Steps
- **Advanced Data Generation Phase (Option B):** Begin the study of complex data generation patterns (Object Mother, seeding via API requests to prepare UI scenarios).
- **CI Flakiness Handling:** Study retry strategies and detection of flaky tests in the pipeline.
