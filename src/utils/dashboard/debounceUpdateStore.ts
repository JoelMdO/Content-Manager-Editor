import {debounce} from "lodash";

export const debouncedUpdateStore = debounce(
  ///========================================================
  // Update the store with the Title and Body of the article
  // Debounced store update function
  ///========================================================
(newTitle: string, newBody: string) => {

    let title = newTitle.split(" ").slice(0, 2).join("-");
    let date = new Date().getDay();
    let month = new Date().getMonth() + 1;
    let year = new Date().getFullYear();
    let fullData = `${date}-${month}-${year}`;
    let id = `${title}-${fullData}`;
    //----------------------------------------------------
    // Remove previous Title and Body content before adding the new one
    //----------------------------------------------------
    let articleContent = JSON.parse(sessionStorage.getItem("articleContent") || "[]");

    if (newTitle !== "") {
      // Ensure only the latest title and id    
      articleContent = articleContent.filter(
          (item: { type: string }) => item.type !== "title" && item.type !== "id"
      );
      // Add title and id to articleContent
      articleContent.push({ type: "title", content: newTitle });
      articleContent.push({ type: "id", content: id });
    }
    
    if (newBody !== "") {
      // Ensure only the latest body
        articleContent = articleContent.filter(
          (item: { type: string }) => item.type !== "body"
      );
      // Add body to articleContent
    articleContent.push({ type: "body", content: newBody });
    }

    sessionStorage.setItem("articleContent", JSON.stringify(articleContent));
},
  500 // Wait 500ms after last change before updating store
);