# A11yPulse

**A11yPulse** is an automated web accessibility and release-quality testing platform built for demonstrable, safe local audits. It combines Playwright, axe-core, FastAPI, React, and CI to turn browser evidence into a focused remediation queue.

The project deliberately audits **only two bundled synthetic fixture pages**. It does not crawl arbitrary URLs, perform authenticated testing, store credentials, modify applications, or claim legal compliance or WCAG conformance. This makes the project reviewable without a paid service or production data.

## What it demonstrates

| Capability | Implementation |
|---|---|
| Browser automation | Playwright runs a real headless Chromium session against approved local fixtures. |
| Accessibility signals | axe-core findings are retained with target selectors, severity, standards tags, rule links, and remediation context. |
| Quality signals | The backend adds deterministic document-title, language, primary-heading, main-landmark, and response-status checks. |
| Analyst workflow | A responsive React dashboard compares a needs-attention state with a reviewed baseline and exposes evidence-backed release scores. |
| Engineering discipline | Focused Python and Vitest tests, Docker Compose, a Makefile, documentation, and a three-job GitHub Actions quality gate. |

## Local demo

```bash
make bootstrap
make target   # terminal 1
make api      # terminal 2
make web      # terminal 3
```

Open `http://127.0.0.1:5202`, select **Needs attention** or **Reviewed baseline**, and run the approved audit. The first page is deliberately flawed and should show actionable browser evidence. The baseline should return a clean automatically detectable state.

Alternatively, start all services with `docker compose up --build` when Docker is available.

## Verification

```bash
make check
```

The automated browser audit needs a Playwright-compatible Chromium binary. The local setup can use a system Chromium via `PLAYWRIGHT_EXECUTABLE_PATH`; CI installs Chromium explicitly.

## Boundaries and limitations

> A11yPulse is a testing aid—not a certification, conformance, legal, or accessibility-compliance decision. Automation cannot replace manual keyboard, screen-reader, zoom/reflow, visual, and inclusive-user testing.

The policy catalogue is informed by WCAG 2.2 and browser automation guidance, but the application makes no claim to comprehensively test every success criterion. See [SAFE_USE.md](docs/SAFE_USE.md), [POLICY_CATALOG.md](docs/POLICY_CATALOG.md), and [OPERATIONS.md](docs/OPERATIONS.md) for the implementation boundaries.

## References

[1] [W3C, *Web Content Accessibility Guidelines (WCAG) 2.2*](https://www.w3.org/TR/WCAG22/)

[2] [Playwright, *Accessibility testing*](https://playwright.dev/docs/accessibility-testing)

[3] [Deque axe-core, *API documentation*](https://github.com/dequelabs/axe-core/blob/develop/doc/API.md)
