import { debounce } from "lodash";
import slugify from "./slugify";

export const debouncedUpdateStore = debounce(
  ///========================================================
  // Update the store with the Title and Body of the article
  // Debounced store update function
  ///========================================================
  (
    newTitle: string,
    newBody: string,
    language: string,
    setText: (text: string) => void
  ) => {
    //
    const title = newTitle;
    const titleKey = language === "es" ? "es-title" : "title";
    const bodyKey = language === "es" ? "es-body" : "body";
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
        (item: { type: string }) => item.type !== titleKey && item.type !== "id"
      );
      //console.log("newTitle:", newTitle);
      //console.log("titleKey:", titleKey);

      // Add title and id to articleContent
      articleContent.push({ type: titleKey, content: newTitle });
      if (language === "en") {
        const date = new Date().getDay();
        const month = new Date().getMonth() + 1;
        const year = new Date().getFullYear();
        const fullData = `${date}-${month}-${year}`;
        const preSlug = `${title}-${fullData}`;
        const id = slugify(preSlug);
        //console.log("id:", id);

        articleContent.push({ type: "id", content: id });
      }
      setText(newTitle); // Update the displayed text
    }

    if (newBody !== "") {
      // Ensure only the latest body
      articleContent = articleContent.filter(
        (item: { type: string }) => item.type !== bodyKey
      );
      // Add body to articleContent
      //console.log("newBody:", newBody);
      //console.log("bodyKey:", bodyKey);

      articleContent.push({ type: bodyKey, content: newBody });
    }
    sessionStorage.setItem(
      `articleContent-${dbName}`,
      JSON.stringify(articleContent)
    );
  },
  500 // Wait 500ms after last change before updating store
);
