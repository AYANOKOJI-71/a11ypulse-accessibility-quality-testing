import { readFile } from "node:fs/promises";

const [needsWorkPath, baselinePath] = process.argv.slice(2);

if (!needsWorkPath || !baselinePath) {
  throw new Error("Usage: node scripts/assert_audit_results.mjs <needs-work.json> <baseline.json>");
}

const [needsWork, baseline] = await Promise.all(
  [needsWorkPath, baselinePath].map(async (path) => JSON.parse(await readFile(path, "utf8")))
);

if (needsWork.axe_violations.length === 0) {
  throw new Error("The needs-work fixture unexpectedly returned no axe-core violations.");
}

if (baseline.axe_violations.length !== 0) {
  throw new Error("The reviewed-baseline fixture unexpectedly returned axe-core violations.");
}

console.log(`browser-audits: needs-work=${needsWork.axe_violations.length}, baseline=${baseline.axe_violations.length}`);
