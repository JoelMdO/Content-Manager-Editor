"server-only";
import apiRoutes from "../../../services/api/api_routes";
import { NextRequest, NextResponse } from "next/server";
import { sanitizeData } from "../../../utils/sanitize/data/sanitize_data";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/nextauth/auth";
import { getToken } from "next-auth/jwt";
import createLog from "../../../services/authentication/create_log";

export async function POST(req: Request): Promise<any> {
  //
  let dataApiHub: string | File | {} = "";
  let type: string = "clean-image";
  let token: string | undefined = "";
  let sessionId: string | undefined = "";
  let formData: FormData = new FormData();
  console.log('"POST request at /api/hub/route.ts"');
  ///___________________________________________________
  /// Check the content type to see if the request
  /// comes with file or only text
  ///___________________________________________________
  try {
    const contentType = req.headers.get("Content-Type") || "";
    console.log("Content-Type at playbook:", contentType);

    if (contentType.includes("application/json")) {
      console.log('"Content-Type" includes "application/json"');
      const getDataAtApiHub = await req.json();
      dataApiHub = getDataAtApiHub.data;
      console.log("dataApiHub", dataApiHub);

      type = getDataAtApiHub.type;
      dataApiHub = dataApiHub;
    } else {
      console.log('"Content-Type" does not include "application/json"');
      /// For request including files.
      formData = await req.formData();
      type = formData.get("type") as string;
      console.log("type at api/hub/route.ts:", type);
      console.log("formData at api/hub/route.ts:", formData);

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
    // Check if the request is authenticated
    ///--------------------------------------------------------
    console.log("doing next sptes");

    const session = await getServerSession(authOptions);
    console.log("session at api/hub:", session);
    if (!session && type !== "sign-in-by-email") {
      return NextResponse.json({
        status: 401,
        message: "User without a valid session",
      });
    }

    if (session && type !== "sign-in-by-email") {
      token = createLog(session?.user.id);
      console.log("token at api/hub:", token);
    }

    if (session && type === "post") {
      sessionId = session.user?.id;
      console.log("Firebase UID:", sessionId);
    }

    console.log('continue with "type":', type);

    ///-----------------------------------------------
    /// Sanitize the data received from the request
    ///-----------------------------------------------
    console.log("dataApiHub at api/hub/route.ts:", dataApiHub);
    console.log("data type of", typeof dataApiHub);

    const statusSanitize = await sanitizeData(dataApiHub, type);
    console.log('"statusSanitize at api/hub/route.ts:', statusSanitize);

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
        dataApiHub = statusSanitize.message;
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
          console.log('"dataApiHub at sign-in-by-email:', dataApiHub);
        } else {
          return NextResponse.json({
            status: 400,
            message: "Invalid sanitized data for sign-in-by-email",
          });
        }
        break;
      case "post":
        console.log('appending the "session" to the formData');
        formData.append("session", sessionId || "");
        console.log("data at post at api/hub", formData);

        dataApiHub = formData;
        console.log("dataApiHub at post after session:", dataApiHub);
        type = type;
      default:
        dataApiHub = dataApiHub;
        break;
    }
    ///--------------------------------------------------------
    ///### LOGOUT
    // case "logout":
    //   //Retrieve the authorization session token from the headers
    //   sessionId = req.headers.get("Authorization")?.split(" ")[1] || "";
    //   if (sessionId) {
    //     dataApiHub = sessionId;
    //   } else {
    //     return NextResponse.json({
    //       status: 401,
    //       message: "User without a valid session",
    //     });
    //   }
    //   type = type;
    //   break;
    // case "playbook-save":
    //Retrieve the authorization session token from the headers
    // sessionId = req.headers.get("Authorization")?.split(" ")[1] || "";
    // if (sessionId) {
    // dataApiHub = { cookie: cookie, data: dataApiHub };
    // } else {
    //   return NextResponse.json({
    //     status: 401,
    //     message: "User without a valid session",
    //   });
    // }
    //   type = type;
    //   break;
    // case "playbook-search":
    // case "playbook-search-bar":
    // case "playbook-search-category":
    //   //Retrieve the authorization session token from the headers
    //   sessionId = req.headers.get("Authorization")?.split(" ")[1] || "";
    //   if (sessionId) {
    //     // Sanitize data.
    //     let dataToSanitize: string | Object;
    //     if (type === "playbook-search") {
    //       dataToSanitize = type;
    //     } else {
    //       dataToSanitize = dataApiHub;
    //     }
    //     const dataSanitizeResponse = sanitizeData(dataToSanitize, "text");
    //     if ((await dataSanitizeResponse).status != 200) {
    //       return NextResponse.json({
    //         status: 403,
    //         message: "Unauthorized",
    //       });
    //     }
    //     if (type === "playbook-search") {
    //       dataApiHub = { sessionId: sessionId, data: "", type: type };
    //     } else {
    //       dataApiHub = { sessionId: sessionId, data: dataApiHub, type: type };
    //     }
    //   } else {
    //     return NextResponse.json({
    //       status: 401,
    //       message: "User without a valid session",
    //     });
    //   }
    //   type = type;
    //   dataApiHub = dataApiHub;
    //   break;
    // case "auth-middleware":
    //   sessionId = req.headers.get("Authorization")?.split(" ")[1] || "";

    //   if (sessionId) {
    //     dataApiHub = { sessionId: sessionId, data: dataApiHub };
    //   } else {
    //     return NextResponse.json({
    //       status: 401,
    //       message: "User without a valid session",
    //     });
    //   }
    //   type = "auth";
    //   dataApiHub = dataApiHub;
    //   break;
    // default:
    //   dataApiHub = dataApiHub;
    //   type = type;
    //   break;
    //}
    // } else {
    //   console.log('"Content-Type" does not include "application/json"');

    //   ///-----------------------------------------------
    //   /// For request including files.
    //   ///-----------------------------------------------
    //   const formData = await req.formData();
    //   ///-----------------------------------------------
    //   /// Check the type of route the api will take from
    //   /// typeofAction (Post, Logout, Clean-File) for
    //   /// authentication the type of content is as json
    //   ///-----------------------------------------------
    //   const typeOfAction = formData.get("type");
    // const typeSanitizeResponse = sanitizeData(typeOfAction, "text");
    // if ((await typeSanitizeResponse).status != 200) {
    //   return NextResponse.json({ status: 403, message: "Unauthorized" });
    // }
    // switch (typeOfAction) {
    //   ///#### POST (Save)
    //   case "post":
    //     //Retrieve the authorization session token from the headers
    //     const session = req.headers.get("Authorization")?.split(" ")[1];

    //     if (session) {
    //       formData.append("session", session);
    //     } else {
    //       return NextResponse.json({
    //         status: 401,
    //         message: "User without a valid session",
    //       });
    //     }
    //     /// Sanitize the data
    //     const responseAfterSanitize = sanitizeData(formData, "post");
    //     console.log("responseAfterSanitize", responseAfterSanitize);

    //     if ((await responseAfterSanitize).status === 200) {
    //       dataApiHub = formData;
    //       type = "post";
    //     } else {
    //       return NextResponse.json({
    //         status: 401,
    //         message: "Not valid data",
    //       });
    //     }
    //     break;
    ///### LOGOUT
    // case "logout":
    //   //Retrieve the authorization session token from the headers
    //   const sessionIdForLougout = req.headers
    //     .get("Authorization")
    //     ?.split(" ")[1];
    //   if (sessionIdForLougout) {
    //     dataApiHub = sessionIdForLougout;
    //   } else {
    //     return NextResponse.json({
    //       status: 401,
    //       message: "User without a valid session",
    //     });
    //   }
    //   type = typeOfAction;
    //   break;
    ///### SANITIZE (clean-image).
    // default:
    //   const file = formData.get("file");
    //   if (!(file instanceof File)) {
    //     return NextResponse.json({
    //       status: 400,
    //       message: "No file uploaded",
    //     });
    //   }
    //   dataApiHub = file;
    //   type = "clean-image";
    //   break;
    // }
    //}
    ///-----------------------------------------------
    /// Redirect the request to the apiRoutes endpoints
    ///-----------------------------------------------
    console.log(
      '"before Api routes dataApiHub at api/hub/route.ts:',
      dataApiHub
    );
    console.log('"type at api/hub/route.ts:', type);
    console.log('"token at api/hub/route.ts:', token);

    const response = await apiRoutes({
      token: token,
      data: dataApiHub,
      type: type,
    });
    console.log("Response from apiRoutes:", response);

    const jsonResponse = await response.json();
    // ///-----------------------------------------------
    // /// Response from api/auth return the sessionId.
    // ///-----------------------------------------------
    // if (jsonResponse.message === "User authenticated") {
    //   const sessionId = jsonResponse.sessionId;
    //   return NextResponse.json({
    //     status: jsonResponse.status,
    //     message: "User authenticated",
    //     sessionId: sessionId,
    //   });
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
