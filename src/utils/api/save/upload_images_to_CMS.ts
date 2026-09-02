export type ImageData = {
  type: string;
  imageId: string;
  fileName: string;
  base64: string;
  url?: string;
  fileUrl?: string;
  cloudinaryUrl?: string;
};

const uploadImagesToCMS = async (images: ImageData[]) =>
  await Promise.all(
    images.map(async (image: ImageData) => {
      const url =
        process.env.URL_IMAGES_STORE || "http://proxy:80/api/articles/images/";
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Internal-Proxy-Key": process.env.PROXY_KEY || "",
          },
          body: JSON.stringify({
            type: image.type,
            image_id: image.imageId,
            file_name: image.fileName,
            base64: image.base64,
            url: image.url ?? image.fileUrl ?? image.cloudinaryUrl,
          }),
        });

        if (!response.ok) {
          const responseBody = await response.text();
          console.error("uploadImagesToCMS CMS rejected image", {
            imageId: image.imageId,
            status: response.status,
            statusText: response.statusText,
            body: responseBody.slice(0, 1000),
          });
          throw new Error(
            `Failed to upload image ${image.imageId}: ${response.status} ${response.statusText}`,
          );
        }

        return response.json();
      } catch (error) {
        console.error("uploadImagesToCMS failed", {
          imageId: image.imageId,
          error,
        });
        throw error;
      }
    }),
  );

export default uploadImagesToCMS;
