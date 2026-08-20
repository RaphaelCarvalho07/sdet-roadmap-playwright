# 📘 Study Guide: Visual Regression Testing & Architecture

This guide covers advanced strategies for screenshot layout comparisons and mitigating flakiness in visual automation.

---

## 1. Visual Testing Paradigms

Visual Regression Testing compares the screenshot of a rendered page against a gold master reference image (**baseline**) to detect layout shifts, color mismatches, or overlapping text.

### The Tradeoff:
- **Macro-Layout (Page-Level):** Captures the full viewport. Good for detecting side-effects (e.g. an element at the top pushing the footer off-screen), but highly susceptible to flakiness from dynamic data.
- **Micro-Component (Element-Level):** Captures only a specific DOM node (e.g. a single card or button). Extremely stable, easier to assert, and isolated from surrounding layout changes.

---

## 2. Mitigating Layout Shift & Dynamic Data

When tests use dynamic data generators (Faker), varying string lengths (e.g. a long name vs. a short name) will stretch or shrink cards, causing pixel mismatches.

### Stabilization Strategies:
1.  **CSS Styling Injection:** Temporarily apply fixed dimensions (`height`, `width`, `overflow: hidden`) to dynamic containers using `page.addStyleTag` before taking page-level screenshots.
2.  **Element Masking:** Use Playwright's `mask` option to hide dynamic text under solid color blocks during image generation:
    ```typescript
    await expect(page).toHaveScreenshot('page-layout.png', {
      mask: [page.locator('.dynamic-user-address')],
    });
    ```
3.  **Hiding Transient Overlays:** Inject global CSS to display none (`display: none !important`) on floating dynamic elements (such as notification snackbars, loading spinners, or cookie consent banners) that pop up at irregular intervals.

---

## 3. Cross-Platform Engine Parity (CPU Architecture)

Chromium renders text anti-aliasing and subpixels differently depending on the operating system and CPU architecture.
*   **The Problem:** Reference baselines generated on a local Apple Silicon Mac (ARM64) will fail when run on a GitHub Actions runner (AMD64 Linux).
*   **The Solution:** Run tests inside a matching Docker container locally and emulate the target CI platform to update baseline screenshots correctly:
    ```bash
    docker run --rm --platform linux/amd64 -v $(pwd):/work -w /work mcr.microsoft.com/playwright:v1.61.0-noble npx playwright test --update-snapshots
    ```
