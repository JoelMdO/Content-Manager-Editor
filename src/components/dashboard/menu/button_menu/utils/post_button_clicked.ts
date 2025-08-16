import callHub from "../../../../../services/api/call_hub";
const postButtonClicked = async () => {
  ///========================================================
  // Function to post the article to the database
  ///========================================================
  let articleContent: object[] = [];
  const dbName = sessionStorage.getItem("db");

  articleContent = JSON.parse(
    localStorage.getItem(`draft-articleContent-${dbName}`) || "[]"
  );

  articleContent.push({ type: "dbName", content: dbName });

  const response = await callHub("post", articleContent);
  return response;
};

export default postButtonClicked;
