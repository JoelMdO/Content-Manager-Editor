import { getServerSession } from "next-auth";
import createFormData from "../../utils/dashboard/images_edit/create_formData";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const callHub = async (
  type: string,
  data?: any
): Promise<{
  status: number;
  message: any;
  sessionId?: string;
  body?: any;
}> => {
  //   const session = getServerSession(authOptions);
  //   console.log("sesson", session);

  ///=============================================================
  /// Function to orchestrate the api endpoints as hub.
  ///=============================================================
  let body: FormData | string = new FormData();
  let headers: HeadersInit = {};
  let credentials: RequestCredentials = "omit";
  let sessionId: string | null = "";
  // let url: string = "api/hub";
  const url = `${process.env.NEXT_PUBLIC_url_api}/api/hub`;
  console.log("callHub type:", type);
  console.log('"callHub data:', data);
  // console.log("type === 'post':", type === "post");
  // console.log("type length:", type.length);
  // console.log("type characters:", [...type]);
  //
  ///-----------------------------------------------
  /// Build the body of the request as each one it has
  /// different structure.
  //  Once done it will redirect to the hub.
  ///-----------------------------------------------
  switch (type) {
    //## SANITIZE IMAGE

    case "clean-image":
      body.append("file", data);
      body.append("type", type);
      credentials = "include";
      break;
    //## POST
    case "post":
      console.log("doing post at callHub:", type, data);

      const formData = await createFormData(type, data);
      console.log('"formData at callHub after createFormData:', formData);

      // sessionId = sessionStorage.getItem("sessionId");
      // headers = { ...headers, Authorization: `Bearer ${sessionId}` };
      body = formData;
      credentials = "include";
      break;
      //## LOGOUTqe
      // case "logout":
      //   body = JSON.stringify({ data: "", type: type });
      //   sessionId = sessionStorage.getItem("sessionId");
      //   sessionStorage.removeItem("sessionId");
      //   headers["Content-Type"] = "application/json";
      //   headers = { ...headers, Authorization: `Bearer ${sessionId}` };
      //   break;
      //## PLAYBOOK SAVE
      // case "playbook-save":
      //   console.log('"doing type playbook-save:');

      //   body = JSON.stringify({ data: data, type: type });
      //   // sessionId = sessionStorage.getItem("sessionId");
      //   headers["Content-Type"] = "application/json";
      //   // headers = { ...headers, Authorization: `Bearer ${sessionId}` };
      //   credentials = "include";
      //   break;
      //## PLAYBOOK SEARCH
      // // When a value is typed on the search bar
      // case "playbook-search-bar":
      // // When the readPlaybook page is mounted.
      // case "playbook-search":
      // // When user searchs by category
      // case "playbook-search-category":
      //   sessionId = sessionStorage.getItem("sessionId");
      //   //
      //   if (
      //     type === "playbook-search-bar" ||
      //     type === "playbook-search-category"
      //   ) {
      //     body = JSON.stringify({ data: data, type: type });
      //   } else {
      //     body = JSON.stringify({ data: "", type: type });
      //   }
      //   //
      //   headers["Content-Type"] = "application/json";
      //   headers = { ...headers, Authorization: `Bearer ${sessionId}` };
      //   credentials = "include";
      //   break;
      // //## AUTHENTICATION CHECK
      // case "auth-middleware":
      //   sessionId = data.sessionId;
      //   body = JSON.stringify({ data: data, type: type });
      //   headers["Content-Type"] = "application/json";
      //   headers = { ...headers, Authorization: `Bearer ${sessionId}` };
      //   credentials = "include";
      //   ///--------------------------------------------------------
      //   // callHub is used to check if user is already authenticated
      //   //  so as the call is from the middleware full url is passed
      //   //  otherwise a normal api/call is send.
      //   ///--------------------------------------------------------
      //   url = `${process.env.NEXT_PUBLIC_url_api}/api/hub`;
      //   break;
      console.log("doing another type:", type);

    default:
      console.log("doing default at callHub:", type, data);
      body = JSON.stringify({ data: data, type: type });
      headers["Content-Type"] = "application/json";
      credentials = "include";
      break;
  }
  //
  try {
    const response = await fetch(url, {
      method: "POST",
      body: body,
      headers: headers,
      credentials: credentials,
    });
    const jsonResponse = await response.json();

    // ///-----------------------------------------------
    // /// From api/auth return the sessionId.
    // ///-----------------------------------------------
    // if (jsonResponse.message === "User authenticated") {
    //   const sessionId = jsonResponse.sessionId;
    //   return {
    //     status: jsonResponse.status,
    //     message: "User authenticated",
    //     sessionId: sessionId,
    //   };
    // ///-----------------------------------------------
    // /// From api/post returzzn the body.
    // ///-----------------------------------------------
    // if (jsonResponse.message === "Data saved successfully") {
    //   const body = jsonResponse.body;
    //   return {
    //     status: jsonResponse.status,
    //     message: "Data saved successfully",
    //     body: body,
    //   };
    ///-----------------------------------------------
    /// From api/search return the meta.
    ///-----------------------------------------------
    // } else if (jsonResponse.message === "Data found successfully") {
    //   const body = jsonResponse.body;
    //   return {
    //     status: jsonResponse.status,
    //     message: "Data found successfully",
    //     body: body,
    //   };
    ///--------------------------------------------------------
    // When the user is not longer authenticated
    ///--------------------------------------------------------
    // } else if (
    //   jsonResponse.message === "User not authenticated" ||
    //   jsonResponse.message === "'Failed to refresh token" ||
    //   jsonResponse.message === "Reauthentication failed"
    // ) {
    //   return { status: 401, message: jsonResponse.message };
    // } else {
    console.log("doing Else at callHub:", jsonResponse);

    return {
      status: jsonResponse.status,
      message: jsonResponse.message,
      body: jsonResponse.body,
    };
    //}
  } catch (error) {
    console.log('"Error in callHub:", error);');

    return { status: 500, message: error };
  }
};
export default callHub;
