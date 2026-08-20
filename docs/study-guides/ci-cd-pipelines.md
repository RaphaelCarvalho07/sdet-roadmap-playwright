# 📘 Study Guide: CI/CD Pipeline Architecture & Blob Reporting

This guide covers modern CI/CD patterns for parallel test orchestration and unified report publishing.

---

## 1. Split-Job Parallelism vs. Monolithic Runs

In high-concurrency environments, running all tests sequentially in a single runner job creates time bottlenecks and wastes compute resources.

```
       Monolithic:   [Install Node] ──► [Install Browsers] ──► [Run API + UI Tests]
       
       Parallel Split:
                      ┌──► [Lint Job] (Fast checks)
       [Set Up Environment]
                      ├──► [API Test Job] (No browser install required)
                      └──► [UI Test Job]  (Installs only targeted browsers)
```

### Strategic Separation:
- **Lint/Static Code Check:** Fast verification, runs in seconds, acts as an early gate.
- **API Tests:** Fast execution (milliseconds per request), does not require heavy browser engine binaries.
- **UI Tests:** Slower execution (requires browser spawning), parallelized using multiple Playwright worker threads.

---

## 2. Report Consolidation: The Blob Reporter Pattern

When tests run in separate parallel jobs or on different machines, each job creates its own local HTML report. Generating multiple reports makes auditing failures difficult.

### The Solution:
1.  Configure the individual jobs to write binary intermediate files using the **Blob Reporter** (`--reporter=blob`).
2.  Upload these blobs as CI pipeline artifacts.
3.  Configure a final consolidation job (`publish-report`) to download all blobs and execute `playwright merge-reports` to combine them into a single, unified HTML report.

```
  Job 1 (API) ──► api.zip ───┐
                             ├──► [Download Blobs] ──► [Merge Reports] ──► Unified HTML
  Job 2 (UI)  ──► ui.zip  ───┘
```

---

## 3. Resolving Cross-Environment Path Discrepancies

Because jobs run in different environments (host VM vs. inside a Docker container), the file paths recorded in the blobs will differ (e.g. `/home/runner/work/...` vs `/__w/...`).
*   **The Fix:** Pass the configuration file (`-c playwright.config.ts`) during `merge-reports`. This tells the merge command to relativize all file paths relative to the root `testDir` in the configuration.
