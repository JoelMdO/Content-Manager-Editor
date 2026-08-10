"server-only";
import { dataType } from "../../types/dataType";
import { postDataType } from "../../types/postData";
import { NextResponse } from "next/server";

const apiRoutes = async (postData: postDataType): Promise<NextResponse> => {
  ///=============================================================
  /// Function to redirect the api endpoints, includes the fecthing
  ///=============================================================
  const { JWT, token, data, type } = postData;
  const url = process.env.NEXT_PUBLIC_url_api;
  let endPoint: string = "";
  let body: dataType | string | FormData = new FormData();
  const headers: HeadersInit = {};
  let credentials: RequestCredentials = "omit";
  //
  try {
    ///-----------------------------------------------
    /// Api endpoints, per type.
    ///-----------------------------------------------

    switch (type) {
      //## POST
      case "post":
      case "translate":
        console.log("doing post at api/routes after sanitize");
        endPoint = type;
        body = data as FormData;
        body.append("token", token || "");
        headers["Authorization"] = `Bearer ${JWT!}`;
        credentials = "include";
        break;
      case "summary":
        endPoint = type;
        const mergedData = { data, token: token || "" };
        //console.log("doing summary at api/routes, mergedData:", mergedData);
        body = JSON.stringify(mergedData); // Fix: stringify the data for JSON body
        headers["Content-Type"] = "application/json";
        headers["Authorization"] = `Bearer ${JWT!}`;
        credentials = "include";
        break;
      case "markdown":
        endPoint = type;
        body = JSON.stringify(data); // Fix: stringify the data for JSON body
        headers["Content-Type"] = "application/json";
        headers["Authorization"] = `Bearer ${JWT!}`;
        credentials = "include";
        break;
      //## PLAYBOOK
      case "playbook":
        endPoint = "playbook";
        body = JSON.stringify(data);
        headers["Content-Type"] = "application/json";
        headers["Authorization"] = `Bearer ${token}`;
        credentials = "include";
        break;
      //## PLAYBOOK SAVE
      case "playbook-save":
      case "save":
        console.log("doing save at api/routes after sanitize");
        endPoint = "save";
        body = JSON.stringify(data);
        headers["Content-Type"] = "application/json";
        headers["Authorization"] = `Bearer ${token}`;
        credentials = "include";
        break;
      //## PLAYBOOK SEARCH
      case "playbook-search":
      case "playbook-search-bar":
      case "playbook-search-category":
        body = JSON.stringify({ data: data, type: type });
        headers["Content-Type"] = "application/json";
        headers["Authorization"] = `Bearer ${token}`;
        endPoint = "search";
        credentials = "include";
        break;
      ///--------------------------------------------------------
      // Sign in by email
      ///--------------------------------------------------------
      case "sign-in-by-email":
      case "save-user":
      case "password-reset":
        endPoint =
          type === "sign-in-by-email"
            ? "auth/login"
            : type === "password-reset"
              ? "auth/reset"
              : "auth/users";
        body = JSON.stringify(data);
        headers["Content-Type"] = "application/json";
        credentials = "include";
        break;
      default:
        return NextResponse.json({ status: 205, message: "type not found" });
    }
    ///-----------------------------------------------
    /// Call the corresponding API endpoint
    ///-----------------------------------------------
    // Article saves are handled by the editor API route. They must not be sent
    // to FastAPI: FastAPI exposes translation/summary endpoints, not /api/save.
    const targetUrl =
      type === "save"
        ? `${process.env.NEXTAUTH_URL || "http://localhost:8000"}/api/save`
        : `${url}/api/${endPoint}`;
    console.error("[SAVE_FORWARD_V4]", { type, targetUrl });
    console.log("api_routes: calling backend ->", targetUrl, {
      headers,
      credentials,
      endPoint,
    });

    let response: Response;
    try {
      response = await fetch(targetUrl, {
        method: "POST",
        body: body,
        headers: headers,
        credentials: credentials,
      });
    } catch (err) {
      console.error("api_routes: fetch failed", err);
      return NextResponse.json({ status: 500, message: `error: ${err}` });
    }
    // Log status and attempt to parse JSON response
    console.log("api_routes: backend response status", response.status);
    let jsonResponse: any;
    try {
      jsonResponse = await response.json();
    } catch (parseErr) {
      const text = await response.text().catch(() => "");
      console.error(
        "api_routes: failed to parse JSON response",
        parseErr,
        text,
      );
      return NextResponse.json({
        status: 500,
        message: `error: ${parseErr}`,
        raw: text,
      });
    }
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
      //console.log("body at apiRoutes if markdown", body);

      return NextResponse.json({
        status: jsonResponse.status,
        message: jsonResponse.message,
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
    return NextResponse.json({ status: 500, message: `error: ${error}` });
  }
};

export default apiRoutes;
