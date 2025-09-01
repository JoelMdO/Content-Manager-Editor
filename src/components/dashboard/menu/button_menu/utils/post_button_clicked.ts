import callHub from "../../../../../services/api/call_hub";
<<<<<<< HEAD
//------------------------------------------
// Purpose: This function posts the article content to the database.
//------------------------------------------
type ArticleContentItem = {
  type: string;
  content?: any;
  [key: string]: any;
};

=======

// const saveButtonClicked = async (italic: string[], bold: string[]) => {
>>>>>>> 1295580d32457ddac461590b78b05994a943dd08
const postButtonClicked = async () => {
  ///========================================================
  // Function to post the article to the database
  ///========================================================
<<<<<<< HEAD
  let articleContent: ArticleContentItem[] = [];
=======
  let articleContent: object[] = [];
>>>>>>> 1295580d32457ddac461590b78b05994a943dd08
  const dbName = sessionStorage.getItem("db");

  articleContent = JSON.parse(
    localStorage.getItem(`draft-articleContent-${dbName}`) || "[]"
  );
<<<<<<< HEAD
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
=======
  console.log("articleContent before push postButtonClicked:", articleContent);

  articleContent.push(
    // { type: "italic", content: italic },
    // { type: "bold", content: bold },
    { type: "dbName", content: dbName }
  );
  console.log("postButtonClicked articleContent:", articleContent);

  const response = await callHub("post", articleContent);
  //sessionStorage.clear();
  //localStorage.clear();
  return response;
  //}
>>>>>>> 1295580d32457ddac461590b78b05994a943dd08
};

export default postButtonClicked;
