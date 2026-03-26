/**
 * @jest-environment node
 */
import { expect } from "@jest/globals";
import createLog from "@/services/authentication/create_log";
import readLog from "@/services/authentication/read_log";

// nextJest loads .env.test automatically — all crypto env vars are available.

describe("createLog / readLog round-trip", () => {
  // ─── Happy paths ────────────────────────────────────────────────────────

  it("createLog returns a non-empty base64 string", () => {
    const token = createLog("user-id-123");
    expect(typeof token).toBe("string");
    expect(token.length).toBeGreaterThan(0);
    // Valid base64 characters only
    expect(token).toMatch(/^[A-Za-z0-9+/]+=*$/);
  });

  it("readLog returns true for a freshly created token", () => {
    const token = createLog("user-id-abc");
    expect(readLog(token)).toBe(true);
  });

  it("two tokens created from the same input are different (random salt/iv)", () => {
    const t1 = createLog("same-user");
    const t2 = createLog("same-user");
    expect(t1).not.toBe(t2);
  });

  // ─── Non-happy paths ────────────────────────────────────────────────────

  it("returns false for a token that has expired (Date.now mocked to future)", () => {
    const token = createLog("user-id-expired");
    const realNow = Date.now();

    // Mock Date.now to be 3 minutes ahead — past the 2-minute expiry window
    jest.spyOn(Date, "now").mockReturnValue(realNow + 3 * 60 * 1000);
    const isValid = readLog(token);
    jest.restoreAllMocks();

    expect(isValid).toBe(false);
  });

  it("throws for a completely random short base64 string (buffer too small)", () => {
    // 4 bytes after decoding — well below the 16+12=28 byte minimum
    const garbage = Buffer.from("AAAA").toString("base64");
    expect(() => readLog(garbage)).toThrow();
  });

  it("throws when buffer has salt+iv but is missing the auth tag", () => {
    // 16 (salt) + 12 (iv) = 28 bytes — still shorter than the 16+12+16=44 minimum
    const tooShort = Buffer.alloc(28).fill(0x42).toString("base64");
    expect(() => readLog(tooShort)).toThrow();
  });
});
