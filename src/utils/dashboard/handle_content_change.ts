
export const handleContentChange = (
index: number,
content: string,
setIsTitle: (value: boolean) => void,
setIsArticle: (value: boolean) => void,
debouncedUpdateStore: (title: string, body: string) => void
) => {

///========================================================
// Function to handler the content change on the editor, when 
// the user types or modifies the content. 
///========================================================

if (index === 0) {
    // Title
    setIsTitle(false);
    sessionStorage.setItem("tempTitle", content);
    debouncedUpdateStore(content, sessionStorage.getItem("tempBody") || "");
} else {
    // Article
    setIsArticle(false);
    sessionStorage.setItem("tempBody", content);
    debouncedUpdateStore(sessionStorage.getItem("tempTitle") || "", content);
}
};