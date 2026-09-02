import callHub from "../../../../../services/api/call_hub";
export const translateController = new AbortController();
const translateButtonClicked = async () => {
  ///========================================================
  // Function to translate the article to the database
  ///========================================================
  console.log("translateButtonClicked function called");
  let articleContent: object[] = [];
  const dbName = sessionStorage.getItem("db");

  articleContent = JSON.parse(
    localStorage.getItem(`draft-articleContent-${dbName}`) || "[]",
  );

  const response = await callHub(
    "translate",
    articleContent,
    translateController.signal,
  );

  return response;
};

export default translateButtonClicked;
