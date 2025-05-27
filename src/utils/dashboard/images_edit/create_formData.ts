import getImageTemporally from "./get_img_temp";

const createFormData = async (type: string, data: any) => {
  ///========================================================
  // Function to create the form data to be sent to the hub
  // the form data will be mainly to transfer images to the api.
  ///========================================================
  console.log("data at createFormData:", data);

  const formData = new FormData();
  const newData = Array.isArray(data) ? data : Array.from(data);
  const title = JSON.stringify(
    newData.find((item: any) => item.type === "title")?.content || ""
  );
  console.log("title at createFormNewData:", title);

  const id = JSON.stringify(
    newData.find((item: any) => item.type === "id")?.content || ""
  );
  const article = JSON.stringify(
    newData.find((item: any) => item.type === "body")?.content || ""
  );
  const italic = JSON.stringify(
    newData.find((item: any) => item.type === "italic")?.content || ""
  );
  const bold = JSON.stringify(
    newData.find((item: any) => item.type === "bold")?.content || ""
  );
  const dbName = JSON.stringify(
    newData.find((item: any) => item.type === "dbName")?.content || ""
  );
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
  formData.append("italic", italic);
  formData.append("bold", bold);
  formData.append("dbName", dbName);
  //
  //Filter if any image on the data
  console.log(
    "is image?",
    data.some((item: any) => item.type === "image")
  );

  const imagePromises = data
    .filter((item: any) => item.type === "image") // Filter images only
    .map(async (item: any) => {
      try {
        const response = await getImageTemporally(item.fileName);
        if ((response as { file: File }).file instanceof File) {
          formData.append(`image`, (response as { file: File }).file);
        } else {
        }
      } catch (error) {}
    });
  await Promise.all(imagePromises);
  return formData;
};

export default createFormData;
