import callHub from "../../services/api/call_hub";

const saveButtonClicked = async (italic: string, bold: string) => {
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