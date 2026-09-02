const replaceSrcWithImagePlaceholdersAtPost = (
  htmlContent: string,
  images: { url: string; fileId: string }[],
) => {
  // const regex =
  //   /<img src="{image_url_placeholder}">[\s\S]*?<p[^>]*>(.*?)<\/p>/g;
  const newHtmlContent = htmlContent.replace(
    /<img\s+src="\/media[^"]*">[\s\S]*?<p[^>]*>([\s\S]*?)<\/p>/g,
    (match, filename) => {
      const matchingImage = images.find((image) => {
        //console.log(
        //   '"Matching image filename at replaceSrcWithImagePlaceholdersAtPost"'
        // );
        //console.log('"filename"', filename);
        //console.log('"image.fileId"', image.fileId);

        const urlFilename = image.fileId;
        return urlFilename === filename;
      });

      if (matchingImage) {
        return `<img src="${matchingImage.url}" alt="${filename}">`;
      }
      // If no match found, return the original <img> tag
      return `<img src="{image_url_placeholder}" alt="${filename}">`;
    },
  );

  if (!newHtmlContent.trim().startsWith("<div>")) {
    return `<div>${newHtmlContent}</div>`;
  } else {
    return newHtmlContent;
  }
};

export default replaceSrcWithImagePlaceholdersAtPost;
