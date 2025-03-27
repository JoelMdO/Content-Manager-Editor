import { NextResponse } from 'next/server';
import rateLimit from './services/api/rate_limit';

export function middleware(req: any) {
///----------------------------------------------------------------
///------ Check for any rate limits --------------------------
///----------------------------------------------------------------
const header = req.headers;
let response: any;
const isSubRequest = header.get('x-middleware-subrequest');
const database_url = process.env.NEXT_PUBLIC_databaseURL;
//
// Check in case of subrequest
if (isSubRequest) {
  const origin = header.origin || header.referer;
  const url = process.env.NEXT_PUBLIC_api_url;

  if (!origin || !origin.Is(url)) {
    return NextResponse.json({ status: 403, error: 'Unauthorized request' });
  }
 response = rateLimit(req);
 if (!response) {
 response = NextResponse.next();
}}
  response = rateLimit(req);
  if (!response) {
  response = NextResponse.next();
}
response.headers = {
  ...response.headers,
'Content-Security-Policy':
`default-src 'self';
script-src 'self';
style-src 'self';
img-src 'self';
font-src 'self';
connect-src 'self' ${database_url};
object-src 'none';
base-uri 'self';
form-action 'self';            
frame-ancestors 'self';
upgrade-insecure-requests;
block-all-mixed-content;
.replace(/\s{2,}/g, ' ').trim();`,
}
return response;
}

export const config = {
  matcher: ['/api/:path*']
};

