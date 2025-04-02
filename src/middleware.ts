import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {

///----------------------------------------------------------------
///------ Check for user authentication for dashboard--------------
///----------------------------------------------------------------
const path = req.nextUrl.pathname;
console.log('pathname', path);

if(path.startsWith('/dashboard')){
  //Get the previous path
  console.log('doing /dashboard');
  
  const referrer = req.headers.get("referer") || "";
  const referrerUrl = referrer ? new URL(referrer) : null;
  const referrerPAth = referrerUrl?.pathname || "";
  console.log(`access to ${path} from referrer ${referrerPAth}`);
  if (referrerPAth === '/'){
    return NextResponse.next();
  } else {
    return NextResponse.redirect(new URL('/', req.url));
  }
}
//
const header = req.headers;
const isSubRequest = header.get('x-middleware-subrequest');
if (isSubRequest) {
  const origin = header.get('origin') || header.get('referer');
  console.log('origin at middlewre', origin);
  
  const url = process.env.NEXT_PUBLIC_api_url;

  if (!origin || origin != url) {
    return NextResponse.json({ status: 403, error: 'Unauthorized request' });
  }
}
return NextResponse.next();
}

export const config = {
  matcher: ['/api/post', '/dashboard']
};

