import callHub from "../../services/api/call_hub";

const saveButtonClicked = async (italic: string, bold: string) => {
    ///========================================================
    // Function to save the article to the database
    ///========================================================
    let articleContent: any[] = [];
    const dbName = sessionStorage.getItem("db");
    console.log('dbNAme at savedbutton', dbName);
    
    articleContent = JSON.parse(sessionStorage.getItem(`articleContent-${dbName}`) || "[]");
    articleContent.push(
        {type: "italic", content: italic},
        {type: "bold", content: bold},
        {type: "dbName", content: dbName});
    
        console.log('article Content at saved', articleContent);
        
    const response = await callHub("post", articleContent);
        return response;
    //}
};

export default saveButtonClicked;