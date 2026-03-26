/**
 * @jest-environment node
 */
import { expect } from "@jest/globals";
import allowedOriginsCheck from "@/utils/allowed_origins_check";

// ─── Helper ────────────────────────────────────────────────────────────────
function makeReq(opts: { referer?: string; userAgent?: string } = {}) {
  const headers: Record<string, string> = {};
  if (opts.referer) headers["referer"] = opts.referer;
  if (opts.userAgent) headers["user-agent"] = opts.userAgent;
  // Cast to any: tests only need req.headers.get() which Request provides
  return new Request("http://localhost:8000/api/hub", {
    method: "POST",
    headers,
  }) as unknown as import("next/server").NextRequest;
}

// ─── Tests ─────────────────────────────────────────────────────────────────
describe("allowedOriginsCheck", () => {
  const originalUrl = process.env.NEXTAUTH_URL;

  beforeEach(() => {
    process.env.NEXTAUTH_URL = "http://localhost:8000";
  });

  afterEach(() => {
    process.env.NEXTAUTH_URL = originalUrl;
  });

  // ─── Happy paths ──────────────────────────────────────────────────────

  it("allows an internal request with no referer header", async () => {
    const res = allowedOriginsCheck(makeReq());
    const body = await res.json();
    expect(body.status).toBe(200);
  });

  it("allows a server-to-server request with a node-fetch user-agent", async () => {
    // isInternalCall is true when user-agent includes 'node-fetch'
    const res = allowedOriginsCheck(
      makeReq({ referer: "https://any.example.com", userAgent: "node-fetch/3.0" }),
    );
    const body = await res.json();
    expect(body.status).toBe(200);
  });

  it("allows a request whose referer is the NEXTAUTH_URL hub endpoint", async () => {
    const res = allowedOriginsCheck(
      makeReq({ referer: "http://localhost:8000/api/hub" }),
    );
    const body = await res.json();
    expect(body.status).toBe(200);
  });

  // ─── Non-happy paths ──────────────────────────────────────────────────

  it("blocks a request from a completely unrelated origin", async () => {
    const res = allowedOriginsCheck(
      makeReq({ referer: "https://evil.com/steal" }),
    );
    const body = await res.json();
    expect(body.status).toBe(403);
  });

  it("blocks a request whose referer is the base NEXTAUTH_URL without /api/hub", async () => {
    const res = allowedOriginsCheck(
      makeReq({ referer: "http://localhost:8000/" }),
    );
    const body = await res.json();
    expect(body.status).toBe(403);
  });

  it("blocks a request from a different host that shares the /api/hub path", async () => {
    const res = allowedOriginsCheck(
      makeReq({ referer: "https://evil.com/api/hub" }),
    );
    const body = await res.json();
    expect(body.status).toBe(403);
  });
});
