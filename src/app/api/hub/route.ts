"server-only";
import apiRoutes from "../../../services/api/api_routes";
import { NextRequest, NextResponse } from "next/server";
import { sanitizeData } from "../../../utils/sanitize/data/sanitize_data";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/nextauth/auth";
import createLog from "../../../services/authentication/create_log";
import { dataType } from "@/types/dataType";
import { getToken } from "next-auth/jwt";

export async function POST(req: NextRequest): Promise<NextResponse> {
  //
  let dataApiHub: dataType = "";
  let type: string = "clean-image";
  let token: string | undefined = "";
  let nextAuthToken: string | undefined = "";
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
      console.log("type at api/hub with json:", type);
      console.log('"dataApiHub at api/hub with json":', dataApiHub);
    } else {
      /// For request including files.
      formData = await req.formData();
      type = formData.get("type") as string;

      if (type !== "post" && type !== "translate") {
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
    // Check if the request is authenticated
    ///--------------------------------------------------------
    const session = await getServerSession(authOptions);
    console.log('"session at api/hub":', session);

    if (!session && type !== "sign-in-by-email") {
      return NextResponse.json({
        status: 401,
        message: "User without a valid session",
      });
    }

    if (session && type !== "sign-in-by-email") {
      token = createLog(session?.user.id);
    }

    if (
      (session && type === "post") ||
      (session && type === "translate") ||
      (session && type === "summary")
    ) {
      console.log("type at api/hub with session:", type);
      sessionId = session.user?.id;
      console.log("sessionId at api/hub with session:", sessionId);
    }

    ///-----------------------------------------------
    /// Sanitize the data received from the request
    ///-----------------------------------------------

    const statusSanitize = await sanitizeData(dataApiHub, type);
    console.log('"statusSanitize at api/hub":', statusSanitize);

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
      ///--------------------------------------------------------
      // Sign in by email
      ///--------------------------------------------------------
      case "sign-in-by-email":
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
        break;
      case "post":
        formData.append("session", sessionId || "");
        dataApiHub = formData;
        type = type;
        const nextToken = await getToken({
          req: req,
          secret: process.env.NEXTAUTH_SECRET,
        });
        nextAuthToken = nextToken?.accessToken;
        break;
      case "translate":
        formData.append("session", sessionId || "");
        dataApiHub = formData;
        type = type;
        const next = await getToken({
          req: req,
          secret: process.env.NEXTAUTH_SECRET,
        });
        nextAuthToken = next?.accessToken;

        if (!nextAuthToken) {
          return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        break;
      case "summary":
        console.log("doing summary at api/hub");
        console.log("dataApiHub", dataApiHub);

        dataApiHub = dataApiHub;
        type = type;
        const nextSummary = await getToken({
          req: req,
          secret: process.env.NEXTAUTH_SECRET,
        });
        nextAuthToken = nextSummary?.accessToken;

        if (!nextAuthToken) {
          return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        break;
      default:
        dataApiHub = dataApiHub;
        break;
    }
    ///-----------------------------------------------
    /// Redirect the request to the apiRoutes endpoints
    ///-----------------------------------------------

    const response = await apiRoutes({
      token: token,
      JWT: nextAuthToken,
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
        message: jsonResponse.message,
        body: body,
      });
    }
    ///-----------------------------------------------
    /// From api/translate return the body.
    ///-----------------------------------------------
    if (
      jsonResponse.message === "Data translated successfully" ||
      jsonResponse.message === "Data summarized successfully" ||
      jsonResponse.message === "Markdown converted successfully"
    ) {
      const body = jsonResponse.body;
      // const sessionStorageBody = jsonResponse.sessionStorageBody;

      return NextResponse.json({
        status: jsonResponse.status,
        message: jsonResponse.message,
        body: body,
        // sessionStorageBody: sessionStorageBody,
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
