import "server-only"; // Ensure this module is not included in client bundles
import crypto from "crypto";
export function createSignature(
  nonce: string,
  timestamp: string,
  articleId: string,
): { signature: string; body: string } {
  const keyId = process.env.EDITOR_SECRET_KEY_ID || "";
  const body = JSON.stringify({
    articleId,
    note: "Article published",
  });

  const secret = process.env.EDITOR_TO_WEB_HMAC_SECRET;
  if (!secret) {
    throw new Error("EDITOR_TO_WEB_HMAC_SECRET is not configured");
  }

  const bodyHash = crypto
    .createHash("sha256")
    .update(body, "utf8")
    .digest("hex");

  const message = ["POST", "/api/post", keyId, timestamp, nonce, bodyHash].join(
    "\n",
  );

  const signature = crypto
    .createHmac("sha256", process.env.EDITOR_TO_WEB_HMAC_SECRET!)
    .update(message, "utf8")
    .digest("hex");

  return { signature: signature, body: body };
}
