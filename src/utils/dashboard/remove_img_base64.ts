const removeBase64FromImgTags = (htmlContent: string) => {
    // Regular expression to match the base64 image src and replace it with a placeholder
    return htmlContent.replace(/<img [^>]*src="data:image[^"]+"[^>]*>/g, '<img src="{image_url_placeholder}">');
}

export default removeBase64FromImgTags;
