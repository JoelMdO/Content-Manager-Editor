import { ButtonProps } from "../menu/button_menu/type/type_menu_button";
import removeBase64FromImgTags from "../menu/button_menu/utils/remove_img_base64";

interface SaveArticleProps {
  dbName: string | null;
  currentTitle: string;
  currentBody: string;
  language: string | undefined;
  DRAFT_KEY: string | undefined;
}
//
const saveArticle = ({
  dbName,
  currentTitle,
  currentBody,
  language,
  DRAFT_KEY,
}: SaveArticleProps) => {
  //
  // Purpose: Check if the currentTitle contains a placeholder "Title" or a gray placeholder span.
  //---------------------------------------------------------------------------------------------
  console.log("dbName at saveArticle:", dbName);

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

  // Load if any draft on localStorage
  //------------------------------------------
  const localStoreText = localStorage.getItem(`draft-articleContent-${dbName}`);
  const jsonArticle = JSON.parse(localStoreText || "[]");
  //console.log("article at draft article:", jsonArticle);

  let localStoredTitle =
    jsonArticle.find((item: any) => item.type === "title")?.content || "";
  let localStoredBody =
    jsonArticle.find((item: any) => item.type === "body")?.content || "";
  // console.log("storedTitle at auto-save:", storedTitle);
  // console.log("storedBody at auto-save:", storedBody);
  if (language === "es") {
    localStoredTitle =
      jsonArticle.find((item: any) => item.type === "es-title")?.content || "";
    localStoredBody =
      jsonArticle.find((item: any) => item.type === "es-body")?.content || "";
  }
  //
  // Load if any draft on sessionStorage
  //------------------------------------------
  const sessionStoreText = sessionStorage.getItem(`articleContent-${dbName}`);
  const sessionJsonArticle = JSON.parse(sessionStoreText || "[]");
  //console.log("article at draft article:", jsonArticle);

  let sessionStoredTitle =
    sessionJsonArticle.find((item: any) => item.type === "title")?.content ||
    "";
  let sessionStoredBody =
    sessionJsonArticle.find((item: any) => item.type === "body")?.content || "";
  //
  if (language === "es") {
    sessionStoredTitle =
      sessionJsonArticle.find((item: any) => item.type === "es-title")
        ?.content || "";
    sessionStoredBody =
      sessionJsonArticle.find((item: any) => item.type === "es-body")
        ?.content || "";
  }
  // Purpose: Compare textTitle and textBody with local Storage storedTitleRef and storedBodyRef
  //------------------------------------------
  const titles = [sessionStoredTitle, localStoredTitle];
  //console.log("titles at auto-save befpre map:", titles);

  const cleanTitleText = titles.map((title) => {
    // If title is a RefObject, use its current value; otherwise, use as is
    const strTitle = typeof title === "string" ? title : title?.current || "";
    return strTitle
      .replace(/<span class="text-gray-400">.*?<\/span>/g, "")
      .replace(/<[^>]*>/g, "")
      .trim();
  });
  //console.log("Title 1:", cleanTitleText[0]);
  //console.log("Title 2:", cleanTitleText[1]);
  //
  //
  if (cleanTitleText[0] !== cleanTitleText[1]) {
    //  console.log("different title:", cleanTitleText[0]);
    currentTitle = sessionStoredTitle;
  }
  //
  const content = [sessionStoredBody, localStoredBody];
  let images: object[] = [];
  // console.log("content at auto-save before map:", content);

  const cleanBodyText = content.map((body) => {
    const strBody = typeof body === "string" ? body : body?.current || "";
    return strBody
      .replace(/<span class="text-gray-400">.*?<\/span>/g, "")
      .replace(/<img[^>]*?>/gi, "")
      .trim();
    // .replace(/<img\b[^>]*\bsrc=["']blob:[^"']*["'][^>]*>/gi, "")
  });
  //

  if (
    cleanTitleText[0] === cleanTitleText[1] &&
    cleanBodyText[0] === cleanBodyText[1]
  ) {
    console.log("⏳ No content changes detected — skipping auto-save.");
    return;
  }
  //
  if (cleanBodyText[0] !== cleanBodyText[1]) {
    console.log("different cleanBody:");
    //
    currentBody = sessionStoredBody;
    // currentBody = cleanBodyText[0].replace(
    //   /<img[^>]*?>/gi,
    //   '<img src="{image_url_placeholder}">'
    // );
    //------------------------------------------
    // Check on images
    //------------------------------------------
    const sessionStoredImages = JSON.parse(
      sessionStorage.getItem(`articleContent-${dbName}`) || "[]"
    ).filter((item: any) => item.type === "image");
    const localStoredImages = JSON.parse(
      localStorage.getItem(`draft-articleContent-${dbName}`) || "[]"
    ).filter((item: any) => item.type === "image");
    const areArraysEqual =
      JSON.stringify(sessionStoredImages.sort()) ===
      JSON.stringify(localStoredImages.sort());
    // console.log("sessionStoredImages:", sessionStoredImages);
    // console.log("localStoredImages:", localStoredImages);

    // console.log("Are arrays equal (ignoring order)?", areArraysEqual);
    if (!areArraysEqual) {
      //------------------------------------------
      // Purpose: Find images that are present in either sessionStoredImages or localStoredImages but not both, based on unique imageId and fileName.
      //------------------------------------------
      images = sessionStoredImages;
      //   images = [
      //     ...sessionStoredImages.filter(
      //       (sessionImg: any) =>
      //         !localStoredImages.some(
      //           (localImg: any) =>
      //             sessionImg.imageId === localImg.imageId &&
      //             sessionImg.fileName === localImg.fileName
      //         )
      //     ),
      //     ...localStoredImages.filter(
      //       (localImg: any) =>
      //         !sessionStoredImages.some(
      //           (sessionImg: any) =>
      //             localImg.imageId === sessionImg.imageId &&
      //             localImg.fileName === sessionImg.fileName
      //         )
      //     ),
      //   ];
      //  console.log("images at auto-save:", images);
    }
    //
  }
  // console.log("cleanTitle:", cleanTitle);
  // console.log("cleanBody:", cleanBody);
  let articleData = [];
  //Load current images if any
  //------------------------------------------
  // Purpose: Safely get the db name from either a string or a ref object for sessionStorage key.
  //------------------------------------------
  //console.log("Body 1 ready to save:", currentBody);
  //console.log("Title 2 ready to save:", currentTitle);
  const id = JSON.parse(
    sessionStorage.getItem(`articleContent-${dbName}`) || "[]"
  ).filter((item: any) => item.type === "id");
  //console.log("images at auto-save:", images);
  //console.log("id at auto-save:", id);

  // console.log("images at auto-save:", images);
  const htmlCleanedBody = removeBase64FromImgTags(currentBody);
  //console.log("htmlCleanedBody at auto-save:", htmlCleanedBody);

  if (language === "en") {
    //
    const section = JSON.parse(
      sessionStorage.getItem(`articleContent-${dbName}`) || "[]"
    ).filter((item: any) => item.type === "section");
    //
    articleData = [
      { type: "title", content: currentTitle },
      { type: "body", content: htmlCleanedBody },
      ...images,
      ...id,
      ...section,
    ];
    //  console.log("Auto-saving content to localStorage: EN", articleData);

    const articleJson = JSON.stringify(articleData);
    //  console.log("Article JSON at auto-save:", articleJson);
    localStorage.setItem(DRAFT_KEY!, articleJson);
  } else {
    //
    const section = JSON.parse(
      sessionStorage.getItem(`articleContent-${dbName}`) || "[]"
    ).filter((item: any) => item.type === "es-section");
    //
    articleData = [
      { type: "es-title", content: currentTitle },
      { type: "es-body", content: htmlCleanedBody },
      ...images,
      ...id,
      ...section,
    ];

    const articleJson = JSON.stringify(articleData);
    localStorage.setItem(DRAFT_KEY!, articleJson);
    // console.log("✅ Auto-saved content to localStorage:", {
    //   title: cleanTitle ? "Has content" : "Empty",
    //   body: cleanBody ? "Has content" : "Empty",
    //   timestamp: new Date().toISOString(),
    // });
  }
};
export default saveArticle;
