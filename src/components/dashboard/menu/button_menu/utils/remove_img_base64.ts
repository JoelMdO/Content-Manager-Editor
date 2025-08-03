const removeBase64FromImgTags = (htmlContent: string, type?: string) => {
  // Regular expression to match the base64 image src and replace it with a placeholder
  if (type === "auto-save") {
    return htmlContent
      .replace(
        /<img [^>]*src="data:image[^"]+"[^>]*>/g,
        '<img src="{image_url_placeholder}">'
      )
      .replace(
        /<img src="blob:http:\/\/localhost:.*?">/g,
        '<img src="{image_url_placeholder}">'
      );
  }
  return htmlContent.replace(
    /<img [^>]*src="data:image[^"]+"[^>]*>/g,
    '<img src="{image_url_placeholder}">'
  );
};

export default removeBase64FromImgTags;
