import callHub from "../../../../../services/api/call_hub";

const translateButtonClicked = async () => {
  ///========================================================
  // Function to translate the article to the database
  ///========================================================

  let articleContent: object[] = [];
  const dbName = sessionStorage.getItem("db");

  articleContent = JSON.parse(
    localStorage.getItem(`draft-articleContent-${dbName}`) || "[]"
  );

  const response = await callHub("translate", articleContent);

  return response;
};

export default translateButtonClicked;
