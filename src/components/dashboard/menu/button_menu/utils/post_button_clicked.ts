import callHub from "../../../../../services/api/call_hub";
//------------------------------------------
// Purpose: This function posts the article content to the database.
//------------------------------------------
type ArticleContentItem = {
  type: string;
  content?: any;
  [key: string]: any;
};

const postButtonClicked = async () => {
  ///========================================================
  // Function to post the article to the database
  ///========================================================
  let articleContent: ArticleContentItem[] = [];
  const dbName = sessionStorage.getItem("db");

  articleContent = JSON.parse(
    localStorage.getItem(`draft-articleContent-${dbName}`) || "[]"
  );
  const sectionItem = articleContent.find((item) => item.type === "section");
  if (
    sectionItem?.content === "" ||
    sectionItem === undefined ||
    sectionItem === null
  ) {
    return { status: 206, message: "Section is empty or missing" };
  }
  articleContent.push({ type: "dbName", content: dbName });

  const response = await callHub("post", articleContent);
  return response;
};

export default postButtonClicked;
