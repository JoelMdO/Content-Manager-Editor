import errorAlert from "../../../../../alerts/error";
import { FormDataItem } from "../../type/formData";
//

//
const createFormData = async (type: string, data: FormDataItem[]) => {
  ///========================================================
  // Function to create the form data to be sent to the hub
  // the form data will be mainly to transfer images to the api.
  ///========================================================

  const formData = new FormData();
  const newData = data;
  function getContentByType(type: string): unknown {
    const item = newData.find((item: FormDataItem) => item.type === type);
    // Check if item has 'content' property
    if (item && "content" in item) {
      return (item as { content: unknown }).content;
    }
    return "";
  }

  const title = JSON.stringify(getContentByType("title"));
  const id = JSON.stringify(getContentByType("id"));
  const article = JSON.stringify(getContentByType("body"));
  const section = JSON.stringify(getContentByType("section"));
  const dbName = JSON.stringify(getContentByType("dbName"));
  const es_title = JSON.stringify(getContentByType("es-title"));
  const es_article = JSON.stringify(getContentByType("es-body"));
  const es_section = JSON.stringify(getContentByType("es-section"));
  //
  //
  formData.append("title", title);
  formData.append("id", id);
  formData.append("body", article);
  formData.append("type", type);
  formData.append("section", section);
  formData.append("dbName", dbName);
  formData.append("es-title", es_title);
  formData.append("es-body", es_article);
  formData.append("es-section", es_section);
  //
  //Filter if any image on the data

  if (type !== "translate") {
    const imagePromises = data
      .filter(
        (
          item
        ): item is {
          type: "image";
          imageId: string;
          fileName: string;
          blobUrl: string;
        } => item.type === "image"
      )
      .map(async (item) => {
        try {
          const blob = await (await fetch(item.blobUrl)).blob(); // Convert Base64 back to Blob
          const file = new File([blob], item.imageId, { type: blob.type });

          formData.append(`image`, file);
        } catch (error) {
          errorAlert("", "", error);
        }
      });

    await Promise.all(imagePromises);
  } else {
    //------------------------------------------
    // Purpose: For "translate" type, filter all image items and append their content as strings to formData.
    // Note: This approach appends the image data as a string (likely a base64 or similar representation).
    // Make sure the backend expects images as strings for this case.
    //------------------------------------------
    data
      .filter((item: FormDataItem) => item.type === "image")
      .forEach((item) => {
        // Get the image content as string (e.g., base64 or identifier)
        const imageContent = JSON.stringify(getContentByType("image"));
        formData.append("image", imageContent);
      });
  }

  return formData;
};

export default createFormData;
