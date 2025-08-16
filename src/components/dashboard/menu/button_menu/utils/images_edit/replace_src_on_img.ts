const replaceSrcWithImagePlaceholders = (
  htmlContent: string,
  images: Array<{ url: string; fileId: string }>
) => {
  const regex =
    /<img src="{image_url_placeholder}">[\s\S]*?<p[^>]*>(.*?)<\/p>/g;
  const newHtmlContent = htmlContent.replace(
    /<img src="{image_url_placeholder}">[\s\S]*?<p[^>]*>(.*?)<\/p>/g,
    (match, filename) => {
      const matchingImage = images.find((image) => {
        const urlFilename = image.fileId;
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
    return `<div>${newHtmlContent}</div>`;
  } else {
    return newHtmlContent;
  }
};

export default replaceSrcWithImagePlaceholders;
