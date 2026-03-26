import { sanitizePassword } from "../sanitize_pwd";

describe("sanitizePassword", () => {
  // ─── Happy paths ──────────────────────────────────────────────────────────

  it("returns a normal password unchanged", () => {
    const pw = "Str0ng!Password#42";
    expect(sanitizePassword(pw)).toBe(pw);
  });

  it("allows special characters that are legitimate in passwords", () => {
    const pw = "pa$$w0rD!@#%^&*()_+-=";
    expect(sanitizePassword(pw)).toBe(pw);
  });

  // ─── Non-happy paths ──────────────────────────────────────────────────────

  it("returns empty string for null", () => {
    expect(sanitizePassword(null)).toBe("");
  });

  it("returns empty string for undefined", () => {
    expect(sanitizePassword(undefined)).toBe("");
  });

  it("strips ASCII control characters (\\x00–\\x1F)", () => {
    const result = sanitizePassword("pass\x00\x01\x1Fword");
    expect(result).toBe("password");
  });

  it("strips zero-width and invisible Unicode characters", () => {
    // \u200B = zero-width space, \uFEFF = BOM
    const result = sanitizePassword("pass\u200Bword\uFEFF");
    expect(result).toBe("password");
  });

  it("truncates passwords longer than 128 characters to exactly 128", () => {
    const long = "a".repeat(200);
    const result = sanitizePassword(long);
    expect(result).toHaveLength(128);
  });
});
