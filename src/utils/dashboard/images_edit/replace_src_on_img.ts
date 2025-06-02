const replaceSrcWithImagePlaceholders = (
  htmlContent: string,
  images: Array<{ url: string }>
) => {
  const newHtmlContent = htmlContent.replace(
    /<img src="{image_url_placeholder}">[\s\S]*?<p[^>]*>(.*?)<\/p>/g,
    (match, filename) => {
      // Trim filename and replace spaces with underscores

      const cleanedFilename = filename
        .trim()
        .replace(/\s+/g, "_")
        .replace(/^\d{2}-\d{2}-\d{2}-/, ""); // Remove date prefix

      // Find the matching image URL
      const matchingImage = images.find((image) => {
        const urlFilename = image.url.split("/").pop();
        return urlFilename?.includes(cleanedFilename.replace(".png", ""));
      });

      if (matchingImage) {
        return `<img src="${matchingImage.url}">`;
      }
      // If no match found, return the original <img> tag
      return `<img src="{image_url_placeholder}">`;
    }
  );

  if (!newHtmlContent.trim().startsWith("<div>")) {
    return `<div>${newHtmlContent}</div>`;
  } else {
    return newHtmlContent;
  }
};

export default replaceSrcWithImagePlaceholders;
