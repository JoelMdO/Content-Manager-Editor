"server-only";
export function sanitizeUrl(url: string): { status: number; message: string } {
  if (url.startsWith("javascript:"))
    return { status: 205, message: "url not allowed" };
  if (
    url.includes("javascript:") ||
    url.includes("data:") ||
    url.includes("<script>")
  )
    return { status: 205, message: "url not allowed" };
  else return { status: 200, message: "url valid" };
}
