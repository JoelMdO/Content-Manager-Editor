const replaceSrcWithImagePlaceholders = (
  htmlContent: string
  // images: Array<{ url: string; fileId: string }>
) => {
  ///--------------------------------------------------------
  // Check if the article has images
  ///--------------------------------------------------------
  const dbName = sessionStorage.getItem("db");
  const localArticle = localStorage.getItem(`draft-articleContent-${dbName}`);
  const articleContent = JSON.parse(localArticle!);
  const images = articleContent.filter((item: any) =>
    item.type.startsWith("image")
  );
  console.log('"images at replaceSrcWithImagePlaceholders"', images);
  console.log('"htmlContent at replaceSrcWithImagePlaceholders"', htmlContent);
  const imagePattern =
    /!\[([^\]]+)\]\(\{src_([^\}]+)\}\)(?:\s*<!--\s*width="([^"]*)"\s*height="([^"]*)"\s*-->)?/g;
  const hasImagePlaceholders = imagePattern.test(htmlContent);
  console.log(
    '"hasImagePlaceholders at replaceSrcWithImagePlaceholders"',
    hasImagePlaceholders
  );

  //
  if (hasImagePlaceholders !== false) {
    console.log('"hasImagePlaceholders"', hasImagePlaceholders);
    let newHtmlContent: string = htmlContent;
    ///--------------------------------------------------------
    // Replace image placeholders with actual image sourcesqeioc
    ///--------------------------------------------------------
    images.forEach((image: any) => {
      const imgSource = image.base64 || image.blobUrl;
      if (imgSource) {
        const imageIdentifier = image.imageId || image.id;
        // console.log("Dashboard editor trying to replace image:", {
        //   imageIdentifier,
        //   contentHasId: htmlContent.includes(imageIdentifier),
        // });

        newHtmlContent = newHtmlContent.replace(
          imagePattern,
          `![${imageIdentifier}](${imgSource})`
        );
      }
    });
    ///

    // if (!newHtmlContent.trim().startsWith("<div>")) {
    //   return `<div>${newHtmlContent}</div>`;
    // } else {
    console.log(
      '"newHtmlContent at replaceSrcWithImagePlaceholders"',
      newHtmlContent
    );
    console.log(
      '"Returning newHtmlContent after Parse Images"',
      newHtmlContent
    );

    return newHtmlContent;
    //}
  } else {
    ///--------------------------------------------------------
    // If no images, just ensure content is wrapped in <div>
    ///--------------------------------------------------------
    console.log('"No image placeholders found"');
    return htmlContent;
    // return !htmlContent.trim().startsWith("<div>")
    //   ? `<div>${htmlContent}</div>`
    //   : htmlContent;
  }
};

export default replaceSrcWithImagePlaceholders;
