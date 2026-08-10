/**
 * @jest-environment node
 */
import { expect } from "@jest/globals";
import HTMLToMarkdownConverter from "@/services/api/html_to_markdown";

describe("HTMLToMarkdownConverter", () => {
  let converter: HTMLToMarkdownConverter;

  beforeEach(() => {
    converter = new HTMLToMarkdownConverter();
  });

  const convert = (html: string, type?: string) =>
    converter.convert({ html, type });

  // ─── Happy paths ──────────────────────────────────────────────────────────

  it("converts <h1> to a level-1 heading", () => {
    expect(convert("<h1>Hello World</h1>")).toBe("# Hello World");
  });

  it("converts <h2> to a level-2 heading", () => {
    expect(convert("<h2>Sub-heading</h2>")).toBe("## Sub-heading");
  });

  it("converts <h3> to a level-3 heading", () => {
    expect(convert("<h3>Section</h3>")).toBe("### Section");
  });

  it("converts <p> to plain text (trimmed)", () => {
    expect(convert("<p>A paragraph.</p>")).toBe("A paragraph.");
  });

  it("converts <strong> to bold markdown", () => {
    expect(convert("<p><strong>bold text</strong></p>")).toBe("**bold text**");
  });

  it("converts <em> to italic markdown", () => {
    expect(convert("<p><em>italic text</em></p>")).toBe("*italic text*");
  });

  it("converts inline <code> to backtick notation", () => {
    expect(convert("<p><code>myVar</code></p>")).toBe("`myVar`");
  });

  it("converts <pre><code> blocks to fenced code blocks", () => {
    const result = convert('<pre><code class="language-ts">const x = 1;</code></pre>');
    expect(result).toContain("```ts");
    expect(result).toContain("const x = 1;");
    expect(result).toContain("```");
  });

  it("converts a link without a title attribute to markdown link format", () => {
    const result = convert('<a href="https://example.com">Click here</a>');
    expect(result).toContain("[Click here](https://example.com)");
  });

  it("converts <img> to a placeholder in default mode", () => {
    const result = convert('<img src="https://example.com/img.png" alt="logo">');
    // Default mode inserts a src placeholder, not the real URL
    expect(result).toMatch(/!\[logo\]\({src_logo}\)/);
  });

  it("converts <img> to a real src URL in post mode", () => {
    const result = convert('<img src="https://example.com/img.png" alt="logo">', "post");
    expect(result).toBe("![logo](https://example.com/img.png)");
  });

  it("converts an unordered list to dash-prefixed items", () => {
    const result = convert("<ul><li>Alpha</li><li>Beta</li></ul>");
    expect(result).toContain("- Alpha");
    expect(result).toContain("- Beta");
  });

  it("converts an ordered list to numbered items", () => {
    const result = convert("<ol><li>First</li><li>Second</li></ol>");
    expect(result).toContain("1. First");
    expect(result).toContain("2. Second");
  });

  it("converts a simple table to markdown pipe notation", () => {
    const result = convert(
      "<table><tr><th>Name</th><th>Age</th></tr><tr><td>Alice</td><td>30</td></tr></table>",
    );
    expect(result).toContain("|");
    expect(result).toContain("Name");
    expect(result).toContain("---");
  });

  it("unwraps a nested <div> to its inner text", () => {
    const result = convert("<div><div>Inner text</div></div>");
    expect(result).toContain("Inner text");
  });

  // ─── Non-happy paths ──────────────────────────────────────────────────────

  it("returns an empty string for an empty HTML input", () => {
    expect(convert("")).toBe("");
  });

  it("strips <script> tags and returns empty string", () => {
    expect(convert("<script>window.evil = true</script>")).toBe("");
  });

  it("strips <style> tags and returns empty string", () => {
    expect(convert("<style>body { color: red; }</style>")).toBe("");
  });

  it("does not crash on deeply malformed HTML with unclosed tags", () => {
    expect(() => convert("<p><b><i>unclosed forever")).not.toThrow();
    const result = convert("<p><b><i>unclosed forever");
    expect(typeof result).toBe("string");
  });
});
