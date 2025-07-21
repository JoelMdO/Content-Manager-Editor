import callHub from "../../services/api/call_hub";

const saveButtonClicked = async (italic: string[], bold: string[]) => {
  ///========================================================
  // Function to save the article to the database
  ///========================================================
  let articleContent: object[] = [];
  const dbName = sessionStorage.getItem("db");

  articleContent = JSON.parse(
    sessionStorage.getItem(`articleContent-${dbName}`) || "[]"
  );
  articleContent.push(
    { type: "italic", content: italic },
    { type: "bold", content: bold },
    { type: "dbName", content: dbName }
  );

  const response = await callHub("post", articleContent);
  sessionStorage.clear();
  localStorage.clear();
  return response;
  //}
};

export default saveButtonClicked;
