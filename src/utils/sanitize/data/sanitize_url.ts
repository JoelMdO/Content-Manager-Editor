"server-only";
export function sanitizeUrl(
  url: string,
  type?: string,
): { status: number; message: string } {
  ////console.log('at sanitizeUrl, url:"', url);
  let u: string = "";

  try {
    u = decodeURIComponent(url).trim().toLowerCase();
  } catch {
    u = url.trim().toLowerCase();
  }
  ////console.log('"u at sanitizeUrl":', u);
  //
  ////console.log('url or U"', u);

  //
  if (
    u.includes("javascript:") ||
    u.includes("data:") ||
    u.includes("<script>") ||
    u.includes("vbscript:")
  ) {
    // //console.log('"u at IF sanitizeUrl":', u);

    return { status: 205, message: "url not allowed" };
  } else {
    // //console.log('"u at else sanitizeUrl":', u);
    return { status: 200, message: "url valid" };
  }
}
