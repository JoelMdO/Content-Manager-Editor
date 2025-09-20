"server-only";
export function sanitizeUrl(
  url: string,
  type?: string
): { status: number; message: string } {
  //console.log('at sanitizeUrl, url:"', url);
  let u: string = "";

  if (type === "markdown") {
    //console.log('u markdown at sanitizeUrl, url:"', url);

    u = url;
  } else {
    u = decodeURI(url).trim().toLowerCase();
  }
  //console.log('"u at sanitizeUrl":', u);
  //
  //console.log('url or U"', u);

  //
  if (
    u.includes("javascript:") ||
    u.includes("data:") ||
    u.includes("<script>") ||
    u.includes("vbscript:")
  ) {
    // console.log('"u at IF sanitizeUrl":', u);

    return { status: 205, message: "url not allowed" };
  } else {
    // console.log('"u at else sanitizeUrl":', u);
    return { status: 200, message: "url valid" };
  }
}
