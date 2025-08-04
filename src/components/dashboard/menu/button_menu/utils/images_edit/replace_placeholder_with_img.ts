const replacePlaceholderWithImage = (
  body: string,
  images: Array<{ url: string }>,
  tag: string
) => {
  let newHtmlContent: string = "";
  if (tag === "translate") {
    // If tag is "translate", return a placeholder with the cleaned filename
    newHtmlContent = body.replace(
      /<img[^>]*?>/gi,
      `<img src="{image_url_placeholder}">`
    );
  } else {
    newHtmlContent = body.replace(
      /<img src="{image_url_placeholder}">[\s\S]*?<p[^>]*>(.*?)<\/p>/g,
      (match, filename) => {
        // Trim filename and replace spaces with underscores
        console.log("new filename:", filename);

        const cleanedFilename = filename
          .trim()
          .replace(/\s+/g, "_")
          .replace(/^\d{2}-\d{2}-\d{2}-/, ""); // Remove date prefix
        console.log("cleanedFilename:", cleanedFilename);

        // Find the matching image URL
        const matchingImage = images.find((image) => {
          const urlFilename = image.url.split("/").pop();
          return urlFilename?.includes(cleanedFilename.replace(".png", ""));
        });
        console.log("matchingImage:", matchingImage);
        if (matchingImage) {
          return `<img src="${matchingImage.url}">`;
        }
        // If no match found, return the original <img> tag
        return `<img src="{image_url_placeholder}">`;
      }
    );
  }
  console.log("newHtmlContent:", newHtmlContent);

  // if (!newHtmlContent.trim().startsWith("<div>")) {
  //   return `<div>${newHtmlContent}</div>`;
  // } else {
  //   return newHtmlContent;
  // }
  // Ensure proper formatting with <div> and <br>
  newHtmlContent = newHtmlContent
    .split(/<div>/g) // Split by closing divs
    .map((section) => {
      const trimmedSection = section.trim();
      console.log('"trimmedSection":', trimmedSection);

      if (!trimmedSection) return ""; // Skip empty sections

      // Wrap text in <div> if not already wrapped
      if (!trimmedSection.startsWith("<div>")) {
        return `<div>${trimmedSection}</div>`;
      } else if (!trimmedSection.endsWith("</div>")) {
        return `${trimmedSection}</div>`;
      }
      console.log('"trimmedSection after wrapping":', trimmedSection);

      return trimmedSection;
    })
    .join("") // Rejoin the sections
    .replace(/<\/div><div>/g, "</div><br><div>") // Add line breaks between divs
    .replace(/<div><br><\/div>/g, "<br>") // Replace empty divs with <br>
    .replace(/<div><\/div>/g, ""); // Remove empty divs
  console.log('"newHtmlContent after formatting":', newHtmlContent);

  // Ensure the entire content is wrapped in a single <div> if needed
  if (!newHtmlContent.trim().startsWith("<div>")) {
    newHtmlContent = `<div>${newHtmlContent}</div>`;
  }

  console.log("Formatted newHtmlContent:", newHtmlContent);

  return newHtmlContent;
};

export default replacePlaceholderWithImage;
