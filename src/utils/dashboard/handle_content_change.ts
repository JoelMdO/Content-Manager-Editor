
export const handleContentChange = (
index: number,
content: string,
setIsTitle: (value: boolean) => void,
setTheTitle: (value: string) => void,
setIsArticle: (value: boolean) => void,
setTheBody: (value: string) => void,
debouncedUpdateStore: (title: string, body: string) => void
) => {

    console.log("handleContentChange Called");

if (index === 0) {
    // Title
    setIsTitle(false);
    setTheTitle(content);
    sessionStorage.setItem("tempTitle", content);
    debouncedUpdateStore(content, sessionStorage.getItem("tempBody") || "");
} else {
    // Article
    setIsArticle(false);
    setTheBody(content);
    sessionStorage.setItem("tempBody", content);
    debouncedUpdateStore(sessionStorage.getItem("tempTitle") || "", content);
}
};