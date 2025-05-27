import { NextResponse } from "next/server";
import "server-only";

const duration = Number(process.env.RATE_LIMIT_WINDOW_MINUTES);
const limit = Number(process.env.MAX_REQUESTS_PER_WINDOW);
const req = new Map();

export default async function rateLimit(request: any) {
  let ip =
    request.headers.get("x-forwarded-for") ||
    request.headers.get("x-real-ip") ||
    "unknown";
  let pathname = new URL(request.url).pathname;
  const currentTime = Date.now();

  if (!ip) {
    return new NextResponse(
      JSON.stringify({ message: "Unable to determine IP address" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
  const key = `${ip}:${pathname}`; // Different key for each endpoint
  try {
    if (!req.has(key)) {
      req.set(key, { count: 1, lastRequest: currentTime });
      return NextResponse.next();
    } else {
      const { count, lastRequest } = req.get(key);
      if (currentTime - lastRequest > duration * 60 * 1000) {
        req.set(key, { count: 1, lastRequest: currentTime });
        return NextResponse.next();
      } else if (count >= limit) {
        return new NextResponse(
          JSON.stringify({
            error: "Too many requests. Please try again later.",
          }),
          { status: 429, headers: { "Content-Type": "application/json" } }
        );
      } else {
        req.set(key, { count: count + 1, lastRequest: currentTime });
        return NextResponse.next();
      }
    }
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ error: "Firebase initialization failed" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export const config = {
  matcher: ["/api/:path*"],
};
