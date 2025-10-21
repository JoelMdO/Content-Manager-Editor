import { FormDataImageItem, FormDataItem } from "../../type/formData";
//

//
const createFormData = async (
  type: string,
  data: FormDataItem[] | FormDataImageItem[]
) => {
  ///========================================================
  // Function to create the form data to be sent to the hub
  // the form data will be mainly to transfer images to the api.
  ///========================================================

  const formData = new FormData();
  const newData = data;
  function getContentByType(type: string): unknown {
    const item = newData.find(
      (item: FormDataItem | FormDataImageItem) => item.type === type
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
  const dbName = JSON.stringify(getContentByType("dbName"));
  const es_title = JSON.stringify(getContentByType("es-title"));
  const es_article = JSON.stringify(getContentByType("es-body"));
  const es_section = JSON.stringify(getContentByType("es-section"));
  const summary = JSON.stringify(getContentByType("summary"));
  const es_summary = JSON.stringify(getContentByType("es-summary"));
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
  formData.append("summary", summary);
  formData.append("es-summary", es_summary);

  //
  //Filter if any image on the data

  if (type !== "translate") {
    //console.log('"type is not translate" is', type);

    function getAllImagesFromSessionStorage() {
      const images: FormDataImageItem[] = [];
      const items = newData.filter((item: FormDataItem | FormDataImageItem) =>
        item.type.startsWith("image-")
      );
      //console.log('"items at getAllImagesFromSessionStorage"');

      for (let i = 0; i < items.length; i++) {
        const key = items[i].type;
        if (
          "base64" in items[i] &&
          typeof key === "string" &&
          key.startsWith("image-")
        ) {
          const base64 = (items[i] as FormDataImageItem).base64;
          const blobUrl = (items[i] as FormDataImageItem).blobUrl;
          const fileName = (items[i] as FormDataImageItem).fileName;
          const imageId = (items[i] as FormDataImageItem).imageId;
          //console.log("imageId", imageId);

          images.push({
            type: key as `image-${string}`,
            base64: base64 ?? "",
            blobUrl: blobUrl ?? "",
            fileName: fileName ?? "",
            imageId: imageId ?? "",
          });
        }
      }

      return images;
    }
    const images = JSON.stringify(getAllImagesFromSessionStorage());
    formData.append("images", images);

    // await Promise.all(imagePromises);
  } else {
    //------------------------------------------
    // Purpose: For "translate" type, filter all image items and append their content as strings to formData.
    // Note: This approach appends the image data as a string (likely a base64 or similar representation).
    // Make sure the backend expects images as strings for this case.
    //------------------------------------------
    data
      .filter((item: FormDataItem) => item.type.startsWith("image-"))
      .forEach((item) => {
        // Get the image content as string (e.g., base64 or identifier)
        if (
          "base64" in item &&
          typeof item.type === "string" &&
          item.type.startsWith("image-")
        ) {
          const imageContent =
            JSON.stringify(getContentByType(item.base64)) ?? "";
          formData.append(item.type, imageContent);
        }
      });
  }

  return formData;
};

export default createFormData;
