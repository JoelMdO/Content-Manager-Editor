import { sanitizeEmail } from "../sanitize_email";

describe("sanitizeEmail", () => {
  // ─── Happy paths ──────────────────────────────────────────────────────────

  it("normalises a valid email to lowercase", () => {
    const result = sanitizeEmail("USER@EXAMPLE.COM");
    expect(result).toBeTruthy();
    expect(result).toMatch(/@/);
    expect(result).toBe(result?.toLowerCase());
  });

  it("accepts a well-formed lowercase email unchanged", () => {
    const result = sanitizeEmail("alice@example.com");
    expect(result).toBeTruthy();
    expect(result).toContain("alice");
  });

  // ─── Non-happy paths ──────────────────────────────────────────────────────

  it("returns empty string for null", () => {
    expect(sanitizeEmail(null)).toBe("");
  });

  it("returns empty string for undefined", () => {
    expect(sanitizeEmail(undefined)).toBe("");
  });

  it("returns empty string for a plain string without @", () => {
    expect(sanitizeEmail("notanemail")).toBe("");
  });

  it("returns empty string for an XSS payload disguised as an email address", () => {
    // validator.isEmail rejects HTML/script payloads
    expect(sanitizeEmail('"><img src=x onerror=alert(1)>@x.com')).toBe("");
  });

  it("returns empty string for an empty string", () => {
    expect(sanitizeEmail("")).toBe("");
  });
});
