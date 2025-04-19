import getImageTemporally from "./get_img_temp";

const createFormData = async (type: string, data: any) => {
    ///========================================================
    // Function to create the form data to be sent to the hub
    // the form data will be mainly to transfer images to the api.
    ///========================================================
    const formData = new FormData();
    const title = JSON.stringify(data.find((item: any) => item.type === "title"));
    const id = JSON.stringify(data.find((item: any)=> item.type === "id"));
    const article = JSON.stringify(data.find((item: any)=> item.type === "body"));
    const italic = JSON.stringify(data.find((item: any)=> item.type ===  "italic"));
    const bold = JSON.stringify(data.find((item: any)=> item.type ===  "bold"));
    const dbName = JSON.stringify(data.find((item: any)=> item.type ===  "dbName"));
    formData.append('title', title);
    formData.append('id', id);
    formData.append('article', article);
    formData.append('type', type);
    formData.append('italic', italic);
    formData.append('bold', bold);
    formData.append('dbName', dbName);
    //
    // Filter if any image on the data
    const imagePromises = data.filter((item: any) => item.type === "image") // Filter images only
    .map(async (item: any) => { 
        try {
        const response = await getImageTemporally(item.fileName);
            if ((response as { file: File }).file instanceof File) {
                formData.append(`image`, (response as { file: File }).file);
            } else {
            }
        } catch (error) {
        }
    });
    await Promise.all(imagePromises);
    return formData;
}

export default createFormData;