import { useEffect, useMemo, useState } from "react";

import { getTargets, runAudit, type AuditReport, type Finding, type Severity, type TargetOption } from "./api";

const severityOrder: Severity[] = ["critical", "serious", "moderate", "minor"];

function scoreState(score: number) {
  if (score >= 90) return "reviewed";
  if (score >= 65) return "watch";
  return "attention";
}

function SeverityBadge({ severity }: { severity: Severity }) {
  return <span className={`severity severity-${severity}`}>{severity}</span>;
}

function FindingCard({ finding }: { finding: Finding }) {
  return (
    <article className="finding-card">
      <div className="finding-title-row">
        <div>
          <p className="eyebrow">{finding.family} · {finding.finding_id}</p>
          <h3>{finding.title}</h3>
        </div>
        <SeverityBadge severity={finding.severity} />
      </div>
      <p className="finding-detail">{finding.detail}</p>
      <div className="code-target">{finding.target}</div>
      <div className="remediation">
        <span>Recommended next step</span>
        <p>{finding.remediation}</p>
      </div>
      <div className="finding-footer">
        <div className="tag-row">
          {finding.tags.slice(0, 3).map((tag) => <span key={tag}>{tag}</span>)}
        </div>
        {finding.reference_url ? (
          <a href={finding.reference_url} target="_blank" rel="noreferrer">Rule reference ↗</a>
        ) : null}
      </div>
    </article>
  );
}

export default function App() {
  const [targets, setTargets] = useState<TargetOption[]>([]);
  const [activeTarget, setActiveTarget] = useState("demo-needs-work");
  const [report, setReport] = useState<AuditReport | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<Severity | "all">("all");

  const executeAudit = async (target = activeTarget) => {
    setIsAuditing(true);
    setError("");
    try {
      setActiveTarget(target);
      setReport(await runAudit(target));
      setFilter("all");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "The local audit did not complete.");
    } finally {
      setIsAuditing(false);
    }
  };

  useEffect(() => {
    getTargets().then(setTargets).catch(() => setError("The local target catalogue is unavailable."));
    void executeAudit("demo-needs-work");
  }, []);

  const filteredFindings = useMemo(() => {
    if (!report || filter === "all") return report?.findings ?? [];
    return report.findings.filter((finding) => finding.severity === filter);
  }, [filter, report]);

  const selected = targets.find((target) => target.key === activeTarget);
  const summary = report?.summary;

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="A11yPulse home">
          <span className="brand-mark"><i /><i /><i /></span>
          <span>A11y<span>Pulse</span></span>
        </a>
        <div className="topbar-meta">
          <span className="safe-indicator"><b /> Local-only audit mode</span>
          <span className="divider" />
          <span>v0.1 · evidence first</span>
        </div>
      </header>

      <section className="hero" id="top">
        <div>
          <p className="kicker">ACCESSIBILITY + RELEASE QUALITY</p>
          <h1>Ship a more <em>considerate</em> web.</h1>
          <p className="hero-copy">A focused quality gate for approved local targets. Inspect browser evidence, prioritise accessibility debt, and move from issue to remediation with clarity.</p>
        </div>
        <aside className="audit-control" aria-label="Audit controls">
          <div className="control-heading">
            <span className="pulse-dot" />
            <span>Current audit scope</span>
          </div>
          <strong>{selected?.label ?? "Loading approved targets"}</strong>
          <p>{selected?.description ?? "Only bundled, deterministic local targets are available."}</p>
          <div className="target-switcher">
            {targets.map((target) => (
              <button
                className={target.key === activeTarget ? "is-active" : ""}
                key={target.key}
                onClick={() => void executeAudit(target.key)}
                disabled={isAuditing}
              >
                {target.key === "demo-needs-work" ? "Needs attention" : "Reviewed baseline"}
              </button>
            ))}
          </div>
          <button className="audit-button" onClick={() => void executeAudit()} disabled={isAuditing}>
            <span>{isAuditing ? "Running browser audit…" : "Run approved audit"}</span><b>→</b>
          </button>
        </aside>
      </section>

      {error ? <div className="error-banner" role="alert">{error}</div> : null}

      {report && summary ? (
        <>
          <section className="score-grid" aria-label="Audit summary">
            <article className="primary-score">
              <div className="score-label">Release readiness</div>
              <div className="score-line"><strong>{summary.overall_score}</strong><span>/100</span></div>
              <div className={`score-state ${scoreState(summary.overall_score)}`}>{scoreState(summary.overall_score)}</div>
              <p>{summary.total_findings === 0 ? "No automatically detectable issues in this approved state." : `${summary.total_findings} evidence-backed items require review before release.`}</p>
            </article>
            <article className="metric-card">
              <span>Accessibility score</span>
              <strong>{summary.accessibility_score}<small>/100</small></strong>
              <div className="metric-bar"><i style={{ width: `${summary.accessibility_score}%` }} /></div>
              <p>Automated WCAG-informed signals</p>
            </article>
            <article className="metric-card">
              <span>Quality score</span>
              <strong>{summary.quality_score}<small>/100</small></strong>
              <div className="metric-bar warm"><i style={{ width: `${summary.quality_score}%` }} /></div>
              <p>Document and semantic structure signals</p>
            </article>
            <article className="run-card">
              <span>Last executed</span>
              <strong>{new Date(report.executed_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</strong>
              <p>HTTP {report.response_status} · browser evidence captured</p>
              <span className="run-id">{report.audit_id}</span>
            </article>
          </section>

          <section className="content-grid">
            <aside className="signals-panel">
              <div className="section-heading"><span>Signal ledger</span><p>Snapshot facts</p></div>
              <dl>
                <div><dt>Document title</dt><dd>{report.browser_signals.title || "Missing"}</dd></div>
                <div><dt>Language</dt><dd>{report.browser_signals.language || "Missing"}</dd></div>
                <div><dt>Primary headings</dt><dd>{report.browser_signals.h1Count}</dd></div>
                <div><dt>Main landmark</dt><dd>{report.browser_signals.hasMainLandmark ? "Present" : "Missing"}</dd></div>
                <div><dt>Focusable elements</dt><dd>{report.browser_signals.focusableCount}</dd></div>
              </dl>
              <div className="scope-note">
                <span>Bounded scope</span>
                <p>This workspace audits only approved bundled local targets. Manual inclusive testing remains essential.</p>
              </div>
            </aside>

            <section className="findings-panel">
              <div className="findings-header">
                <div>
                  <p className="kicker">EVIDENCE QUEUE</p>
                  <h2>{summary.total_findings === 0 ? "No issues detected in this state" : "Prioritised remediation queue"}</h2>
                </div>
                <div className="filter-tabs" aria-label="Filter findings by severity">
                  <button className={filter === "all" ? "selected" : ""} onClick={() => setFilter("all")}>All <span>{summary.total_findings}</span></button>
                  {severityOrder.filter((severity) => summary[severity] > 0).map((severity) => (
                    <button className={filter === severity ? "selected" : ""} key={severity} onClick={() => setFilter(severity)}>
                      {severity} <span>{summary[severity]}</span>
                    </button>
                  ))}
                </div>
              </div>
              {filteredFindings.length > 0 ? (
                <div className="finding-list">{filteredFindings.map((finding, index) => <FindingCard key={`${finding.finding_id}-${index}-${finding.target}`} finding={finding} />)}</div>
              ) : (
                <div className="clean-state"><div>✓</div><h3>Reviewed baseline is clear</h3><p>Automated checks did not detect issues for this approved local page state. Continue with manual keyboard, screen-reader, visual, and user testing.</p></div>
              )}
            </section>
          </section>
        </>
      ) : (
        <section className="loading-state"><span className="spinner" /> Preparing the approved local audit…</section>
      )}

      <footer>
        <span>A11yPulse is a testing aid—not a legal, certification, or conformance decision.</span>
        <span>Playwright + axe-core · FastAPI · React</span>
      </footer>
    </main>
  );
}
