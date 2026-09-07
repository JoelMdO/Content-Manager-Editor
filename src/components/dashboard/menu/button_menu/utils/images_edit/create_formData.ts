import { FormDataImageItem, FormDataItem } from "../../type/formData";
import { blobToBase64, getBlob } from "@/lib/imageStore/imageStore";
//

//
const createFormData = async (
  type: string,
  data: FormDataItem[] | FormDataImageItem[],
) => {
  ///========================================================
  // Function to create the form data to be sent to the hub
  // the form data will be mainly to transfer images to the api.
  ///========================================================

  const formData = new FormData();
  const newData = data;
  function getContentByType(type: string): unknown {
    const item = newData.find(
      (item: FormDataItem | FormDataImageItem) => item.type === type,
    );
    // Check if item has 'content' property
    if (item && "content" in item) {
      return (item as { content: unknown }).content;
    }
    return "";
  }
  //
  const title = JSON.stringify(getContentByType("title"));
  const id = JSON.stringify(getContentByType("id"));
  const article = JSON.stringify(getContentByType("body"));
  const section = JSON.stringify(getContentByType("section"));
  // const dbName = JSON.stringify(getContentByType("dbName"));
  const dbName = JSON.stringify(sessionStorage.getItem("db") || "");
  const es_title = JSON.stringify(getContentByType("es_title"));
  const es_article = JSON.stringify(getContentByType("es_body"));
  const es_section = JSON.stringify(getContentByType("es_section"));
  const summary = JSON.stringify(getContentByType("summary"));
  const es_summary = JSON.stringify(getContentByType("es_summary"));
  //
  //
  formData.append("title", title);
  formData.append("id", id);
  formData.append("body", article);
  formData.append("type", type);
  formData.append("section", section);
  formData.append("dbName", dbName);
  formData.append("es_title", es_title);
  formData.append("es_body", es_article);
  formData.append("es_section", es_section);
  formData.append("summary", summary);
  formData.append("es_summary", es_summary);

  //
  //------------------------------------------
  // Purpose: For "translate" type, filter all image items and append their content as strings to formData.
  // Note: This approach appends the image data as a string (likely a base64 or similar representation).
  // Make sure the backend expects images as strings for this case.
  //------------------------------------------
  data
    .filter((item: FormDataItem) => item.type === "image-")
    .forEach((item) => {
      // Get the image content as string (e.g., base64 or identifier)
      if (
        "base64" in item &&
        typeof item.type === "string" &&
        item.type === "image-"
      ) {
        const imageContent =
          JSON.stringify(getContentByType(item.base64)) ?? "";
        formData.append(item.type, imageContent);
      }
    });
  // }

  return formData;
};

export default createFormData;
