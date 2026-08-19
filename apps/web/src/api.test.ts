import { afterEach, describe, expect, it, vi } from "vitest";

import { getTargets, runAudit } from "./api";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("A11yPulse API client", () => {
  it("requests the approved target catalogue", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify([{ key: "demo-needs-work", label: "Needs work", description: "Fixture" }]), {
        status: 200
      })
    );
    vi.stubGlobal("fetch", fetchMock);

    await expect(getTargets()).resolves.toEqual([{ key: "demo-needs-work", label: "Needs work", description: "Fixture" }]);
    expect(fetchMock).toHaveBeenCalledWith("/api/targets", undefined);
  });

  it("submits only the selected local target key for a live audit", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ audit_id: "audit-local", target: "demo-reviewed-baseline" }), { status: 200 })
    );
    vi.stubGlobal("fetch", fetchMock);

    await runAudit("demo-reviewed-baseline");

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/audits",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ target: "demo-reviewed-baseline" })
      })
    );
  });
});
