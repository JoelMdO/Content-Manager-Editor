"server-only";
import apiRoutes from "../../../services/api/api_routes";
import { NextRequest, NextResponse } from "next/server";
import { sanitizeData } from "../../../utils/sanitize/data/sanitize_data";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/nextauth/auth";
import createLog from "../../../services/authentication/create_log";
import { dataType } from "@/types/dataType";
<<<<<<< HEAD
import { getToken } from "next-auth/jwt";
=======
import { getToken, JWT } from "next-auth/jwt";
>>>>>>> 1295580d32457ddac461590b78b05994a943dd08

export async function POST(req: NextRequest): Promise<NextResponse> {
  //
  let dataApiHub: dataType = "";
  let type: string = "clean-image";
  let token: string | undefined = "";
  let nextAuthToken: string | undefined = "";
  let sessionId: string | undefined = "";
  let formData: FormData = new FormData();
  console.log('"Request received at API Hub"');

  ///___________________________________________________
  /// Check the content type to see if the request
  /// comes with file or only text
  ///___________________________________________________
  try {
    const contentType = req.headers.get("Content-Type") || "";

    if (contentType.includes("application/json")) {
      const getDataAtApiHub = await req.json();
      console.log("getDataAtApiHub:", getDataAtApiHub);

      dataApiHub = getDataAtApiHub.data;
      console.log("dataApiHub:", dataApiHub);

      type = getDataAtApiHub.type;
      dataApiHub = dataApiHub;
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

    if (!session && type !== "sign-in-by-email") {
      return NextResponse.json({
        status: 401,
        message: "User without a valid session",
      });
    }

    if (session && type !== "sign-in-by-email") {
      token = createLog(session?.user.id);
      console.log('"token" at API Hub:', token);
    }

    if ((session && type === "post") || (session && type === "translate")) {
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
    console.log("Type of request received at API Hub:", type);
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
        console.log("session at post on api hub:", sessionId);

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
<<<<<<< HEAD
=======
        console.log("translate at api hub", dataApiHub);
>>>>>>> 1295580d32457ddac461590b78b05994a943dd08
        formData.append("session", sessionId || "");
        dataApiHub = formData;
        type = type;
        const next = await getToken({
          req: req,
          secret: process.env.NEXTAUTH_SECRET,
        });
        nextAuthToken = next?.accessToken;
<<<<<<< HEAD
=======
        console.log("🔍 Full token object:", JSON.stringify(next, null, 2));
        console.log("🔍 Access token exists:", !!next?.accessToken);
        console.log("🔍 Access token value:", next?.accessToken);
>>>>>>> 1295580d32457ddac461590b78b05994a943dd08

        if (!nextAuthToken) {
          return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
<<<<<<< HEAD
=======
        console.log("token at callhub:", nextAuthToken);
>>>>>>> 1295580d32457ddac461590b78b05994a943dd08
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
    if (jsonResponse.message === "Data translated successfully") {
      const body = jsonResponse.body;
<<<<<<< HEAD
      // const sessionStorageBody = jsonResponse.sessionStorageBody;
=======
      const sessionStorageBody = jsonResponse.sessionStorageBody;
      console.log("sessionStorageBody at apiRoutes:", sessionStorageBody);
>>>>>>> 1295580d32457ddac461590b78b05994a943dd08

      return NextResponse.json({
        status: jsonResponse.status,
        message: jsonResponse.message,
        body: body,
<<<<<<< HEAD
        // sessionStorageBody: sessionStorageBody,
=======
        sessionStorageBody: sessionStorageBody,
>>>>>>> 1295580d32457ddac461590b78b05994a943dd08
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
