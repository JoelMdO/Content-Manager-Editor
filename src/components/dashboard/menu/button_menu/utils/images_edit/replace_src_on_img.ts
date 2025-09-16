const replaceSrcWithImagePlaceholders = (
  htmlContent: string,
  images: Array<{ url: string; fileId: string }>
) => {
  ///--------------------------------------------------------
  // Check if the article has images
  ///--------------------------------------------------------
  const hasImagePlaceholders = /<img src="{image_url_placeholder}">/i.test(
    htmlContent
  );
  if (hasImagePlaceholders !== false) {
    console.log('"hasImagePlaceholders"', hasImagePlaceholders);

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
  } else {
    ///--------------------------------------------------------
    // If no images, just ensure content is wrapped in <div>
    ///--------------------------------------------------------
    console.log('"No image placeholders found"');

    return !htmlContent.trim().startsWith("<div>")
      ? `<div>${htmlContent}</div>`
      : htmlContent;
  }
};

export default replaceSrcWithImagePlaceholders;
