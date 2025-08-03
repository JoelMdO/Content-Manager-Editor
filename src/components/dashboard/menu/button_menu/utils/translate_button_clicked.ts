import callHub from "../../../../../services/api/call_hub";

// const postButtonClicked = async (italic: string[], bold: string[]) => {
const translateButtonClicked = async () => {
  ///========================================================
  // Function to translate the article to the database
  ///========================================================
  console.log("Translating article...");

  let articleContent: object[] = [];
  const dbName = sessionStorage.getItem("db");
  console.log("Translating article for database:", dbName);

  articleContent = JSON.parse(
    sessionStorage.getItem(`articleContent-${dbName}`) || "[]"
  );
  console.log("Article content before translation:", articleContent);
  //Check article from local storage if not on session storage
  if (articleContent.length <= 1) {
    articleContent = JSON.parse(
      localStorage.getItem(`draft-articleContent-${dbName}`) || "[]"
    );
    console.log("Article content from local storage:", articleContent);
  }

  articleContent.push({ type: "dbName", content: dbName });
  console.log("Article content to translate before callhub:", articleContent);

  const response = await callHub("translate", articleContent);
  console.log("Response from translation:", response);

  return response;
  //}
};

export default translateButtonClicked;
