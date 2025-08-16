const replaceSrcWithImagePlaceholders = (
  htmlContent: string,
  images: Array<{ url: string; fileId: string }>
) => {
  const regex =
    /<img src="{image_url_placeholder}">[\s\S]*?<p[^>]*>(.*?)<\/p>/g;
  const matches = htmlContent.match(regex);
  const newHtmlContent = htmlContent.replace(
    /<img src="{image_url_placeholder}">[\s\S]*?<p[^>]*>(.*?)<\/p>/g,
    (match, filename) => {
      // Trim filename and replace spaces with underscores

      // const cleanedFilename = filename
      //   .trim()
      //   .replace(/\s+/g, "_")
      //   .replace(/^\d{2}-\d{2}-\d{2}-/, ""); // Remove date prefix

      // // Find the matching image URL

      const matchingImage = images.find((image) => {
        // const urlFilename = image.url.split("/").pop();
        const urlFilename = image.fileId;

        // return urlFilename?.includes(cleanedFilename.replace(".png", ""));
        return urlFilename === filename;
      });


      if (matchingImage) {
        return `<img src="${matchingImage.url}">`;
      }
      // If no match found, return the original <img> tag
      return `<img src="{image_url_placeholder}">`;
    }
  );

  if (!newHtmlContent.trim().startsWith("<div>")) {
      "newHtmlContent after replace at trims before div",
      newHtmlContent
    );

    return `<div>${newHtmlContent}</div>`;
  } else {
    return newHtmlContent;
  }
};

export default replaceSrcWithImagePlaceholders;
