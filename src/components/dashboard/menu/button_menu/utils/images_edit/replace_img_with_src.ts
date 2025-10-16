const replaceImgWithSrc = (
  htmlContent: string,
  images: Array<{ url: string; fileId: string }>,
  type?: string,
  language?: string
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
    console.log("images in replaceImgWithSrc", images);

    ///--------------------------------------------------------
    // Replace image placeholders with actual image sources
    ///--------------------------------------------------------
    images.forEach((image: any) => {
      const imgSource = image.base64 || image.blobUrl || image.url;
      console.log("imgSource in replaceImgWithSrc", imgSource);

      if (imgSource) {
        let imageIdentifier = (
          image.imageId ||
          image.id ||
          image.fileId
        ).trim();
        console.log("Dashboard editor trying to replace image:", {
          imageIdentifier,
          contentHasId: htmlContent.includes(imageIdentifier),
        });
        // As the image can be stored on different date, check if the name exists in the content
        if (!htmlContent.includes(imageIdentifier)) {
          const suffixMatch = imageIdentifier.match(
            /(?:\d{2}-){3}(.*?\.webp)$/
          );
          const stableSuffix = suffixMatch ? suffixMatch[1] : imageIdentifier;
          console.log("Searching for stable suffix:", stableSuffix);

          const suffixRegex = new RegExp(
            `(\\d{2}-\\d{2}-\\d{2}-${stableSuffix})`,
            "g"
          );
          const matches = [...htmlContent.matchAll(suffixRegex)];

          if (matches.length > 0) {
            const matchedText = matches[0][1]; // capture group 1 is the text we want
            console.log("✅ Matched text:", matchedText);
            imageIdentifier = matchedText;
          } else {
            console.log(
              "⚠️ No placeholder matched using suffix:",
              stableSuffix
            );
          }
        }
        console.log("Final imageIdentifier:", imageIdentifier);
        let placeholder: RegExp;
        if (language === "es") {
          placeholder = new RegExp(
            `<img[^>]*src=["']{image_url_placeholder}["'][^>]*>\\s*(?:<p[^>]*>\\s*<\/p>\\s*)*${imageIdentifier}\\s*(?:<p[^>]*>\\s*<\/p>\\s*)*`,
            "g"
          );
        } else {
          placeholder = new RegExp(
            `<img[^>]*src=["']{image_url_placeholder}["'][^>]*>\\s*<p[^>]*>${imageIdentifier}</p>`,
            "g"
          );
        }
        switch (type) {
          case "post":
          case "html":
            console.log('"Replacing image for type post or html"');
            console.log("placeholder:", placeholder);

            newHtmlContent = newHtmlContent.replaceAll(
              placeholder,
              `<img src="${imgSource}" alt="${imageIdentifier}"/><p class="text-xs text-gray-500" style="justify-self: center;">${imageIdentifier}</p>`
            );
            ///    console.log('"newHtmlContent after replace"', newHtmlContent);

            break;
          default:
            newHtmlContent = htmlContent.replaceAll(
              placeholder,
              `<img src="" alt="${imageIdentifier}" width="25%"/><p class="text-xs text-gray-500" style="justify-self: center;">${imageIdentifier}</p>`
            );
            break;
        }
      }
    });
    // console.log('"After replacing images, newHtmlContent"', newHtmlContent);
    ///
    if (!newHtmlContent.trim().startsWith("<div>")) {
      console.log("doing if branch of newHtmlContent");

      console.log('"newHtmlContent"', newHtmlContent);
      return `<div>${newHtmlContent}</div>`;
    } else {
      console.log("doing else branch of newHtmlContent");

      //console.log('"newHtmlContent"', newHtmlContent);
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
