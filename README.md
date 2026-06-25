# 🚀 SDET Journey - Roadmap & Mentorship

This repository contains practical implementations, architectural designs, and milestones for transitioning from QA Automation Engineer to Software Development Engineer in Test (SDET), leveraging the TypeScript and Playwright ecosystem.

## 🏁 Milestone 1: Local Foundations, Typing & Security
- [x] Validate API contracts using TypeScript static typing (`type` vs `interface`)
- [x] Refactor nested objects into dynamic arrays to avoid rigid tuple definitions
- [x] Isolate environment variables, configurations, and API credentials using `.env`

## 🏗️ Milestone 2: Scalable Test Architecture & Design Patterns
- [x] Abstract HTTP requests from test logic by creating a Service/Client layer
- [x] Implement robust Playwright lifecycle hooks (`beforeAll`, `beforeEach`)
- [x] Design dynamic and isolated test data management strategies

## 🔄 Milestone 3: DevOps Engineering (Shift-Left & CI/CD Integration)
- [x] Containerize the testing suite and target runtime environments using Docker
- [x] Build automated CI pipelines via GitHub Actions (integrating Linters and PR checks)

## 🌐 Milestone 4: Advanced Web Automation & State Management
- [x] Isolate and decouple execution domains (strict testDir separation for API and UI subdirectories)
- [x] Implement the Page Object Model (POM) architectural pattern using TypeScript inheritance
- [x] Configure global setup layers for session-state storage injection (Authentication Bypass)
- [x] Abstract object composition via dependency injection patterns utilizing custom Playwright fixtures