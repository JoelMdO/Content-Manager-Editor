import allowedOriginsCheck from "@/utils/allowed_origins_check";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  //--------------------------------------------
  // API Route for login with email and password
  // This route will be called by NextAuth when using credentials provider
  // It will forward the email and password to the backend login API and return the response
  //---------------------------------------------
  // Validate origin
  const originCheck = allowedOriginsCheck(request);
  if (originCheck && originCheck.status === 403) {
    return NextResponse.json({ status: 403, message: "Origin not allowed" });
  }
  try {
    const body = await request.json();
    const url = process.env.LOGIN_API_ENDPOINT;

    if (!url) {
      return NextResponse.json(
        { error: "LOGIN_API_ENDPOINT is not configured" },
        { status: 500 },
      );
    }
    const { email, password } = body;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.error();
  }
}
