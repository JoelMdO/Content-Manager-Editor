"server-only";
import { NextResponse } from "next/server";
import sessionCheck from "../authentication/session_check";
import { useSession } from "next-auth/react";
import { getToken } from "next-auth/jwt";
import createFormData from "../../utils/dashboard/images_edit/create_formData";

const apiRoutes = async (postData: any): Promise<any> => {
  ///=============================================================
  /// Function to redirect the api endpoints, includes the fecthing
  ///=============================================================
  const { token, data, type } = postData;
  console.log("token at apiRoutes:", token);
  console.log('"data at apiRoutes:', data);

  const url = process.env.NEXT_PUBLIC_url_api;
  let endPoint: string = "";
  let body: string | FormData = new FormData();
  let headers: HeadersInit = {};
  let credentials: RequestCredentials = "omit";
  let sessionId: string = "";
  //
  try {
    ///-----------------------------------------------
    /// Api endpoints, per type.
    ///-----------------------------------------------

    switch (type) {
      // //## SANITIZE LINK
      // case "clean-link":
      //   endPoint = "sanitize";
      //   body = JSON.stringify(data);
      //   headers["Content-Type"] = "application/json";
      //   break;
      // //## SANITIZE IMAGE
      // case "clean-image":
      //   endPoint = "sanitize";
      //   body.append("file", data);
      //   break;
      //## POST
      case "post":
        endPoint = type;
        console.log('"doing type post:', data);

        // const formData = await createFormData(type, data);
        // console.log('"formData at apiRoutes:', formData);

        body = data;
        headers["Authorization"] = `Bearer ${token}`;
        credentials = "include";
        break;

      //   ///-----------------------------------------------
      //   /// Verify sessionId if its valid through the sessionCheck function
      //   ///-----------------------------------------------
      //   sessionId = data.get("session");
      //   const response = await sessionCheck(sessionId);
      //   if (response.status !== 200) {
      //     return NextResponse.json({
      //       status: 401,
      //       message: "Reauthentication failed",
      //     });
      //   }
      //   ///-----------------------------------------------
      //   /// Check if data is already FormData
      //   ///-----------------------------------------------
      //   if (data instanceof FormData) {
      //     data.append("userId", response.user!);
      //     data.delete("session");
      //     body = data;
      //   } else {
      //     // Convert data to FormData if it's not already
      //     body = new FormData();
      //     for (const key in data) {
      //       if (data.hasOwnProperty(key && key != "session")) {
      //         body.append(key, data[key]);
      //       }
      //       body.append("userId", response.user!);
      //     }
      //   }
      //   credentials = "include";
      //   break;
      //## AUTH THROUGH EMAIL AND FIREBASE
      case "sign-in-by-email":
        endPoint = "signin";
        body = JSON.stringify(data);
        console.log("body at auth", body);

        headers["Content-Type"] = "application/json";
        credentials = "include";
        break;
      //## LOGOUT
      // case "logout":
      //   endPoint = "logout";
      //   ///-----------------------------------------------
      //   /// Verify sessionId if its valid through the sessionCheck function
      //   ///-----------------------------------------------
      //   sessionId = data;
      //   const responseSessionCheck = await sessionCheck(sessionId);
      //   const auth = { user: responseSessionCheck.user!, sessionId: sessionId };
      //   body = JSON.stringify(auth);
      //   headers["Content-Type"] = "application/json";
      //   credentials = "include";
      //   break;
      //## PLAYBOOK SAVE
      case "playbook-save":
        endPoint = "save";
        console.log('"doing type playbook-save:');

        ///-----------------------------------------------
        /// Verify sessionId if its valid through the sessionCheck function
        ///-----------------------------------------------
        // sessionId = data.sessionId;
        // const responsePlay = await sessionCheck(sessionId);
        // if (responsePlay.status !== 200) {
        //   console.log("data at playbook-save", data);
        //   console.log("doing save at api routes");
        //   return NextResponse.json({
        //     status: 401,
        //     message: "Reauthentication failed",
        //   });
        // }

        body = JSON.stringify(data);
        headers["Content-Type"] = "application/json";
        headers["Authorization"] = `Bearer ${token}`;
        credentials = "include";
        break;
      //## PLAYBOOK SEARCH
      case "playbook-search":
      case "playbook-search-bar":
      case "playbook-search-category":
        body = JSON.stringify(data);
        headers["Content-Type"] = "application/json";
        headers["Authorization"] = `Bearer ${token}`;
        endPoint = "search";
        credentials = "include";
        break;
      //   ///-----------------------------------------------
      //   /// Verify sessionId if its valid through the sessionCheck function
      //   ///-----------------------------------------------
      //   sessionId = data.sessionId;
      //   const responsePlaySearch = await sessionCheck(sessionId);
      //   if (responsePlaySearch.status !== 200) {
      //     return NextResponse.json({
      //       status: 401,
      //       message: "Reauthentication failed",
      //     });
      //   }

      //   body = JSON.stringify(postData);
      //   headers["Content-Type"] = "application/json";
      //   credentials = "include";
      //   break;
      default:
        return { status: 205, message: "type not found" };
    }
    ///-----------------------------------------------
    /// Call the corresponding API endpoint
    ///-----------------------------------------------
    console.log("calling api endpoint", `${url}/api/${endPoint}`);

    const response = await fetch(`${url}/api/${endPoint}`, {
      method: "POST",
      body: body,
      headers: headers,
      credentials: credentials,
    });
    // Wait for the JSON response
    const jsonResponse = await response.json();
    console.log("Response before json at apiRoutes:", response);
    console.log("jsonResponse at apiRoutes:", jsonResponse);

    ///-----------------------------------------------
    /// From api/auth return the sessionId.
    ///-----------------------------------------------
    // if (jsonResponse.message === "User authenticated") {
    //   console.log("jsonResponse at apiRoutes", jsonResponse);

    //   const sessionId = jsonResponse.session;
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
      console.log("doiung Else at apiRoutes:", jsonResponse);

      return NextResponse.json({
        status: jsonResponse.status,
        message: jsonResponse.message,
      });
    }
  } catch (error) {
    console.log("Error at apiRoutes:", error);

    return NextResponse.json({ status: 500, message: `error: ${error}` });
  }
};

export default apiRoutes;
