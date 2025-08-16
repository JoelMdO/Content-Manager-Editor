import { ButtonProps } from "../menu/button_menu/type/type_menu_button";

const saveArticle = ({
  dbName,
  currentTitle,
  currentBody,
}: Partial<ButtonProps>) => {
  //
  // Purpose: Check if the currentTitle contains a placeholder "Title" or a gray placeholder span.
  //---------------------------------------------------------------------------------------------
  if (currentTitle !== undefined && currentBody !== undefined) {
    // Check for placeholders in the title
    const hasTitlePlaceholder =
      /<span class="text-gray-400">.*?<\/span>/g.test(currentTitle) &&
      currentTitle.includes("Title");
    if (hasTitlePlaceholder) return;
    // Check for placeholders in the body
    const hasBodyPlaceholder =
      /<span class="text-gray-400">.*?<\/span>/g.test(currentBody) &&
      currentBody.includes("Article");
    if (hasBodyPlaceholder) return;
    //------------------------------------------
    // Load if any draft on localStorage
    //------------------------------------------
    const localStoreText = localStorage.getItem(
      `draft-articleContent-${dbName}`
    );
    let localStoreTextArray = JSON.parse(localStoreText || "[]");
    //------------------------------------------
    // Load if any draft on sessionStorage
    //------------------------------------------
    const sessionStoreText = sessionStorage.getItem(`articleContent-${dbName}`);
    const sessionJsonArticle = JSON.parse(sessionStoreText || "[]");
    //
    //------------------------------------------
    function getArticleDraftDifferences(
      sessionStore: any[],
      localStore: any[]
    ) {
      //
      const localMap = new Map(localStore.map((item) => [item.type, item]));
      const differences: string[] = [];
      //
      for (const sessionItem of sessionStore) {
        const localItem = localMap.get(sessionItem.type);

        if (sessionItem.type === "image") {
          // Compare all relevant image fields
          if (
            !localItem ||
            sessionItem.imageId !== localItem.imageId ||
            sessionItem.fileName !== localItem.fileName ||
            sessionItem.blobUrl !== localItem.blobUrl
          ) {
            differences.push(sessionItem.type);
            // Update or add the image object
            if (localItem) {
              localItem.imageId = sessionItem.imageId;
              localItem.fileName = sessionItem.fileName;
              localItem.blobUrl = sessionItem.blobUrl;
            } else {
              localStore.push({ ...sessionItem });
            }
          }
        } else {
          // Compare content for other types
          if (!localItem || localItem.content !== sessionItem.content) {
            differences.push(sessionItem.type);
            if (localItem) {
              localItem.content = sessionItem.content;
            } else {
              localStore.push({
                type: sessionItem.type,
                content: sessionItem.content,
              });
            }
          }
        }
      }
      return differences;
    }
    //}
    // Purpose: Call the function and update localStorage if there are differences
    //------------------------------------------
    const differences = getArticleDraftDifferences(
      sessionJsonArticle,
      localStoreTextArray
    );
    if (differences.length > 0) {
      localStorage.setItem(
        `draft-articleContent-${dbName}`,
        JSON.stringify(localStoreTextArray)
      );
    }
  }
};
export default saveArticle;
