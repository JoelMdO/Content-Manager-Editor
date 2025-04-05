import removeBase64FromImgTags from "./remove_img_base64";

export const handleContentChange = (
index: number,
content: string,
debouncedUpdateStore: (title: string, body: string) => void
) => {

///========================================================
// Function to handler the content change on the editor, when 
// the user types or modifies the content. 
///========================================================

if (index === 0) {
    // Title
    sessionStorage.setItem("tempTitle", content);
    debouncedUpdateStore(content, sessionStorage.getItem("tempBody") || "");
} else {
    // Article
    const htmlCleaned = removeBase64FromImgTags(content);
    sessionStorage.setItem("tempBody", htmlCleaned);
    debouncedUpdateStore(sessionStorage.getItem("tempTitle") || "", htmlCleaned);
}
};