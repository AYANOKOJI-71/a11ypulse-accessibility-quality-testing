# A11yPulse Operations Guide

## Purpose and scope

A11yPulse is a local-first testing aid for the two deliberately bundled fixture pages. The service accepts the fixed keys `demo-needs-work` and `demo-reviewed-baseline`; it does not accept arbitrary URLs, authenticated pages, customer environments, or production systems. Its output is evidence for a review conversation rather than an accessibility certification, conformance decision, or legal conclusion.

## Local development

Create the isolated Python environment and install the two Node workspaces with `make bootstrap`. Start the three local services in separate terminals: `make target`, `make api`, and `make web`. The dashboard runs on port 5202, the API on 4920, and the approved target on 5300. A direct fixture audit is available through `make audit` once the target service is running.

| Service | Role | Local port |
|---|---|---:|
| `target` | Serves the two approved synthetic audit pages | 5300 |
| `api` | Runs the bounded Python report pipeline and Node browser runner | 4920 |
| `web` | Presents the analyst-facing quality dashboard | 5202 |

The dashboard proxies local API requests; it does not expose browser-audit controls for arbitrary hosts. Set `PLAYWRIGHT_EXECUTABLE_PATH` only when the system Chromium path needs to be specified explicitly.

## Container workflow

Use `docker compose up --build` for the three-service local workflow. The API image includes Chromium, Python, Node, Playwright dependencies, and the audit runner. The API is configured to access `http://target:5300`, while the Vite dashboard proxies to `http://api:4920` inside the Compose network. No data volume, secret, cloud credential, or external target is required.

## Quality gates

Run `make check` before a change is committed. GitHub Actions executes three independent jobs: Python lint/tests, an actual Playwright audit of both fixtures, and dashboard contract tests plus a production build. The browser job intentionally asserts that the needs-work fixture produces findings and that the reviewed baseline does not.

## Responsible use

> Automated checks find only a subset of accessibility and quality problems. Always add manual keyboard testing, screen-reader checks, zoom and reflow review, visual design review, and testing with disabled people before treating a release as accessible.

Only extend the target catalogue after written authorization for a controlled environment and after reviewing data-handling, scope, rate limits, authentication, and responsible disclosure requirements.
