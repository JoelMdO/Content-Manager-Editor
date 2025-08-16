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
        // console.log('"doing translate at api routes', JWT!);
        console.log('"doing post at api routes', token!);
        endPoint = type;
        body = data as FormData;
        body.append("token", token || "");
        headers["Authorization"] = `Bearer ${JWT!}`;
        credentials = "include";
        break;
      // //## AUTH THROUGH EMAIL AND FIREBASE
      // case "sign-in-by-email":
      //   endPoint = "signin";
      //   body = JSON.stringify(data);
      //   headers["Content-Type"] = "application/json";
      //   credentials = "include";
      //   break;
      //## PLAYBOOK SAVE
      case "playbook-save":
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
      default:
        return NextResponse.json({ status: 205, message: "type not found" });
    }
    ///-----------------------------------------------
    /// Call the corresponding API endpoint
    ///-----------------------------------------------
    const response = await fetch(`${url}/api/${endPoint}`, {
      method: "POST",
      body: body,
      headers: headers,
      credentials: credentials,
    });
    // Wait for the JSON response
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
      // const sessionStorageBody = jsonResponse.sessionStorageBody;
      console.log("Body at apiRoutes:", body);

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
      console.log("response at apiRoutes:", jsonResponse);

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
