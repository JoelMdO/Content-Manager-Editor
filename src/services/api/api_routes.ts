"server-only";
import { dataType } from "../../types/dataType";
import { postDataType } from "../../types/postData";
import { NextResponse } from "next/server";
import { fetchLlm } from "../../lib/api/llm_fetch";

const ALLOWED_ENDPOINTS: Record<string, string> = {
  post: "post",
  translate: "translate",
  summary: "summary",
  search: "search",
  markdown: "markdown",
  cleanimage: "cleanimage",
};

const apiRoutes = async (postData: postDataType): Promise<NextResponse> => {
  ///=============================================================
  /// Function to redirect the api endpoints, includes the fecthing
  ///=============================================================
  const { JWT, token, data, type, signal } = postData;
  const url = process.env.INTERNAL_APP_URL;
  let endPoint: string = "";
  let body: dataType | string | FormData = new FormData();
  const headers: HeadersInit = {};
  let credentials: RequestCredentials = "omit";
  let abortSignal: AbortSignal | undefined = undefined;
  //
  try {
    ///-----------------------------------------------
    /// Api endpoints, per type.
    ///-----------------------------------------------
    console.log("Data at api/routes", postData);
    const resolvedEndPoint = ALLOWED_ENDPOINTS[type];
    if (!resolvedEndPoint) {
      return NextResponse.json({
        status: 400,
        message: "Unsupported request type",
      });
    }

    switch (type) {
      //## POST
      case "post":
        console.log("doing POST AT API/ROUTES after sanitize");
        console.log("Token at api/routes post", token);
        endPoint = resolvedEndPoint;
        body = data as FormData;
        body.append("token", token || "");
        headers["Authorization"] = `Bearer ${token}`;
        credentials = "include";
        abortSignal = signal;
        break;
      case "translate":
        console.log("doing TRANSLATE AT API/ROUTES after sanitize");
        endPoint = resolvedEndPoint;
        body = data as FormData;
        body.append("token", JWT || "");
        headers["Authorization"] = `Bearer ${JWT}`;
        credentials = "include";
        abortSignal = signal;
        break;
      case "summary":
        endPoint = resolvedEndPoint;
        const mergedData = { data, token: JWT || "" };
        //console.log("doing summary at api/routes, mergedData:", mergedData);
        body = JSON.stringify(mergedData); // Fix: stringify the data for JSON body
        headers["Content-Type"] = "application/json";
        console.log("JWT at api/routes summary", JWT);
        headers["Authorization"] = `Bearer ${JWT}`;
        credentials = "include";
        abortSignal = signal;
        break;
      case "markdown":
        endPoint = resolvedEndPoint;
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
    const targetUrl = `${url}/api/${endPoint}`;
    console.error("[SAVE_FORWARD_V4]", { type, targetUrl });
    console.log("api_routes: calling backend ->", targetUrl, {
      headers,
      credentials,
      endPoint,
    });

    let response;

    try {
      switch (type) {
        case "translate":
        case "summary":
          response = await fetchLlm(targetUrl, {
            method: "POST",
            body: body,
            headers: headers,
            credentials: credentials,
            signal: abortSignal,
          });
          break;
        default:
          response = await fetch(targetUrl, {
            method: "POST",
            body: body,
            headers: headers,
            credentials: credentials,
            signal: abortSignal,
          });
      }
    } catch (err) {
      console.error("api_routes: fetch failed", err);
      return NextResponse.json({ status: 500, message: `error: ${err}` });
    }
    // Log status and attempt to parse JSON response
    console.log("api_routes: backend response status", response.status);
    console.log("api_routes: backend response message", response);
    let jsonResponse: { status: number; message: string; body?: unknown };
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
