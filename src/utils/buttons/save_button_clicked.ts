import callHub from "@/services/api/call_hub";

const saveButtonClicked = async (italic: string, bold: string) => {
    let articleContent: any[] = [];
    console.log('saveButtonClicked', saveButtonClicked);
    console.log('italic on click', italic);
    console.log('bold on click', bold);
    articleContent = JSON.parse(sessionStorage.getItem("articleContent") || "[]");
    articleContent.push(
        {type: "italic", content: italic},
        {type: "bold", content: bold});
    const response = await callHub("post", articleContent);
    console.log('response at saveButtonClicked after callHub', response);
    console.log('response status', response.status);
        return response;
    //}
};

export default saveButtonClicked;