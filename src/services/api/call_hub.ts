import { PlaybookMeta } from "../../components/playbook/types/plabookMeta";
import createFormData from "../../components/dashboard/menu/button_menu/utils/images_edit/create_formData";
import { FormDataItem } from "../../components/dashboard/menu/button_menu/type/formData";
import { callHubType } from "../../types/callHubType";
import { TranslateType } from "../../types/translate_type";

const callHub = async (
  type: string,
  data?: callHubType,
  abortSignal?: AbortSignal,
): Promise<{
  status: number;
  message: string | unknown;
  sessionId?: string;
  body?: PlaybookMeta[] | TranslateType | undefined;
  sessionStorageBody?: PlaybookMeta[] | TranslateType | undefined;
}> => {
  ///=============================================================
  /// Function to orchestrate the api endpoints as hub.
  ///=============================================================
  let body: FormData | string | callHubType | undefined = new FormData();
  const headers: HeadersInit = {};
  let credentials: RequestCredentials = "omit";
  const url = "/api/hub";
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
          "Invalid data type for 'clean-image'. Expected string or Blob.",
        );
      }
      body.append("type", type);
      credentials = "include";
      break;
    //## POST
    case "post":
    case "translate":
      //console.log('doing "post" at callHub, type:', type);

      const formDataItems: FormDataItem[] = Array.isArray(data)
        ? (data as FormDataItem[])
        : data !== undefined
          ? [data as FormDataItem]
          : [];

      const formData = await createFormData(type, formDataItems);
      //console.log('"formData at callHub":', formData);

      body = formData;
      credentials = "include";
      break;
    default:
      console.log("doing default at callHub, type:", type);
      //console.log('"data at callHub":', data);

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
      signal: abortSignal,
    });
    if (response.status === 413) {
      return {
        status: 413,
        message:
          "Image upload was rejected because it exceeds the server's upload limit. Please try a smaller image or contact the administrator.",
      };
    }

    let jsonResponse: { status?: number; message?: string; body?: unknown };
    try {
      jsonResponse = await response.json();
    } catch {
      return {
        status: response.status,
        message: `Request failed with status ${response.status}.`,
      };
    }
    //console.log("jsonResponse at callHub", jsonResponse);

    return {
      status: jsonResponse.status ?? response.status,
      message: jsonResponse.message,
      body: jsonResponse.body as PlaybookMeta[] | TranslateType | undefined,
    };
    //}
  } catch (error) {
    return { status: 500, message: error };
  }
};
export default callHub;
