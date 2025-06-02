import { NextRequest, NextResponse } from "next/server";

const allowedOriginsCheck = (req: NextRequest) => {
  const allowedOrigins = [
    `${process.env.NEXTAUTH_URL}/api/hub`,
    "internal", // for server-to-server calls
  ];

  const referer = req.headers.get("referer");
  const userAgent = req.headers.get("user-agent");

  // Check if this is an internal server call or from allowed origin
  const isInternalCall = !referer || userAgent?.includes("node-fetch");

  if (
    !isInternalCall &&
    referer &&
    !allowedOrigins.some((origin) => referer.startsWith(origin))
  ) {
    return NextResponse.json({
      status: 403,
      message: "Forbidden origin",
    });
  }
  return NextResponse.json({
    status: 200,
    message: "Allowed origin",
  });
};

export default allowedOriginsCheck;
