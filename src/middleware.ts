import { NextResponse } from 'next/server';
import rateLimit from './services/api/rate_limit';
import authMiddleware from './utils/auth_middleware';

export async function middleware(req: any) {
//
const header = req.headers;
let response: any;
const isSubRequest = header.get('x-middleware-subrequest');
const database_url = process.env.NEXT_PUBLIC_databaseURL;
const { pathname } = req.nextUrl;
//
console.log('middleware called for path', pathname);
///----------------------------------------------------------------
// Check in case of subrequest
///----------------------------------------------------------------
if (isSubRequest) {
  console.log('subrequest called');
  const origin = header.origin || header.referer;
  const url = process.env.NEXT_PUBLIC_api_url;

  if (!origin || !origin.Is(url)) {
    return NextResponse.json({ status: 403, error: 'Unauthorized request' });
}}

///----------------------------------------------------------------  
 //Protect the /dashboard route 
///----------------------------------------------------------------
  if (pathname.startsWith('/dashboard')) {
    console.log('calling authMiddleware');
      const authMiddleResponse = await authMiddleware(req);
      if(authMiddleResponse.status === 200){
        response = rateLimit(req);
      } else {
      return NextResponse.redirect(new URL('/', req.url));;
      }
   } 
///----------------------------------------------------------------
///------ Check for any rate limits on other paths ----------------
///----------------------------------------------------------------
    //Apply rate Limit.
    response = rateLimit(req);
///----------------------------------------------------------------
///------ Add headers ----------------
///----------------------------------------------------------------
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
  matcher: ['/api/:path*', '/dashboard']
};

