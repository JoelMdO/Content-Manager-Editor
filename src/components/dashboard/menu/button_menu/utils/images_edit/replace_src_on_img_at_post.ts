const replaceSrcWithImagePlaceholdersAtPost = (
  htmlContent: string,
  image: { url: string; fileId: string },
) => {
  const escapedFileId = image.fileId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(
    `<img\\b[^>]*\\bsrc=["']\\/media\\/article_images\\/[^"']*${escapedFileId}[^"']*["'][^>]*\\/?>`,
    "gi",
  );

  console.log("Replacing image with placeholders in HTML content");

  const newHtmlContent = htmlContent.replace(
    regex,

    `<img src="${image.url}" alt="${image.fileId}"/>`,
  );

  if (!newHtmlContent.trim().startsWith("<div>")) {
    return `<div>${newHtmlContent}</div>`;
  } else {
    return newHtmlContent;
  }
};

export default replaceSrcWithImagePlaceholdersAtPost;
