import getImageTemporally from "./get_img_temp";

const createFormData = async (type: string, data: any) => {
    console.log('data at createFormData', data);
    const formData = new FormData();
    const title = JSON.stringify(data.find((item: any) => item.type === "title"));
    const id = JSON.stringify(data.find((item: any)=> item.type === "id"));
    const article = JSON.stringify(data.find((item: any)=> item.type === "body"));
    const italic = JSON.stringify(data.find((item: any)=> item.type ===  "italic"));
    const bold = JSON.stringify(data.find((item: any)=> item.type ===  "bold"));
    formData.append('title', title);
    formData.append('id', id);
    formData.append('article', article);
    formData.append('type', type);
    formData.append('italic', italic);
    formData.append('bold', bold);
    const imagePromises = data.filter((item: any) => item.type === "image") // Filter images only
    .map(async (item: any) => { 
        console.log('📸 Processing image:', item.fileName);
        try {
        console.log('images gettingt them', item);
        console.log('images name', item.fileName);
        const response = await getImageTemporally(item.fileName);
            if ((response as { file: File }).file instanceof File) {
                formData.append(`image`, (response as { file: File }).file);
                console.log("From getImageTemporally: Image added to formData:", (response as { file: File }).file.name);
            } else {
                console.warn("⚠️ From getImageTemporally: Retrieved data is not a File:", response);
            }
        } catch (error) {
            console.log("Error retrieving image:", error);
        }
    });
    await Promise.all(imagePromises);
    console.log('title at createFormData', title);
    console.log('id at createFormData', id);
    console.log("All images added to FormData.");
    return formData;
}

export default createFormData;