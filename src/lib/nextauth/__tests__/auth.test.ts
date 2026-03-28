/**
 * @jest-environment node
 *
 * Tests for auth.ts (NextAuth + Django, no Firebase):
 *   - authorize()  calls callHub("sign-by-email", {email, password})
 *   - signIn()     calls fetch to /api/auth/users/ directly using user.email/name
 */
import { expect } from "@jest/globals";
import callHub from "@/services/api/call_hub";

import { authOptions } from "../auth";
import type { CredentialsConfig } from "next-auth/providers/credentials";

jest.mock("@/services/api/call_hub");
const mockCallHub = callHub as jest.MockedFunction<typeof callHub>;

// ─── Helpers to extract the functions under test ─────────────────────────────
const credentialsProvider = authOptions.providers.find(
  (p) => (p as any).id === "credentials",
) as CredentialsConfig;
// In next-auth 4.x CredentialsProvider compiles to { authorize: () => null, options: { authorize: fn } }
// The real authorize lives at .options.authorize
const authorize = (credentialsProvider as any).options.authorize as NonNullable<
  CredentialsConfig["authorize"]
>;
const signInCallback = authOptions.callbacks!.signIn!;

// ─── Tests ───────────────────────────────────────────────────────────────────
describe("authOptions.authorize (CredentialsProvider)", () => {
  beforeEach(() => {
    mockCallHub.mockReset();
  });

  it("returns null when email is missing from credentials", async () => {
    const result = await authorize({ password: "secret" } as any, {});
    expect(result).toBeNull();
  });

  it("returns null when password is missing from credentials", async () => {
    const result = await authorize({ email: "user@example.com" } as any, {});
    expect(result).toBeNull();
  });

  it("calls callHub with 'sign-by-email' and the given email and password", async () => {
    mockCallHub.mockResolvedValueOnce({
      status: 200,
      message: "ok",
      body: { id: "42", email: "user@example.com", name: "User" } as any,
    });

    await authorize(
      { email: "user@example.com", password: "secret" } as any,
      {},
    );

    expect(mockCallHub).toHaveBeenCalledWith("sign-by-email", {
      email: "user@example.com",
      password: "secret",
    });
  });

  it("returns a user object with id, email, and name when callHub responds with status 200", async () => {
    mockCallHub.mockResolvedValueOnce({
      status: 200,
      message: "ok",
      body: { id: "42", email: "user@example.com", name: "Test User" } as any,
    });

    const result = await authorize(
      { email: "user@example.com", password: "secret" } as any,
      {},
    );

    expect(result).toEqual({
      id: "42",
      email: "user@example.com",
      name: "Test User",
    });
  });

  it("returns null when callHub responds with a non-200 status", async () => {
    mockCallHub.mockResolvedValueOnce({
      status: 401,
      message: "Invalid credentials",
    });

    const result = await authorize(
      { email: "user@example.com", password: "wrongpassword" } as any,
      {},
    );

    expect(result).toBeNull();
  });
});

describe("authOptions.callbacks.signIn", () => {
  const originalUrl = process.env.NEXTAUTH_URL;

  beforeEach(() => {
    process.env.NEXTAUTH_URL = "http://localhost:8000";
  });

  afterEach(() => {
    jest.restoreAllMocks();
    process.env.NEXTAUTH_URL = originalUrl;
  });

  const user = {
    id: "1",
    email: "user@example.com",
    name: "Test User",
    emailVerified: null,
  };

  it("calls /api/auth/users/ with provider 'credentials' for email/password sign-in", async () => {
    const mockFetch = jest
      .spyOn(global, "fetch")
      .mockResolvedValueOnce(new Response("{}", { status: 200 }));

    await signInCallback({
      user,
      account: {
        type: "credentials",
        provider: "credentials",
        providerAccountId: "1",
      },
      profile: undefined,
    } as any);

    expect(mockFetch).toHaveBeenCalledWith(
      "http://localhost:8000/api/auth/users/",
      expect.objectContaining({
        method: "POST",
        body: expect.stringContaining('"provider":"credentials"'),
      }),
    );
  });

  it("returns true for email/password sign-in", async () => {
    jest
      .spyOn(global, "fetch")
      .mockResolvedValueOnce(new Response("{}", { status: 200 }));

    const result = await signInCallback({
      user,
      account: {
        type: "credentials",
        provider: "credentials",
        providerAccountId: "1",
      },
      profile: undefined,
    } as any);

    expect(result).toBe(true);
  });

  it("calls /api/auth/users/ with provider 'google' for Google sign-in", async () => {
    const mockFetch = jest
      .spyOn(global, "fetch")
      .mockResolvedValueOnce(new Response("{}", { status: 200 }));

    await signInCallback({
      user,
      account: {
        type: "oauth",
        provider: "google",
        providerAccountId: "g-123",
        id_token: "some-id-token",
      },
      profile: undefined,
    } as any);

    expect(mockFetch).toHaveBeenCalledWith(
      "http://localhost:8000/api/auth/users/",
      expect.objectContaining({
        method: "POST",
        body: expect.stringContaining('"provider":"google"'),
      }),
    );
  });

  it("returns true for Google sign-in", async () => {
    jest
      .spyOn(global, "fetch")
      .mockResolvedValueOnce(new Response("{}", { status: 200 }));

    const result = await signInCallback({
      user,
      account: {
        type: "oauth",
        provider: "google",
        providerAccountId: "g-123",
        id_token: "some-id-token",
      },
      profile: undefined,
    } as any);

    expect(result).toBe(true);
  });

  it("sends user.email and user.name (not credentials) for Google sign-in", async () => {
    const mockFetch = jest
      .spyOn(global, "fetch")
      .mockResolvedValueOnce(new Response("{}", { status: 200 }));

    await signInCallback({
      user,
      account: {
        type: "oauth",
        provider: "google",
        providerAccountId: "g-123",
        id_token: "some-id-token",
      },
      profile: undefined,
    } as any);

    const body = JSON.parse(
      (mockFetch.mock.calls[0][1] as RequestInit).body as string,
    );
    expect(body.email).toBe("user@example.com");
    expect(body.name).toBe("Test User");
  });

  it("returns false when account type is neither credentials nor has an id_token", async () => {
    const result = await signInCallback({
      user,
      account: { type: "email", provider: "email", providerAccountId: "1" },
      profile: undefined,
    } as any);

    expect(result).toBe(false);
  });
});
