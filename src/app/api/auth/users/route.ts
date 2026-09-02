import allowedOriginsCheck from "@/utils/allowed_origins_check";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  //--------------------------------------------
  // API Route to be used on the first call to check if the user is already in BackendEditor
  // db, if not will save it using email and password
  //---------------------------------------------
  // Validate origin
  const originCheck = allowedOriginsCheck(request);
  if (originCheck && originCheck.status === 403) {
    return NextResponse.json({ status: 403, message: "Origin not allowed" });
  }
  try {
    const body = await request.json();
    const url = process.env.USERS_API_ENDPOINT;

    if (!url) {
      return NextResponse.json(
        { error: "USERS_API_ENDPOINT is not configured" },
        { status: 500 },
      );
    }
    const { email, name, provider } = body;
    const internalProxyKey = process.env.PROXY_KEY;
    if (!internalProxyKey) {
      return NextResponse.json(
        { error: "PROXY_KEY is not configured" },
        { status: 500 },
      );
    }
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Internal-Proxy-Key": internalProxyKey,
      },
      body: JSON.stringify({ email, name, provider }),
    });

    if (response.status !== 200 && response.status !== 201) {
      return NextResponse.json(
        { error: "Error user not found" },
        { status: 500 },
      );
    }
    return NextResponse.json({
      status: 200,
      message: "User processed successfully",
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { error: "Unable to process user" },
      { status: 500 },
    );
  }
}
