"server-only";
import apiRoutes from "../../../services/api/api_routes";
import { NextResponse } from "next/server";
import { sanitizeData } from "../../../utils/sanitize/data/sanitize_data";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/nextauth/auth";
import createLog from "../../../services/authentication/create_log";
import { dataType } from "@/types/dataType";

// Session cache to reduce expensive getServerSession calls
const sessionCache = new Map<string, { session: object | null; expires: number }>();

// Clear expired sessions every 2 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of sessionCache.entries()) {
    if (value.expires < now) {
      sessionCache.delete(key);
    }
  }
}, 2 * 60 * 1000);

export async function POST(req: Request): Promise<NextResponse> {
  //
  let dataApiHub: dataType = "";
  let type: string = "clean-image";
  let token: string | undefined = "";
  let sessionId: string | undefined = "";
  let formData: FormData = new FormData();

  ///___________________________________________________
  /// Check the content type to see if the request
  /// comes with file or only text
  ///___________________________________________________
  try {
    const contentType = req.headers.get("Content-Type") || "";

    if (contentType.includes("application/json")) {
      const getDataAtApiHub = await req.json();

      dataApiHub = getDataAtApiHub.data;

      type = getDataAtApiHub.type;
      dataApiHub = dataApiHub;
    } else {
      /// For request including files.
      formData = await req.formData();
      type = formData.get("type") as string;

      if (type !== "post") {
        dataApiHub = formData.get("file") || "";
        if (!(dataApiHub instanceof File)) {
          return NextResponse.json({
            status: 400,
            message: "No file uploaded",
          });
        }
      }
    }
    ///--------------------------------------------------------
    // Optimized session check with caching
    ///--------------------------------------------------------
    
    // Skip session check for sign-in requests
    if (type === "sign-in-by-email") {
      // Fast path for login requests
      const statusSanitize = await sanitizeData(dataApiHub, type);
      
      if (statusSanitize.status != 200) {
        return NextResponse.json({ status: 403, message: "Unauthorized data" });
      }
      
      if (
        typeof statusSanitize.message === "object" &&
        statusSanitize.message !== null &&
        "email" in statusSanitize.message
      ) {
        dataApiHub = {
          email: (statusSanitize.message as { email: string }).email,
          password: (statusSanitize.message as { password: string }).password,
        };
      } else {
        return NextResponse.json({
          status: 400,
          message: "Invalid sanitized data for sign-in-by-email",
        });
      }
      
      const response = await apiRoutes({
        token: undefined,
        data: dataApiHub,
        type: type,
      });

      const jsonResponse = await response.json();
      return NextResponse.json({
        status: jsonResponse.status,
        message: jsonResponse.message,
      });
    }

    // For other requests, check session with caching
    const sessionCacheKey = req.headers.get("authorization") || req.headers.get("cookie") || "default";
    let session = null;
    
    const cached = sessionCache.get(sessionCacheKey);
    if (cached && cached.expires > Date.now()) {
      session = cached.session;
    } else {
      session = await getServerSession(authOptions);
      
      // Cache valid sessions for 30 seconds to reduce Firebase calls
      if (session) {
        sessionCache.set(sessionCacheKey, {
          session,
          expires: Date.now() + 30 * 1000
        });
      }
    }

    if (!session) {
      return NextResponse.json({
        status: 401,
        message: "User without a valid session",
      });
    }

    // Generate token only when needed
    if (session) {
      token = createLog(session?.user.id);
    }

    if (session && type === "post") {
      sessionId = session.user?.id;
    }

    ///-----------------------------------------------
    /// Sanitize the data received from the request
    ///-----------------------------------------------

    const statusSanitize = await sanitizeData(dataApiHub, type);

    //
    if (statusSanitize.status != 200) {
      return NextResponse.json({ status: 403, message: "Unauthorized data" });
    }
    //
    switch (type) {
      ///--------------------------------------------------------
      // For Clean Image and Clean Link, the response should be back to the client
      // if the sanitization was successful.
      ///--------------------------------------------------------
      case "clean-image":
      case "clean-link":
        if (statusSanitize.status == 200)
          return NextResponse.json({
            status: 200,
            message: "Data sanitized successfully",
          });
        break;
      ///--------------------------------------------------------
      // Playbok save
      ///--------------------------------------------------------
      case "playbook-save":
        dataApiHub = statusSanitize.message as dataType;
        break;
      case "post":
        formData.append("session", sessionId || "");

        dataApiHub = formData;

        type = type;
      default:
        dataApiHub = dataApiHub;
        break;
    }
    ///-----------------------------------------------
    /// Redirect the request to the apiRoutes endpoints
    ///-----------------------------------------------

    const response = await apiRoutes({
      token: token,
      data: dataApiHub,
      type: type,
    });

    const jsonResponse = await response.json();
    ///-----------------------------------------------
    /// From api/post return the body.
    ///-----------------------------------------------
    if (jsonResponse.message === "Data saved successfully") {
      const body = jsonResponse.body;
      return NextResponse.json({
        status: jsonResponse.status,
        message: "Data saved successfully",
        body: body,
      });
      ///-----------------------------------------------
      /// From api/search return the meta.
      ///-----------------------------------------------
    } else if (jsonResponse.message === "Data found successfully") {
      const body = jsonResponse.body;
      return NextResponse.json({
        status: jsonResponse.status,
        message: "Data found successfully",
        body: body,
      });
    } else {
      return NextResponse.json({
        status: jsonResponse.status,
        message: jsonResponse.message,
      });
    }
  } catch (error) {
    return NextResponse.json({
      status: 500,
      message: `Internal Server Error: ${error}`,
    });
  }
}
