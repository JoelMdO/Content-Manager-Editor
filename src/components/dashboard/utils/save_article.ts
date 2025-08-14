import { ButtonProps } from "../menu/button_menu/type/type_menu_button";
import removeBase64FromImgTags from "../menu/button_menu/utils/remove_img_base64";

const saveArticle = ({
  dbName,
  currentTitle,
  currentBody,
  language,
  DRAFT_KEY,
  setOpenDialogNoSection,
}: // }: SaveArticleProps) => {
Partial<ButtonProps>) => {
  //
  // Purpose: Check if the currentTitle contains a placeholder "Title" or a gray placeholder span.
  //---------------------------------------------------------------------------------------------
  console.log("dbName at saveArticle:", dbName);
  if (currentTitle !== undefined && currentBody !== undefined) {
    // Check for placeholders in the title
    const hasTitlePlaceholder =
      /<span class="text-gray-400">.*?<\/span>/g.test(currentTitle) &&
      currentTitle.includes("Title");
    //console.log("hasTitlePlaceholdertitle:", hasTitlePlaceholder);
    if (hasTitlePlaceholder) return;
    // Check for placeholders in the body
    const hasBodyPlaceholder =
      /<span class="text-gray-400">.*?<\/span>/g.test(currentBody) &&
      currentBody.includes("Article");
    //console.log("hasBodyPlaceholderBody:", hasBodyPlaceholder);
    if (hasBodyPlaceholder) return;
    //------------------------------------------
    // Load if any draft on localStorage
    //------------------------------------------
    const localStoreText = localStorage.getItem(
      `draft-articleContent-${dbName}`
    );
    let localStoreTextArray = JSON.parse(localStoreText || "[]");
    //console.log("article at draft article:", localStoreTextArray);
    //------------------------------------------
    // Load if any draft on sessionStorage
    //------------------------------------------
    const sessionStoreText = sessionStorage.getItem(`articleContent-${dbName}`);
    const sessionJsonArticle = JSON.parse(sessionStoreText || "[]");
    //
    //------------------------------------------
    // Purpose: Returns an array of field types that are different or missing in arr2 compared to arr1.
    //------------------------------------------
    //------------------------------------------
    // Purpose: Define a union type for allowed article field types.
    //------------------------------------------
    // type ArticleFieldType =
    //   | "title"
    //   | "es-title"
    //   | "body"
    //   | "es-body"
    //   | "section";
    // type Images = "image";
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
      console.log("Updated fields in localStorage:", differences);
    }
    // if (
    //   !localItem ||
    //   sessionItem.imageId !== localItem.imageId ||
    //   sessionItem.fileName !== localItem.fileName ||
    //   sessionItem.blobUrl !== localItem.blobUrl
    // ) {
    //   differences.push(sessionItem);
    //   const filteredContent = localStore.filter(
    //     (item: any) => item.type !== "image"
    //   );
    //   // Add new translation
    //   filteredContent.push({ differences });
    //   console.log("new push image");

    // Update or add the image object
    // if (localItem) {
    //   console.log('Updating image in localStorage:', localItem);
    //   localItem.imageId = sessionItem.imageId;
    //   localItem.fileName = sessionItem.fileName;
    //   localItem.blobUrl = sessionItem.blobUrl;
    //   differences.push([
    //     type: "image",
    //     imageId: sessionItem.imageId,
    //     fileName: sessionItem.fileName,
    //     blobUrl: sessionItem.blobUrl,
    //   ] as string);
    // } else {
    //   localStore.push({ ...sessionItem });
    // }
    //}
    // } else {
    //   // Compare content for other types
    //   if (!localItem || localItem.content !== sessionItem.content) {
    //     differences.push(sessionItem);
    //     //
    //     const filteredContent = localStore.filter(
    //       (item: any) => item.type !== sessionItem.type
    //     );
    //     // Add new translation
    //     filteredContent.push({ differences });
    //     console.log("new push content");
    // if (localItem) {
    //   localItem.content = sessionItem.content;
    //   differences.push({type: sessionItem.type, content: sessionItem.content});
    // }

    // localStore.push(differences.)
    // localStore.push({
    //   type: sessionItem.type,
    //   content: sessionItem.content,
    // });
    //}
    // }
    // }
    //}
    //
    console.log("Updated fields in localStorage:", differences);
    //}
    //}
    // getArticleDraftDifferences(sessionJsonArticle, localStoreTextArray);
    // let localStoredTitle =
    //   localStoreTextArray.find((item: any) => item.type === "title")?.content ||
    //   "";
    // let localStoredBody =
    //   localStoreTextArray.find((item: any) => item.type === "body")?.content ||
    //   "";
    // let localStorageSection = localStoreTextArray.find(
    //   (item: any) => item.type === "section"
    // );
    // // console.log("storedTitle at auto-save:", storedTitle);
    // // console.log("storedBody at auto-save:", storedBody);
    // //TODO do for save english and spanish
    // if (language === "es") {
    //   localStoredTitle =
    //     localStoreTextArray.find((item: any) => item.type === "es-title")
    //       ?.content || "";
    //   localStoredBody =
    //     localStoreTextArray.find((item: any) => item.type === "es-body")
    //       ?.content || "";
    // }
    // //

    // //
    // //
    // if (language === "es") {
    //   sessionStoredTitle =
    //     sessionJsonArticle.find((item: any) => item.type === "es-title")
    //       ?.content || "";
    //   sessionStoredBody =
    //     sessionJsonArticle.find((item: any) => item.type === "es-body")
    //       ?.content || "";
    // }
    // //------------------------------------------
    // // Purpose: Compare textTitle with local Storage storedTitleRef and storedBodyRef
    // //------------------------------------------
    // const titles = [sessionStoredTitle, localStoredTitle];
    // //console.log("titles at auto-save befpre map:", titles);

    // const cleanTitleText = titles.map((title) => {
    //   // If title is a RefObject, use its current value; otherwise, use as is
    //   const strTitle = typeof title === "string" ? title : title?.current || "";
    //   return strTitle
    //     .replace(/<span class="text-gray-400">.*?<\/span>/g, "")
    //     .replace(/<[^>]*>/g, "")
    //     .trim();
    // });
    // //console.log("Title 1:", cleanTitleText[0]);
    // //console.log("Title 2:", cleanTitleText[1]);
    // //
    // //
    // if (cleanTitleText[0] !== cleanTitleText[1]) {
    //   //  console.log("different title:", cleanTitleText[0]);
    //   currentTitle = sessionStoredTitle;
    // }
    // //
    // //------------------------------------------
    // // Purpose: Compare textBody with local Storage storedTitleRef and storedBodyRef
    // //------------------------------------------
    // const content = [sessionStoredBody, localStoredBody];
    // let images: object[] = [];
    // // console.log("content at auto-save before map:", content);

    // const cleanBodyText = content.map((body) => {
    //   const strBody = typeof body === "string" ? body : body?.current || "";
    //   return strBody
    //     .replace(/<span class="text-gray-400">.*?<\/span>/g, "")
    //     .replace(/<img[^>]*?>/gi, "")
    //     .trim();
    //   // .replace(/<img\b[^>]*\bsrc=["']blob:[^"']*["'][^>]*>/gi, "")
    // });
    // //
    // if (cleanBodyText[0] !== cleanBodyText[1]) {
    //   console.log("different cleanBody:");
    //   //
    //   currentBody = sessionStoredBody;
    //   //------------------------------------------
    //   // Check on images
    //   //------------------------------------------
    //   const areArraysEqual =
    //     JSON.stringify(sessionStoredImages.sort()) ===
    //     JSON.stringify(localStoredImages.sort());
    //   // console.log("sessionStoredImages:", sessionStoredImages);
    //   // console.log("localStoredImages:", localStoredImages);

    //   // console.log("Are arrays equal (ignoring order)?", areArraysEqual);
    //   if (!areArraysEqual) {
    //     //------------------------------------------
    //     // Purpose: Find images that are present in either sessionStoredImages or localStoredImages but not both, based on unique imageId and fileName.
    //     //------------------------------------------
    //     images = sessionStoredImages;
    //   }
    //   //
    // }
    // console.log("cleanTitle:", cleanTitle);
    // console.log("cleanBody:", cleanBody);
    // let articleData = [];
    // //Load current images if any
    // //------------------------------------------
    // // Purpose: Safely get the db name from either a string or a ref object for sessionStorage key.
    // //------------------------------------------
    // //console.log("Body 1 ready to save:", currentBody);
    // //console.log("Title 2 ready to save:", currentTitle);
    // const id = JSON.parse(
    //   sessionStorage.getItem(`articleContent-${dbName}`) || "[]"
    // ).filter((item: any) => item.type === "id");
    // //
    // //------------------------------------------
    // // Compare sections and update localStorage if needed
    // //------------------------------------------
    // //console.log("images at auto-save:", images);
    // //console.log("id at auto-save:", id);
    // if (!sessionStoreSection || sessionStoreSection.length === 0) {
    //   setOpenDialogNoSection!(true);
    //   console.log("No section found in sessionStorage");
    // }

    // if (
    //   sessionStoreSection &&
    //   (!localStorageSection ||
    //     localStorageSection.content !== sessionStoreSection.content)
    // ) {
    //   console.log(
    //     "Section differs between session and local storage, updating localStorage"
    //   );

    //   // Remove existing section from localStorage array
    //   localStoreTextArray = localStoreTextArray.filter(
    //     (item: any) => item.type !== "section"
    //   );

    //   // Add the new section from sessionStorage
    //   localStoreTextArray.push({
    //     type: "section",
    //     content: sessionStoreSection.content,
    //   });

    //   // Update localStorage immediately
    //   // localStorage.setItem(`draft-articleContent-${dbName}`, JSON.stringify(localStoreTextArray));
    //   // console.log("Updated section in localStorage:", sessionStoreSection.content);
    // }
    // console.log("continue to htmlCleanedBody on SAVE");

    // // console.log("images at auto-save:", images);
    // const htmlCleanedBody = removeBase64FromImgTags(currentBody!);
    // //console.log("htmlCleanedBody at auto-save:", htmlCleanedBody);

    // //if (language === "en") {
    // //
    // // const section = JSON.parse(
    // //   sessionStorage.getItem(`articleContent-${dbName}`) || "[]"
    // // ).filter((item: any) => item.type === "section");
    // //
    // articleData = [
    //   { type: "title", content: currentTitle },
    //   { type: "body", content: htmlCleanedBody },
    //   { type: "es-title", content: currentTitle },
    //   { type: "es-body", content: htmlCleanedBody },
    //   ...images,
    //   ...id,
    //   ...localStoreTextArray,
    // ];
    // //  console.log("Auto-saving content to localStorage: EN", articleData);

    // // const articleJson = JSON.stringify(articleData);
    // //  console.log("Article JSON at auto-save:", articleJson);
    // // localStorage.setItem(DRAFT_KEY!, articleJson);
    // //} else {
    // //
    // // const section = JSON.parse(
    // //   sessionStorage.getItem(`articleContent-${dbName}`) || "[]"
    // // ).filter((item: any) => item.type === "es-section");
    // //
    // // articleData = [
    // //   { type: "es-title", content: currentTitle },
    // //   { type: "es-body", content: htmlCleanedBody },
    // //   ...images,
    // //   ...id,
    // //   ...section,
    // // ];

    // const articleJson = JSON.stringify(articleData);
    // localStorage.setItem(DRAFT_KEY!, articleJson);
    // console.log("✅ Auto-saved content to localStorage:", {
    //   title: cleanTitle ? "Has content" : "Empty",
    //   body: cleanBody ? "Has content" : "Empty",
    //   timestamp: new Date().toISOString(),
    // });
    //}
  }
};
export default saveArticle;
