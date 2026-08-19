export type Severity = "critical" | "serious" | "moderate" | "minor";

export interface TargetOption {
  key: string;
  label: string;
  description: string;
}

export interface Finding {
  finding_id: string;
  family: "accessibility" | "quality";
  severity: Severity;
  title: string;
  detail: string;
  target: string;
  tags: string[];
  remediation: string;
  reference_url: string | null;
}

export interface AuditReport {
  audit_id: string;
  target: string;
  target_label: string;
  executed_at: string;
  response_status: number;
  summary: {
    total_findings: number;
    critical: number;
    serious: number;
    moderate: number;
    minor: number;
    accessibility_score: number;
    quality_score: number;
    overall_score: number;
  };
  findings: Finding[];
  browser_signals: {
    title: string;
    language: string;
    headingLevels: number[];
    h1Count: number;
    hasMainLandmark: boolean;
    focusableCount: number;
  };
  limitations: string[];
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, init);
  if (!response.ok) {
    throw new Error("The local audit service could not complete this request.");
  }
  return response.json() as Promise<T>;
}

export const getTargets = () => request<TargetOption[]>("/api/targets");

export const runAudit = (target: string) =>
  request<AuditReport>("/api/audits", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ target })
  });
