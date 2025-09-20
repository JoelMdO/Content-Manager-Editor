const replaceImgWithSrc = (
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
    let newHtmlContent: string = htmlContent;
    ///--------------------------------------------------------
    // Replace image placeholders with actual image sources
    ///--------------------------------------------------------
    images.forEach((image: any) => {
      const imgSource = image.base64 || image.blobUrl;
      if (imgSource) {
        const imageIdentifier = image.imageId || image.id;
        console.log("Dashboard editor trying to replace image:", {
          imageIdentifier,
          contentHasId: htmlContent.includes(imageIdentifier),
        });

        const placeholder = new RegExp(
          `<img[^>]*src=["']{image_url_placeholder}["'][^>]*>\\s*<p[^>]*>${imageIdentifier}</p>`,
          "g"
        );
        newHtmlContent = htmlContent.replace(
          placeholder,
          `<img src="" alt="${imageIdentifier}" width="25%"/><p class="text-xs text-gray-500" style="justify-self: center;">${imageIdentifier}</p>`
        );
      }
    });
    ///
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

export default replaceImgWithSrc;
