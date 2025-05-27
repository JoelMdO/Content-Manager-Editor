import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import rateLimit from "./services/api/rate_limit";
import generateNonce from "./utils/nonce";
// import callHub from "./services/api/call_hub";
// export { default } from "next-auth/middleware";
//
export async function middleware(req: NextRequest) {
  //   ///----------------------------------------------------------------
  //   // Check in case of subrequest
  //   ///----------------------------------------------------------------
  const path = req.nextUrl.pathname;
  let rateLimitResponse: NextResponse;
  let response: NextResponse = NextResponse.next();
  const database_url = process.env.NEXT_PUBLIC_FIREBASE_databaseURL;
  const database_2_url = process.env.NEXT_PUBLIC_FIREBASE_DeCav_databaseURL;
  const nonce = generateNonce();

  if (
    path.startsWith("/dashboard") ||
    path.startsWith("/playbook") ||
    path.startsWith("/readPlaybook")
  ) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    console.log("Session token at middleware:", token);

    if (!token) {
      console.log("No session token found, redirecting to login.");
      return NextResponse.redirect(new URL("/", req.url));
    }
  }
  ///----------------------------------------------------------------
  ///------ Check for any rate limits on other paths ----------------
  ///----------------------------------------------------------------
  //Apply rate Limit.
  rateLimitResponse = await rateLimit(req);
  ///----------------------------------------------------------------
  ///------ Add headers ----------------
  ///----------------------------------------------------------------
  response.headers.set(
    "Content-Security-Policy",
    `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}';
    style-src 'self';
    img-src 'self';
    font-src 'self';
    connect-src 'self' ${database_url} ${database_2_url};
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'self';
    upgrade-insecure-requests;
    block-all-mixed-content;
    `
      .replace(/\s{2,}/g, " ")
      .trim()
  );

  console.log("Session token valid, allowing access.");
  return response;
}

export const config = {
  matcher: [
    "/api/post",
    "/api/save",
    "/dashboard",
    "/playbook",
    "/readPlaybook",
  ],
};
