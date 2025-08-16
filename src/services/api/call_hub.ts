import { PlaybookMeta } from "@/types/plabookMeta";
import createFormData from "../../utils/dashboard/images_edit/create_formData";
import { FormDataItem } from "@/types/formData";
import { callHubType } from "@/types/callHubType";

const callHub = async (
  type: string,
  data?: callHubType
): Promise<{
  status: number;
  message: string | unknown;
  sessionId?: string;
  body?: PlaybookMeta[] | undefined;
}> => {
  ///=============================================================
  /// Function to orchestrate the api endpoints as hub.
  ///=============================================================
  let body: FormData | string = new FormData();
  const headers: HeadersInit = {};
  let credentials: RequestCredentials = "omit";
  const url = `${process.env.NEXT_PUBLIC_url_api}/api/hub`;
  //
  ///-----------------------------------------------
  /// Build the body of the request as each one it has
  /// different structure.
  //  Once done it will redirect to the hub.
  ///-----------------------------------------------
  switch (type) {
    //## SANITIZE IMAGE
    case "clean-image":
      if (typeof data === "string" || data instanceof Blob) {
        body.append("file", data);
      } else {
        throw new Error(
          "Invalid data type for 'clean-image'. Expected string or Blob."
        );
      }
      body.append("type", type);
      credentials = "include";
      break;
    //## POST
    case "post":
    case "translate":
      console.log("doing translate at callhub", data);

      const formDataItems: FormDataItem[] = Array.isArray(data)
        ? (data as FormDataItem[])
        : data !== undefined
        ? [data as FormDataItem]
        : [];
      const formData = await createFormData(type, formDataItems);

      body = formData;
      credentials = "include";
      break;
    default:
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

    return {
      status: jsonResponse.status,
      message: jsonResponse.message,
      body: jsonResponse.body,
    };
    //}
  } catch (error) {
    return { status: 500, message: error };
  }
};
export default callHub;
