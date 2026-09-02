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
  return new Request("http://localhost:8000/api/auth/users/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

// ─── Tests ───────────────────────────────────────────────────────────────────
describe("POST /api/auth/users", () => {
  const originalEndpoint = process.env.USERS_API_ENDPOINT;
  const originalKey = process.env.PROXY_KEY;

  beforeEach(() => {
    mockAllowedOriginsCheck.mockReturnValue(null);
    process.env.USERS_API_ENDPOINT = "http://django/auth/users/";
    process.env.PROXY_KEY = "test-internal-key";
  });

  afterEach(() => {
    jest.restoreAllMocks();
    process.env.USERS_API_ENDPOINT = originalEndpoint;
    process.env.PROXY_KEY = originalKey;
  });

  // ─── Happy paths ─────────────────────────────────────────────────────────

  it("returns success message when backend responds with 200", async () => {
    jest
      .spyOn(global, "fetch")
      .mockResolvedValueOnce(new Response("{}", { status: 200 }));

    const res = await POST(
      makeRequest({
        email: "user@example.com",
        name: "User",
        provider: "credentials",
      }) as any,
    );
    const json = await res.json();

    expect(json.status).toBe(200);
    expect(json.message).toBe("User processed successfully");
  });

  it("returns success message when backend responds with 201 (new user created)", async () => {
    jest
      .spyOn(global, "fetch")
      .mockResolvedValueOnce(new Response("{}", { status: 201 }));

    const res = await POST(
      makeRequest({
        email: "new@example.com",
        name: "New User",
        provider: "google",
      }) as any,
    );
    const json = await res.json();

    expect(json.status).toBe(200);
  });

  it("sends the X-Internal-Proxy-Key header to the backend", async () => {
    const mockFetch = jest
      .spyOn(global, "fetch")
      .mockResolvedValueOnce(new Response("{}", { status: 200 }));

    await POST(
      makeRequest({
        email: "user@example.com",
        name: "User",
        provider: "credentials",
      }) as any,
    );

    expect(mockFetch).toHaveBeenCalledWith(
      "http://django/auth/users/",
      expect.objectContaining({
        headers: expect.objectContaining({
          "X-Internal-Proxy-Key": "test-internal-key",
        }),
      }),
    );
  });

  it("forwards email, name, and provider (not password) to the backend", async () => {
    const mockFetch = jest
      .spyOn(global, "fetch")
      .mockResolvedValueOnce(new Response("{}", { status: 200 }));

    await POST(
      makeRequest({
        email: "user@example.com",
        name: "User",
        provider: "google",
      }) as any,
    );

    const callBody = JSON.parse(
      (mockFetch.mock.calls[0][1] as RequestInit).body as string,
    );
    expect(callBody.email).toBe("user@example.com");
    expect(callBody.name).toBe("User");
    expect(callBody.provider).toBe("google");
    expect(callBody.password).toBeUndefined();
  });

  // ─── Non-happy paths ──────────────────────────────────────────────────────

  it("returns 403 JSON when allowedOriginsCheck blocks the request", async () => {
    mockAllowedOriginsCheck.mockReturnValueOnce({ status: 403 });

    const res = await POST(
      makeRequest({
        email: "x@x.com",
        name: "X",
        provider: "credentials",
      }) as any,
    );
    const json = await res.json();

    expect(json.status).toBe(403);
  });

  it("returns 500 when USERS_API_ENDPOINT env var is not configured", async () => {
    delete process.env.USERS_API_ENDPOINT;

    const res = await POST(
      makeRequest({
        email: "x@x.com",
        name: "X",
        provider: "credentials",
      }) as any,
    );
    const json = await res.json();

    expect(json.error).toBe("USERS_API_ENDPOINT is not configured");
  });

  it("returns 500 when PROXY_KEY env var is not configured", async () => {
    delete process.env.PROXY_KEY;

    const res = await POST(
      makeRequest({
        email: "x@x.com",
        name: "X",
        provider: "credentials",
      }) as any,
    );
    const json = await res.json();

    expect(json.error).toBe("PROXY_KEY is not configured");
  });

  it("returns 500 when the backend responds with a non-200/201 status", async () => {
    jest
      .spyOn(global, "fetch")
      .mockResolvedValueOnce(new Response("{}", { status: 400 }));

    const res = await POST(
      makeRequest({
        email: "x@x.com",
        name: "X",
        provider: "credentials",
      }) as any,
    );
    const json = await res.json();

    expect(json.error).toContain("Error user not found");
  });

  it("returns an explicit 500 when the backend request fails", async () => {
    jest
      .spyOn(global, "fetch")
      .mockRejectedValueOnce(new Error("backend unavailable"));

    const res = await POST(
      makeRequest({
        email: "x@x.com",
        name: "X",
        provider: "credentials",
      }) as any,
    );

    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ error: "Unable to process user" });
  });
});
