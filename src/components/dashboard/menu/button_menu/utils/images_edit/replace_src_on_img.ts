const replaceSrcWithImagePlaceholders = (
  htmlContent: string,
  images: Array<{ url: string; fileId: string }>
) => {
<<<<<<< HEAD
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
=======
  console.log("Images at replaceSrcWithImagePlaceholders:", images);
  console.log("htmlContent at replaceSrcWithImagePlaceholders:", htmlContent);
  const regex =
    /<img src="{image_url_placeholder}">[\s\S]*?<p[^>]*>(.*?)<\/p>/g;
  const matches = htmlContent.match(regex);
  console.log("Matches found:", matches);
  const newHtmlContent = htmlContent.replace(
    /<img src="{image_url_placeholder}">[\s\S]*?<p[^>]*>(.*?)<\/p>/g,
    (match, filename) => {
      // Trim filename and replace spaces with underscores
      console.log("Processing filename:", filename);

      // const cleanedFilename = filename
      //   .trim()
      //   .replace(/\s+/g, "_")
      //   .replace(/^\d{2}-\d{2}-\d{2}-/, ""); // Remove date prefix

      // // Find the matching image URL
      // console.log("Cleaned filename:", cleanedFilename);

      const matchingImage = images.find((image) => {
        // const urlFilename = image.url.split("/").pop();
        const urlFilename = image.fileId;
        console.log("Matching imageid:", urlFilename);

        // return urlFilename?.includes(cleanedFilename.replace(".png", ""));
        return urlFilename === filename;
      });
      console.log("Matching image:", matchingImage);

      // console.log("matchingImage url:", matchingImage!.url);

      if (matchingImage) {
        console.log("Replacing with URL:", matchingImage.url);
>>>>>>> 1295580d32457ddac461590b78b05994a943dd08
        return `<img src="${matchingImage.url}">`;
      }
      // If no match found, return the original <img> tag
      return `<img src="{image_url_placeholder}">`;
    }
  );

  if (!newHtmlContent.trim().startsWith("<div>")) {
<<<<<<< HEAD
    return `<div>${newHtmlContent}</div>`;
  } else {
=======
    console.log(
      "newHtmlContent after replace at trims before div",
      newHtmlContent
    );

    return `<div>${newHtmlContent}</div>`;
  } else {
    console.log("newHtmlContent after replace at else", newHtmlContent);
>>>>>>> 1295580d32457ddac461590b78b05994a943dd08
    return newHtmlContent;
  }
};

export default replaceSrcWithImagePlaceholders;
