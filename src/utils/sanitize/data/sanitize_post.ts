import { sanitizeUrl } from "./sanitize_url";

export function sanitizePost(postItem: string | undefined): string {
  if (typeof postItem !== "string") return "";
  //
  const dangerousKeys = ["__proto__", "constructor", "prototype", "eval"];
  if (
    dangerousKeys.some((dangerous) =>
      postItem.toLowerCase().includes(dangerous)
    )
  ) {
    return "";
  }
  //
  const sanitizedItem = sanitizeUrl(postItem);
  if (sanitizedItem.status !== 200) {
    return "";
  }
  return postItem;
}
