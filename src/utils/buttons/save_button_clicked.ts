import callHub from "@/services/api/call_hub";

const saveButtonClicked = async (italic: string, bold: string) => {
    ///========================================================
    // Function to save the article to the database
    ///========================================================
    let articleContent: any[] = [];
    articleContent = JSON.parse(sessionStorage.getItem("articleContent") || "[]");
    articleContent.push(
        {type: "italic", content: italic},
        {type: "bold", content: bold});
    const response = await callHub("post", articleContent);
        return response;
    //}
};

export default saveButtonClicked;