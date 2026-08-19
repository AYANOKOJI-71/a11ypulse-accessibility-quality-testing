import { existsSync } from "node:fs";

import AxeBuilder from "@axe-core/playwright";
import { chromium } from "playwright";

const approvedTargets = Object.freeze({
  "demo-needs-work": "/demo-needs-work",
  "demo-reviewed-baseline": "/demo-reviewed-baseline"
});

const targetKey = process.argv[2];
if (!Object.hasOwn(approvedTargets, targetKey)) {
  throw new Error("A11yPulse only accepts approved local target identifiers.");
}

const baseUrl = process.env.AUDIT_TARGET_BASE_URL ?? "http://127.0.0.1:5300";
const targetUrl = new URL(approvedTargets[targetKey], baseUrl).toString();
const executablePath = process.env.PLAYWRIGHT_EXECUTABLE_PATH || (existsSync("/usr/bin/chromium") ? "/usr/bin/chromium" : undefined);

const browser = await chromium.launch({
  headless: true,
  executablePath,
  args: ["--disable-dev-shm-usage"]
});

try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await context.newPage();
  const response = await page.goto(targetUrl, { waitUntil: "networkidle", timeout: 15_000 });
  const axeResults = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();

  const browserSignals = await page.evaluate(() => {
    const headingLevels = Array.from(document.querySelectorAll("h1, h2, h3, h4, h5, h6")).map((heading) =>
      Number.parseInt(heading.tagName.slice(1), 10)
    );
    return {
      title: document.title.trim(),
      language: document.documentElement.lang.trim(),
      headingLevels,
      h1Count: document.querySelectorAll("h1").length,
      hasMainLandmark: Boolean(document.querySelector("main, [role='main']")),
      focusableCount: document.querySelectorAll("a[href], button, input, select, textarea, [tabindex]").length
    };
  });

  process.stdout.write(
    JSON.stringify({
      target_key: targetKey,
      target_url: targetUrl,
      response_status: response?.status() ?? 0,
      axe_violations: axeResults.violations.map((violation) => ({
        id: violation.id,
        impact: violation.impact ?? "moderate",
        description: violation.description,
        help: violation.help,
        help_url: violation.helpUrl,
        tags: violation.tags,
        nodes: violation.nodes.map((node) => ({
          target: node.target.join(", "),
          html: node.html,
          failure_summary: node.failureSummary ?? "Review the rule guidance."
        }))
      })),
      browser_signals: browserSignals
    })
  );
} finally {
  await browser.close();
}
