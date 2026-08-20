# Implementation Plan - Non-Functional Performance Testing & K6 Integration

We will introduce **Non-Functional Performance Testing** to our repository. This includes establishing the theoretical pillars (Latency, Throughput, Percentiles, Saturation) and implementing two distinct testing scenarios using **Grafana K6** targeting our local OWASP Juice Shop REST API container.

---

## Technical Foundations (Study Guide)

To prevent simply repeating framework calls, we will create a dedicated guide detailing the concepts of performance engineering:

- **Throughput (RPS) vs. Latency:** High throughput can coexist with degraded latency; understanding how they relate.
- **The Percentile Trap:** Why average response times (mean) hide performance issues for tail users, and why `p95` or `p99` are the standard for Service Level Objectives (SLOs).
- **Test Types:** Differences between Load (SLA verification), Stress (breaking point identification), Spike (sudden burst absorption), and Soak (memory/connection leaks).
- **Ramping VUs (Virtual Users):** Simulating realistic user ramp-up and ramp-down behaviors.

---

## Proposed Changes

We will introduce a new folder structure `./tests/performance/` and a comprehensive study resource.

### 1. Conceptual Framework & Reference Documentation

#### [NEW] [performance-study-guide.md](https://github.com/RaphaelCarvalho07/sdet-roadmap-playwright/blob/main/docs/study-guides/performance-engineering.md)

A senior-level study guide covering the paradigms, metrics, math, and testing methodologies of Performance Engineering.

---

### 2. Performance Automation Scripts (K6)

We will write two K6 testing scripts using JavaScript (standard ES6 format supported natively by K6).

#### [NEW] [search-load-test.js](https://github.com/RaphaelCarvalho07/sdet-roadmap-playwright/blob/main/tests/performance/search-load-test.js)

A **Load Test** simulating expected normal production traffic for product search:

- **Scenario:** Users hit the search endpoint `/rest/products/search?q=apple`.
- **Orchestration:** 3 stages (Ramp-up to 20 VUs in 10s, Hold/Plateau at 20 VUs for 20s, Ramp-down to 0 VUs in 5s).
- **Throttling:** Implements realistic pacing using `sleep(1)` to prevent immediate client-side resource exhaustion.
- **Thresholds (Performance Budgets):**
  - Over 95% of requests must complete in less than 200ms (`http_req_duration: ['p(95) < 200']`).
  - Error rate must be less than 1% (`http_req_failed: ['rate < 0.01']`).

#### [NEW] [login-stress-test.js](https://github.com/RaphaelCarvalho07/sdet-roadmap-playwright/blob/main/tests/performance/login-stress-test.js)

A **Stress Test** designed to find the database/JWT signing bottleneck by hammering the `/rest/user/login` endpoint:

- **Scenario:** Users attempt login with a generated static payload to observe token generation cost.
- **Orchestration:** Aggressive ramp-up to 100 VUs in 15s, holding at 100 VUs for 15s, then ramping down.
- **Thresholds:** Analyzes saturation (error rates spiking above 5% or latency degradation beyond 1500ms).

---

### 3. Framework Configuration & Packages

#### [MODIFY] [package.json](https://github.com/RaphaelCarvalho07/sdet-roadmap-playwright/blob/main/package.json)

Adds npm scripts to run performance tests easily:

- `"test:perf:load": "k6 run tests/performance/search-load-test.js"`
- `"test:perf:stress": "k6 run tests/performance/login-stress-test.js"`

---

## Verification Plan

### Prerequisites

- Install K6 on macOS using Homebrew:
  `brew install k6`

### Automated Run Commands

- Ensure local Juice Shop is running: `npm run docker:start`
- Execute the search load test:
  `npm run test:perf:load`
- Execute the login stress test:
  `npm run test:perf:stress`
