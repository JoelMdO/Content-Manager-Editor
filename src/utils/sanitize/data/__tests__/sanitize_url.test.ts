import { sanitizeUrl } from "../sanitize_url";

describe("sanitizeUrl", () => {
  // ─── Happy paths ──────────────────────────────────────────────────────────

  it("returns status 200 for a valid https URL", () => {
    const result = sanitizeUrl("https://example.com/path?q=1");
    expect(result).toEqual({ status: 200, message: "url valid" });
  });

  it("returns status 200 for an empty string (no dangerous pattern)", () => {
    const result = sanitizeUrl("");
    expect(result).toEqual({ status: 200, message: "url valid" });
  });

  it("preserves original casing when type is 'markdown'", () => {
    // markdown type skips toLowerCase so the url is used as-is
    const result = sanitizeUrl("HTTPS://EXAMPLE.COM/PATH", "markdown");
    expect(result).toEqual({ status: 200, message: "url valid" });
  });

  // ─── Non-happy paths ──────────────────────────────────────────────────────

  it("blocks javascript: scheme", () => {
    const result = sanitizeUrl("javascript:alert(document.cookie)");
    expect(result).toEqual({ status: 205, message: "url not allowed" });
  });

  it("blocks uppercase javascript: scheme", () => {
    const result = sanitizeUrl("JavaScript:alert(document.cookie)");
    expect(result).toEqual({ status: 205, message: "url not allowed" });
  });

  it("blocks encoded javascript: scheme", () => {
    const result = sanitizeUrl("javascript%3Aalert(document.cookie)");
    expect(result).toEqual({ status: 205, message: "url not allowed" });
  });

  it("blocks data: URI", () => {
    const result = sanitizeUrl("data:text/html,<h1>injected</h1>");
    expect(result).toEqual({ status: 205, message: "url not allowed" });
  });

  it("blocks embedded <script> tag", () => {
    const result = sanitizeUrl("<script>fetch('/steal')</script>");
    expect(result).toEqual({ status: 205, message: "url not allowed" });
  });

  it("blocks vbscript: protocol", () => {
    const result = sanitizeUrl("vbscript:msgbox('xss')");
    expect(result).toEqual({ status: 205, message: "url not allowed" });
  });
});
