/**
 * @jest-environment node
 *
 * NOTE: This file does NOT mock @/services/authentication/admin_config.
 * If reset/route.ts still contains `import { auth } from
 * "@/services/authentication/admin_config"`, every test here will fail
 * with a Firebase initialisation error — that IS the expected RED state.
 * GREEN = remove the dead import from reset/route.ts.
 */
import { expect } from "@jest/globals";

// ─── Module mocks (must be before imports) ──────────────────────────────────
const mockAllowedOriginsCheck = jest.fn();
jest.mock("@/utils/allowed_origins_check", () => ({
  __esModule: true,
  default: (...args: unknown[]) => mockAllowedOriginsCheck(...args),
}));

import { POST } from "../route";

// ─── Helper ──────────────────────────────────────────────────────────────────
function makeRequest(body: Record<string, unknown>): Request {
  return new Request("http://localhost:8000/api/auth/reset/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

// ─── Tests ───────────────────────────────────────────────────────────────────
describe("POST /api/auth/reset", () => {
  const originalEndpoint = process.env.PASSWORD_RESET_API_ENDPOINT;

  beforeEach(() => {
    mockAllowedOriginsCheck.mockReturnValue(null);
    process.env.PASSWORD_RESET_API_ENDPOINT =
      "http://django/auth/password-reset/";
  });

  afterEach(() => {
    jest.restoreAllMocks();
    process.env.PASSWORD_RESET_API_ENDPOINT = originalEndpoint;
  });

  // ─── Happy paths ─────────────────────────────────────────────────────────

  it("returns 200 with a generic message when backend call succeeds", async () => {
    jest
      .spyOn(global, "fetch")
      .mockResolvedValueOnce(new Response("{}", { status: 200 }));

    const res = await POST(makeRequest({ email: "user@example.com" }) as any);
    const json = await res.json();

    expect(json.status).toBe(200);
    expect(json.message).toMatch(/password reset link/i);
  });

  it("forwards the email to PASSWORD_RESET_API_ENDPOINT", async () => {
    const mockFetch = jest
      .spyOn(global, "fetch")
      .mockResolvedValueOnce(new Response("{}", { status: 200 }));

    await POST(makeRequest({ email: "user@example.com" }) as any);

    expect(mockFetch).toHaveBeenCalledWith(
      "http://django/auth/password-reset/",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ email: "user@example.com" }),
      }),
    );
  });

  // ─── Email enumeration protection ─────────────────────────────────────────
  // The route must always return the same 200 response regardless of whether
  // the email exists or the backend call fails — this prevents user enumeration.

  it("still returns 200 with the same generic message when the backend returns 404", async () => {
    jest
      .spyOn(global, "fetch")
      .mockResolvedValueOnce(new Response("{}", { status: 404 }));

    const res = await POST(
      makeRequest({ email: "unknown@example.com" }) as any,
    );
    const json = await res.json();

    expect(json.status).toBe(200);
    expect(json.message).toMatch(/password reset link/i);
  });

  it("still returns 200 when the backend call throws a network error", async () => {
    jest
      .spyOn(global, "fetch")
      .mockRejectedValueOnce(new Error("Network error"));

    const res = await POST(makeRequest({ email: "user@example.com" }) as any);
    const json = await res.json();

    expect(json.status).toBe(200);
  });

  // ─── Non-happy paths ──────────────────────────────────────────────────────

  it("returns 403 JSON when allowedOriginsCheck blocks the request", async () => {
    mockAllowedOriginsCheck.mockReturnValueOnce({ status: 403 });

    const res = await POST(makeRequest({ email: "x@x.com" }) as any);
    const json = await res.json();

    expect(json.status).toBe(403);
  });

  it("returns 400 when email is missing from the request body", async () => {
    const res = await POST(makeRequest({}) as any);
    const json = await res.json();

    expect(json.status).toBe(400);
  });

  it("returns 500 when PASSWORD_RESET_API_ENDPOINT env var is not configured", async () => {
    delete process.env.PASSWORD_RESET_API_ENDPOINT;

    const res = await POST(makeRequest({ email: "user@example.com" }) as any);
    const json = await res.json();

    expect(json.status).toBe(500);
  });
});
