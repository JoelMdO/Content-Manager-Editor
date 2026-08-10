const uploadImagesToCMS = async (images: any) =>
  await Promise.all(
    images.map(async (image: any) => {
      console.log("image at uploadImagesToCMS", "image", image);
      const url = "http://proxy:80/api/articles/images/";
      // const url = process.env.URL_IMAGES_STORE";
      const response = await fetch(url || "", {
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

      console.log("response at uploadImagesToCMS", "response", response);
      if (!response.ok) {
        throw new Error(`Failed to upload image: ${response.statusText}`);
      }

      return response.json();
    }),
  );

export default uploadImagesToCMS;
