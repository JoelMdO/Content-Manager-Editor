import callHub from "../../../../../services/api/call_hub";

<<<<<<< HEAD
=======
// const postButtonClicked = async (italic: string[], bold: string[]) => {
>>>>>>> 1295580d32457ddac461590b78b05994a943dd08
const translateButtonClicked = async () => {
  ///========================================================
  // Function to translate the article to the database
  ///========================================================
<<<<<<< HEAD

  let articleContent: object[] = [];
  const dbName = sessionStorage.getItem("db");
=======
  console.log("Translating article...");

  let articleContent: object[] = [];
  const dbName = sessionStorage.getItem("db");
  console.log("Translating article for database:", dbName);
>>>>>>> 1295580d32457ddac461590b78b05994a943dd08

  articleContent = JSON.parse(
    sessionStorage.getItem(`articleContent-${dbName}`) || "[]"
  );
<<<<<<< HEAD
=======
  console.log("Article content before translation:", articleContent);
>>>>>>> 1295580d32457ddac461590b78b05994a943dd08
  //Check article from local storage if not on session storage
  if (articleContent.length <= 1) {
    articleContent = JSON.parse(
      localStorage.getItem(`draft-articleContent-${dbName}`) || "[]"
    );
<<<<<<< HEAD
  }

  const response = await callHub("translate", articleContent);

  return response;
=======
    console.log("Article content from local storage:", articleContent);
  }

  articleContent.push({ type: "dbName", content: dbName });
  console.log("Article content to translate before callhub:", articleContent);

  const response = await callHub("translate", articleContent);
  console.log("Response from translation:", response);

  return response;
  //}
>>>>>>> 1295580d32457ddac461590b78b05994a943dd08
};

export default translateButtonClicked;
