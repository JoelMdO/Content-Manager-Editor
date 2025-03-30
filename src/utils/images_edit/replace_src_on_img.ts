const replaceSrcWithImagePlaceholders = (htmlContent: string, images: Array<{url: string}>) => {

    const newHtmlContent = htmlContent.replace(/<img src="{image_url_placeholder}">[\s\S]*?<p[^>]*>(.*?)<\/p>/g, (match, filename) => {
        // Trim filename and replace spaces with underscores
        console.log('images', images);
        
        let cleanedFilename = filename.trim()
        .replace(/\s+/g, '_')
        .replace(/^\d{2}-\d{2}-\d{2}-/, ''); // Remove date prefix
        // .replace(/[^\w.]/g, ''); // Remove special characters except dots;
        console.log('cleanedFilename', cleanedFilename);
        

        // Find the matching image URL
        let matchingImage = images.find((image) => {
        const urlFilename = image.url.split('/').pop();
        console.log('urlFileName', urlFilename);
        return urlFilename?.includes(cleanedFilename.replace('.png', ''))});
        console.log('matchingImage', matchingImage);
        
        if (matchingImage) {
            console.log('img replacement', `<img src="${matchingImage.url}">`);
            return `<img src="${matchingImage.url}">`;
        }
        // If no match found, return the original <img> tag
        return `<img src="{image_url_placeholder}">`;

    });

    if (!newHtmlContent.trim().startsWith("<div>")){
        return `<div>${newHtmlContent}`;
    } else {
        return newHtmlContent;
    }
}

export default replaceSrcWithImagePlaceholders;
