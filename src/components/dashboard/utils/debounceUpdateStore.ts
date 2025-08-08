import { debounce } from "lodash";

export const debouncedUpdateStore = debounce(
  ///========================================================
  // Update the store with the Title and Body of the article
  // Debounced store update function
  ///========================================================
  (newTitle: string, newBody: string) => {
    //
    const title = newTitle;
    const date = new Date().getDay();
    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();
    const fullData = `${date}-${month}-${year}`;
    const id = `${title}-${fullData}`;
    //----------------------------------------------------
    // Remove previous Title and Body content before adding the new one
    //----------------------------------------------------
    const dbName = sessionStorage.getItem("db");
    let articleContent = JSON.parse(
      sessionStorage.getItem(`articleContent-${dbName}`) || "[]"
    );

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

    sessionStorage.setItem(
      `articleContent-${dbName}`,
      JSON.stringify(articleContent)
    );
  },
  500 // Wait 500ms after last change before updating store
);
