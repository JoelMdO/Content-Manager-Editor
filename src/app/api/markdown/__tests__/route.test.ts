/**
 * @jest-environment node
 */
import { expect } from "@jest/globals";
import { POST } from "@/app/api/markdown/route";
import HTMLToMarkdownConverter from "@/services/api/html_to_markdown";

// ─── Helper ────────────────────────────────────────────────────────────────
function makeRequest(body: unknown): Request {
  return new Request("http://localhost:8000/api/markdown", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
}

// ─── Tests ─────────────────────────────────────────────────────────────────
describe("POST /api/markdown", () => {
  // ─── Happy paths ────────────────────────────────────────────────────────

  it("converts a valid HTML string and returns status 200 with markdown body", async () => {
    const req = makeRequest("<h1>Article Title</h1><p>Some content.</p>");
    const res = await POST(req as any);
    const json = await res.json();

    expect(json.status).toBe(200);
    expect(json.message).toBe("Markdown converted successfully");
    expect(typeof json.body).toBe("string");
    expect(json.body).toContain("# Article Title");
    expect(json.body).toContain("Some content.");
  });

  it("converts an HTML string with bold and italic", async () => {
    const req = makeRequest(
      "<p><strong>Bold</strong> and <em>italic</em>.</p>",
    );
    const res = await POST(req as any);
    const json = await res.json();

    expect(json.status).toBe(200);
    expect(json.body).toContain("**Bold**");
    expect(json.body).toContain("*italic*");
  });

  // ─── Non-happy paths ────────────────────────────────────────────────────

  it("returns 400 when body is null (fails typeof check)", async () => {
    const req = makeRequest(null);
    const res = await POST(req as any);
    const json = await res.json();

    expect(json.error).toBeTruthy();
    // Next.js json() helper returns status in the response init, not the body
    expect(res.status).toBe(400);
  });

  it("returns 400 when body is a number instead of a string", async () => {
    const req = makeRequest(42);
    const res = await POST(req as any);
    const json = await res.json();

    expect(json.error).toBeTruthy();
    expect(res.status).toBe(400);
  });

  it("returns 400 when body is an object instead of a string", async () => {
    const req = makeRequest({ html: "<p>test</p>" });
    const res = await POST(req as any);
    const json = await res.json();

    expect(json.error).toBeTruthy();
    expect(res.status).toBe(400);
  });

  it("returns 500 when the HTMLToMarkdownConverter throws", async () => {
    jest
      .spyOn(HTMLToMarkdownConverter.prototype, "convert")
      .mockImplementationOnce(() => {
        throw new Error("Converter internal error");
      });

    const req = makeRequest("<p>trigger error</p>");
    const res = await POST(req as any);
    const json = await res.json();

    expect(json.status).toBe(500);
  });
});
