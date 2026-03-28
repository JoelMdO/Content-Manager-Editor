import { NextRequest, NextResponse } from "next/server";
import allowedOriginsCheck from "@/utils/allowed_origins_check";

export async function POST(request: NextRequest) {
  // Validate origin
  const originCheck = allowedOriginsCheck(request);
  if (originCheck && originCheck.status === 403) {
    return NextResponse.json({ status: 403, message: "Origin not allowed" });
  }

  try {
    const body = await request.json();
    const email = body?.email as string | undefined;

    if (!email) {
      return NextResponse.json({
        status: 400,
        error: "Missing 'email' in request body",
      });
    }
    const url = process.env.PASSWORD_RESET_API_ENDPOINT;

    if (!url) {
      return NextResponse.json({
        status: 500,
        error: "Password reset API endpoint not configured",
      });
    }

    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    // Always return 200 regardless of backend outcome — never reveal if email exists
    return NextResponse.json({
      status: 200,
      message: "If this email exists, a password reset link has been generated",
    });
  } catch {
    // Swallow errors — same generic 200 to prevent email enumeration
    return NextResponse.json({
      status: 200,
      message: "If this email exists, a password reset link has been generated",
    });
  }
}
