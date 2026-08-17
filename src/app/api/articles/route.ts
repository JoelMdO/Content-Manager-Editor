import "server-only";
import { NextResponse } from "next/server";

export async function GET(req: Request): Promise<Response> {
  const configuredApiUrl = process.env.URL_API_DECAV || process.env.URL_API_JOE;

  if (!configuredApiUrl) {
    return NextResponse.json(
      { error: "CMS article endpoint is not configured" },
      { status: 500 },
    );
  }

  const apiUrl = new URL(configuredApiUrl);
  apiUrl.search = new URL(req.url).search;

  const response = await fetch(apiUrl.toString(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-Internal-Proxy-Key": process.env.PROXY_KEY || "",
    },
  });

  const body = await response.text();
  return new NextResponse(body, {
    status: response.status,
    headers: {
      "Content-Type":
        response.headers?.get("content-type") || "application/json",
    },
  });
}
