import { ButtonProps } from "../menu/button_menu/type/type_menu_button";
import { cleanNestedDivs } from "./clean_content";

// TipTap emits "<p></p>" for an empty editor — treat that the same as "".
const TIPTAP_EMPTY = "<p></p>";

const saveArticle = ({
  dbName,
  currentTitle,
  currentBody,
}: Partial<ButtonProps>) => {
  //
  // Purpose: Skip saving when the editor is empty (no real content).
  //---------------------------------------------------------------------------------------------
  if (currentTitle !== undefined && currentBody !== undefined) {
    if (
      !currentTitle ||
      currentTitle === TIPTAP_EMPTY ||
      !currentBody ||
      currentBody === TIPTAP_EMPTY
    ) {
      console.log({ currentTitle, currentBody });

      console.log("empty currentBody and Title at saveArticle");

      return;
    }
    //------------------------------------------
    // Load if any draft on localStorage
    //------------------------------------------
    const localStoreText = localStorage.getItem(
      `draft-articleContent-${dbName}`,
    );
    const localStoreArticle = JSON.parse(localStoreText || "[]");
    //------------------------------------------
    // Load if any draft on sessionStorage
    //------------------------------------------
    const sessionStoreText = sessionStorage.getItem(`articleContent-${dbName}`);
    const sessionStorageAticle = JSON.parse(sessionStoreText || "[]");
    ///--------------------------------------------------------
    // If session storage is empty and local storage has data, load local to session
    ///--------------------------------------------------------
    if (sessionStorageAticle.length === 0 && localStoreArticle.length > 0) {
      //console.log("saveArticle - if 1");
      sessionStorage.setItem(
        `articleContent-${dbName}`,
        JSON.stringify(localStoreArticle),
      );
      return;
    }
    ///--------------------------------------------------------
    // Function to compare and update localStorage from sessionStorage
    ///--------------------------------------------------------
    // Create maps for easier lookup
    type ArticleItem = {
      type: string;
      content?: string;
      imageId?: string;
      fileName?: string;
      blobUrl?: string;
      base64?: string;
      // add other fields as needed
    };
    //console.log('doing more checks before saving..."');

    const localMap = new Map<string, ArticleItem>(
      (localStoreArticle as ArticleItem[]).map((item) => [item.type, item]),
    );
    const sessionMap = new Map<string, ArticleItem>(
      (sessionStorageAticle as ArticleItem[]).map((item) => [item.type, item]),
    );
    const hasChanges = new Set<string>();
    //console.log("localMap", localMap);

    // Compare session items with local
    for (const [type, sessionItem] of sessionMap) {
      const localItem = localMap.get(type);

      // If type doesn't exist in local or content is different
      if (!localItem || localItem.content !== sessionItem.content) {
        localMap.set(type, { ...sessionItem });
        hasChanges.add(type);
      }
    }
    //console.log("hasChanges", hasChanges);

    // If we found differences, update localStorage
    if (hasChanges.size > 0) {
      // const updatedArticles = Array.from(localMap.values());
      const updatedArticles = Array.from(localMap.values()).map(
        (item: ArticleItem) => {
          if (item.type === "body" && typeof item.content === "string") {
            return { ...item, content: cleanNestedDivs(item.content) };
          }
          if (item.type === "es-body" && typeof item.content === "string") {
            return { ...item, content: cleanNestedDivs(item.content) };
          }
          return item;
        },
      );

      //console.log("updatedArticles", updatedArticles);

      localStorage.setItem(
        `draft-articleContent-${dbName}`,
        JSON.stringify(updatedArticles),
      );
      //console.log("Updated types:", Array.from(hasChanges));
    }
  }
};
export default saveArticle;
