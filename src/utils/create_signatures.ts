"server-only"; // Ensure this module is not included in client bundles
import crypto from "crypto";
export function createSignature(
  nonce: string,
  timestamp: string,
  articleId: string,
): string {
  const message = ["POST", "/api/post", timestamp, nonce, articleId].join("\n");

  const secret = process.env.EDITOR_TO_WEB_HMAC_SECRET;
  if (!secret) {
    throw new Error("EDITOR_TO_WEB_HMAC_SECRET is not configured");
  }

  return crypto
    .createHmac("sha256", secret)
    .update(message, "utf8")
    .digest("hex");
}
