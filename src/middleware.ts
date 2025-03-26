import { NextResponse } from 'next/server';

export function middleware(req: any) {

///----------------------------------------------------------------
///------ Check for user authentication --------------------------
///----------------------------------------------------------------
// Get the cookie from the request headers
/// TODO : check if user is signed in
// const sessionCookie = req.cookies.get('session');
// console.log("sessionCookie at setAuthListener:", sessionCookie);  // Log cookie value
//   // Get all cookies from the request headers
// const isSignedIn = req.cookies.get("start")?.value;
// console.log("Cookies at setAuthListener afte first Signup:", isSignedIn);  // Log cookie value
//   // If the cookie is missing, redirect to a login page
// if (!sessionCookie) {
//     const url = process.env.NEXT_PUBLIC_api_url;
//     return NextResponse.redirect(new URL('/', url));
// }
  // If the cookie exists, check on origin and headers.
const header = req.headers;
const isSubRequest = header.get('x-middleware-subrequest');
if (isSubRequest) {
  const origin = header.origin || header.referer;
  const url = process.env.NEXT_PUBLIC_api_url;

  if (!origin || !origin.Is(url)) {
    return NextResponse.json({ status: 403, error: 'Unauthorized request' });
  }
}
return NextResponse.next();
}

export const config = {
  matcher: ['/api/post']
};

