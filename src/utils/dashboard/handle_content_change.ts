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
const dbName = sessionStorage.getItem("db");
console.log('dbName at handleCotent Change', dbName);

//
if (index === 0) {
    // Title
    sessionStorage.setItem(`tempTitle-${dbName}`, content);
    debouncedUpdateStore(content, sessionStorage.getItem(`tempBody-${dbName}`) || "");
} else {
    // Article
    const htmlCleaned = removeBase64FromImgTags(content);
    sessionStorage.setItem(`tempBody-${dbName}`, htmlCleaned);
    debouncedUpdateStore(sessionStorage.getItem(`tempTitle-${dbName}`) || "", htmlCleaned);
}
};