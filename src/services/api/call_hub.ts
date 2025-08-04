import { PlaybookMeta } from "../../components/playbook/types/plabookMeta";
import createFormData from "../../components/dashboard/menu/button_menu/utils/images_edit/create_formData";
import { FormDataItem } from "../../components/dashboard/menu/button_menu/type/formData";
import { callHubType } from "../../types/callHubType";
import { TranslateType } from "../../types/translate_type";

const callHub = async (
  type: string,
  data?: callHubType
): Promise<{
  status: number;
  message: string | unknown;
  sessionId?: string;
  body?: PlaybookMeta[] | TranslateType | undefined;
}> => {
  ///=============================================================
  /// Function to orchestrate the api endpoints as hub.
  ///=============================================================
  let body: FormData | string | callHubType | undefined = new FormData();
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
      console.log('"doing post at callhub", data);');
      console.log("data at callhub for post:", data);

      const formDataItems: FormDataItem[] = Array.isArray(data)
        ? (data as FormDataItem[])
        : data !== undefined
        ? [data as FormDataItem]
        : [];
      console.log("data at callhub:", data);
      console.log("formDataItems at callhub:", formDataItems);

      const formData = await createFormData(type, formDataItems);
      console.log("formData at callhub:", formData);

      body = formData;
      credentials = "include";
      break;
    // case "translate":
    //   console.log("doing translate at callhub", data);
    //   body = JSON.stringify(data);
    //   headers["Content-Type"] = "application/json";
    //   credentials = "include";
    //   break;
    default:
      body = JSON.stringify({ data: data, type: type });
      headers["Content-Type"] = "application/json";
      credentials = "include";
      break;
  }
  //
  try {
    console.log("calling API hub with URL:", url);

    const response = await fetch(url, {
      method: "POST",
      body: body,
      headers: headers,
      credentials: credentials,
    });
    const jsonResponse = await response.json();
    console.log("jsonResponse at callhub:", jsonResponse);

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
