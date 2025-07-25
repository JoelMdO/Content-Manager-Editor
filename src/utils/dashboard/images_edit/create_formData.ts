import errorAlert from "../../../components/alerts/error";
import { FormDataItem } from "../../../types/formData";
import getImageTemporally from "./get_img_temp";
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
  // const bold = JSON.stringify(getContentByType("bold"));
  const dbName = JSON.stringify(getContentByType("dbName"));
  // const title = JSON.stringify(data.title);
  // const id = JSON.stringify(data.id);
  // const article = JSON.stringify(data.body);
  // const italic = JSON.stringify(data.italic);
  // const bold = JSON.stringify(data.bold);
  // const dbName = JSON.stringify(data.dbName);
  formData.append("title", title);
  formData.append("id", id);
  formData.append("article", article);
  formData.append("type", type);
  formData.append("section", section);
  // formData.append("bold", bold);
  formData.append("dbName", dbName);
  //
  //Filter if any image on the data

  const imagePromises = data
    .filter(
      (item): item is { type: "image"; fileName: string } =>
        item.type === "image"
    ) // Filter images only
    .map(async (item) => {
      try {
        const response = await getImageTemporally(item.fileName as string);
        if ((response as { file: File }).file instanceof File) {
          formData.append(`image`, (response as { file: File }).file);
        } else {
        }
      } catch (error) {
        errorAlert("", "", error);
      }
    });
  await Promise.all(imagePromises);
  return formData;
};

export default createFormData;
