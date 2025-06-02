"server-only";
export function sanitizeUrl(url: string): { status: number; message: string } {
  let u = decodeURI(url).trim().toLowerCase();
  if (
    u.includes("javascript:") ||
    u.includes("data:") ||
    u.includes("<script>") ||
    u.includes("vbscript:")
  )
    return { status: 205, message: "url not allowed" };
  else return { status: 200, message: "url valid" };
}
