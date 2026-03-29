/**
 * @jest-environment node
 */
import { sanitizeData } from "../sanitize_data";
import { expect } from "@jest/globals";

// ─── Module mocks ──────────────────────────────────────────────────────────
// Mock isValidUrl to avoid pulling in errorAlert → React → jsdom issues
jest.mock("@/utils/sanitize/data/valid_url", () => ({
  isValidUrl: (url: string) => {
    try {
      return new URL(url).protocol === "https:";
    } catch {
      return false;
    }
  },
}));

// Mock async file sanitizer — real impl reads file bytes we don't have in tests
jest.mock("@/utils/sanitize/file/sanitize_file", () => ({
  sanitizeFile: jest
    .fn()
    .mockResolvedValue({ status: 200, message: "file valid" }),
}));

// Mock complex playbook sanitizer to isolate sanitize_data logic
jest.mock("@/utils/sanitize/sanitize_form_playbook", () => ({
  sanitizeFormPlaybook: jest.fn().mockReturnValue({ status: 200, message: {} }),
}));

// Mock summary sanitizer
jest.mock("@/utils/sanitize/data/sanitize_summary", () => ({
  sanitizeSummary: jest.fn().mockReturnValue("sanitized summary text"),
}));

// ─── Tests ─────────────────────────────────────────────────────────────────
describe("sanitizeData", () => {
  // ─── clean-link ──────────────────────────────────────────────────────

  describe("type: clean-link", () => {
    it("returns status 200 for a valid https URL", async () => {
      const result = await sanitizeData(
        "https://example.com/article",
        "clean-link",
      );
      expect(result.status).toBe(200);
    });

    it("returns status 205 when the URL uses the javascript: scheme", async () => {
      const result = await sanitizeData("javascript:alert(1)", "clean-link");
      expect(result.status).toBe(205);
    });

    it("returns status 205 for non-string input", async () => {
      const result = await sanitizeData(42 as any, "clean-link");
      expect(result.status).toBe(205);
    });
  });

  // ─── clean-image ─────────────────────────────────────────────────────

  describe("type: clean-image", () => {
    it("delegates to sanitizeFile and returns 200 for a valid File", async () => {
      const file = new File(["content"], "photo.png", { type: "image/png" });
      const result = await sanitizeData(file, "clean-image");
      expect(result.status).toBe(200);
    });
  });

  // ─── post ─────────────────────────────────────────────────────────────

  describe("type: post", () => {
    it("returns status 200 for a plain article object", async () => {
      const data = { title: "Test Title", body: "<p>Content</p>" };
      const result = await sanitizeData(data as any, "post");
      expect(result.status).toBe(200);
    });

    it("returns status 400 when data is a File object (wrong shape)", async () => {
      const file = new File([], "test.txt");
      const result = await sanitizeData(file, "post");
      expect(result.status).toBe(400);
      expect(result.message).toBe("Invalid post data");
    });

    it("returns status 400 when data is a FormData object (wrong shape)", async () => {
      const fd = new FormData();
      fd.append("title", "test");
      const result = await sanitizeData(fd as any, "post");
      expect(result.status).toBe(400);
    });
  });

  // ─── sign-in-by-email ─────────────────────────────────────────────────

  describe("type: sign-in-by-email", () => {
    it("returns status 200 with sanitised credentials for valid input", async () => {
      const data = { email: "test@example.com", password: "SecurePass123!" };
      const result = await sanitizeData(data as any, "sign-in-by-email");
      expect(result.status).toBe(200);
      expect((result.message as any).email).toBeTruthy();
    });

    it("returns status 400 when password field is missing", async () => {
      const data = { email: "test@example.com" };
      const result = await sanitizeData(data as any, "sign-in-by-email");
      expect(result.status).toBe(400);
    });

    it("returns status 400 when email field is missing", async () => {
      const data = { password: "somepass" };
      const result = await sanitizeData(data as any, "sign-in-by-email");
      expect(result.status).toBe(400);
    });

    it("returns status 400 for a non-object (string) input", async () => {
      const result = await sanitizeData(
        "not-an-object" as any,
        "sign-in-by-email",
      );
      expect(result.status).toBe(400);
    });
  });

  // ─── password-reset ────────────────────────────────────────────────────

  describe("type: password-reset", () => {
    it("returns status 200 with sanitised email for valid input", async () => {
      const result = await sanitizeData(
        { email: "user@example.com" } as any,
        "password-reset",
      );
      expect(result.status).toBe(200);
      expect((result.message as any).email).toBeTruthy();
    });

    it("returns status 400 when email is missing", async () => {
      const result = await sanitizeData({} as any, "password-reset");
      expect(result.status).toBe(400);
    });

    it("returns status 400 when email is invalid", async () => {
      const result = await sanitizeData(
        { email: "not-an-email" } as any,
        "password-reset",
      );
      expect(result.status).toBe(400);
    });

    it("returns status 400 for non-object input", async () => {
      const result = await sanitizeData("user@example.com" as any, "password-reset");
      expect(result.status).toBe(400);
    });
  });

  // ─── save-user ────────────────────────────────────────────────────────

  describe("type: save-user", () => {
    it("returns status 200 with sanitised email for valid input", async () => {
      const result = await sanitizeData(
        { email: "user@example.com", provider: "google" } as any,
        "save-user",
      );
      expect(result.status).toBe(200);
      expect((result.message as any).email).toBeTruthy();
    });

    it("returns status 200 when provider is omitted", async () => {
      const result = await sanitizeData(
        { email: "user@example.com" } as any,
        "save-user",
      );
      expect(result.status).toBe(200);
    });

    it("returns status 400 when email is missing", async () => {
      const result = await sanitizeData(
        { provider: "google" } as any,
        "save-user",
      );
      expect(result.status).toBe(400);
    });

    it("returns status 400 for non-object input", async () => {
      const result = await sanitizeData("notanobject" as any, "save-user");
      expect(result.status).toBe(400);
    });
  });

  // ─── summary ─────────────────────────────────────────────────────────

  describe("type: summary", () => {
    it("returns status 200 and the sanitised summary text", async () => {
      const result = await sanitizeData(
        { title: "T", body: "B", language: "en" } as any,
        "summary",
      );
      expect(result.status).toBe(200);
    });
  });
});
