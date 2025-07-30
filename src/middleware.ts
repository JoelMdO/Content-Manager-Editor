import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import rateLimit from "./services/api/rate_limit";
import generateNonce from "./utils/nonce";

//
export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const response: NextResponse = NextResponse.next();
  const database_url = process.env.NEXT_PUBLIC_FIREBASE_databaseURL;
  const database_2_url = process.env.NEXT_PUBLIC_FIREBASE_DeCav_databaseURL;
  const nonce = generateNonce();

  //TODO change on production
  // if (
  //   path.startsWith("/dashboard") ||
  //   path.startsWith("/playbook") ||
  //   path.startsWith("/readPlaybook")
  // ) {

  //   const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  //   if (!token) {
  //     return NextResponse.redirect(new URL("/", req.url));
  //   }
  // }
  ///----------------------------------------------------------------
  ///------ Check for any rate limits on other paths ----------------
  ///----------------------------------------------------------------
  //Apply rate Limit.
  await rateLimit(req);
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

  return response;
}

export const config = {
  matcher: [
    "/api/post",
    "/api/save",
    "/api/translate",
    "/dashboard",
    "/playbook",
    "/readPlaybook",
  ],
};
