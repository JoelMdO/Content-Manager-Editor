/**
 * @jest-environment node
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
  return new Request("http://localhost:8000/api/auth/login/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

// ─── Tests ───────────────────────────────────────────────────────────────────
describe("POST /api/auth/login", () => {
  const originalEndpoint = process.env.LOGIN_API_ENDPOINT;

  beforeEach(() => {
    mockAllowedOriginsCheck.mockReturnValue(null);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    process.env.LOGIN_API_ENDPOINT = originalEndpoint;
  });

  // ─── Happy paths ─────────────────────────────────────────────────────────

  it("forwards email and password to LOGIN_API_ENDPOINT and returns the backend JSON", async () => {
    process.env.LOGIN_API_ENDPOINT = "http://django/auth/login/";
    jest
      .spyOn(global, "fetch")
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({ id: "1", email: "user@example.com", name: "User" }),
          { status: 200 },
        ),
      );

    const res = await POST(
      makeRequest({ email: "user@example.com", password: "secret" }) as any,
    );
    const json = await res.json();

    expect(json.email).toBe("user@example.com");
    expect(json.id).toBe("1");
  });

  it("sends email and password in the fetch body to LOGIN_API_ENDPOINT", async () => {
    process.env.LOGIN_API_ENDPOINT = "http://django/auth/login/";
    const mockFetch = jest
      .spyOn(global, "fetch")
      .mockResolvedValueOnce(new Response(JSON.stringify({}), { status: 200 }));

    await POST(
      makeRequest({ email: "user@example.com", password: "secret" }) as any,
    );

    expect(mockFetch).toHaveBeenCalledWith(
      "http://django/auth/login/",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ email: "user@example.com", password: "secret" }),
      }),
    );
  });

  // ─── Non-happy paths ──────────────────────────────────────────────────────

  it("returns 403 JSON when allowedOriginsCheck blocks the request", async () => {
    mockAllowedOriginsCheck.mockReturnValueOnce({ status: 403 });

    const res = await POST(
      makeRequest({ email: "x@x.com", password: "p" }) as any,
    );
    const json = await res.json();

    expect(json.status).toBe(403);
  });

  it("returns 500 when LOGIN_API_ENDPOINT env var is not configured", async () => {
    delete process.env.LOGIN_API_ENDPOINT;

    const res = await POST(
      makeRequest({ email: "x@x.com", password: "p" }) as any,
    );

    expect(res.status).toBe(500);
  });
});
