//=========================================================
// HANDLE CLICK, purpose:
// Update UI with the draft article content
//=========================================================

import loadArticle from "../../preview/utils/load_article";

// Define a single props object type that combines all required properties
type HandleClickProps = {
  newSavedTitleRef?: React.RefObject<string>;
  DRAFT_KEY?: string;
  savedTitleRef?: React.RefObject<string | null>;
  savedBodyRef?: React.RefObject<string | null>;
  setDraftArticleButtonClicked?: (clicked: boolean) => void;
  tag: string;
  newTitleRef?: string;
  setLanguage?: (language: "en" | "es") => void;
  language?: string;
  setSummaryContent?: (summaryContent: string) => void;
  setArticle?: (article: any) => void;
};

// Updated function to accept a single props object
export const handleClick = async ({
  newSavedTitleRef,
  DRAFT_KEY,
  savedTitleRef,
  savedBodyRef,
  setDraftArticleButtonClicked,
  tag,
  newTitleRef,
  setLanguage,
  language,
  setSummaryContent,
  setArticle,
}: HandleClickProps) => {
  //
  let dbFieldName: string = "body";
  const db = sessionStorage.getItem("dbName") || "DeCav";
  if (DRAFT_KEY === null || DRAFT_KEY === undefined) {
    DRAFT_KEY = `draft-articleContent-${db}`;
  }
  const articleStored = localStorage.getItem(DRAFT_KEY);
  const jsonArticle = JSON.parse(articleStored!);
  const sessionStorageArticle = sessionStorage.getItem(`articleContent-${db}`);
  const jsonSessionStorageArticle = JSON.parse(sessionStorageArticle!);
  //
  if (tag === "translated") {
    savedTitleRef!.current = newTitleRef!;
    dbFieldName = "es-body";
  } else if (tag === "draft-en") {
    savedTitleRef!.current = newSavedTitleRef!.current;
    dbFieldName = "body";
    setLanguage!("en");
    sessionStorage.setItem(`articleContent-${db}`, articleStored!);
  } else if (tag === "draft-es") {
    savedTitleRef!.current =
      jsonArticle.find((item: any) => item.type === "es-title")?.content || "";
    dbFieldName = "es-body";
    setLanguage!("es");
    sessionStorage.setItem(`articleContent-${db}`, articleStored!);
  } else if (tag === "summary-en") {
    ///--------------------------------------------------------
    // load from sessionStorage.
    ///--------------------------------------------------------
    setLanguage!("en");
    let summary =
      jsonArticle.find((item: any) => item.type === "summary")?.content || "";
    console.log("summary from handleClick:", summary);

    //---------------------------------------------------------------------
    // Fallback to sessionStorage if not found in sessionStorage
    //---------------------------------------------------------------------
    if (summary === undefined || summary === null || summary === "") {
      summary =
        jsonSessionStorageArticle.find((item: any) => item.type === "summary")
          ?.content || "";
    }
    setSummaryContent!(summary);
    return;
  } else if (tag === "summary-es") {
    // load from sessionStorage.
    setLanguage!("es");
    let summary =
      jsonArticle.find((item: any) => item.type === "es-summary")?.content ||
      "";
    //---------------------------------------------------------------------
    // Fallback to sessionStorage if not found in sessionStorage
    //---------------------------------------------------------------------
    if (summary === undefined || summary === null || summary === "") {
      summary =
        jsonSessionStorageArticle.find(
          (item: any) => item.type === "es-summary"
        )?.content || "";
    }
    setSummaryContent!(summary);
    return;
  } else if (tag === "preview-en") {
    setLanguage!("en");
    const loadedArticle = await loadArticle({ language: language ?? "en" });
    if (loadedArticle) {
      setArticle!(loadedArticle);
    }
  } else if (tag === "preview-es") {
    setLanguage!("es");
    const loadedArticle = await loadArticle({ language: language ?? "es" });
    if (loadedArticle) {
      setArticle!(loadedArticle);
    }
  }
  //
  //
  if (jsonArticle) {
    //
    let preSavedBodyRef =
      jsonArticle.find((item: any) => item.type === dbFieldName)?.content || "";

    //-------------------------------------------------------------------------------------
    // Purpose: Load images from IndexedDB and replace <img src="{image_url_placeholder}">
    // with the blob URL for preview in the content editor.
    //-------------------------------------------------------------------------------------
    try {
      let images: any[] = [];

      images = jsonArticle.filter((item: any) => item.type === "image");

      for (const image of images) {
        // Create a regex to match the <img> tag and its associated <p> tag with the image.fileName
        const regex = new RegExp(
          `<img\\s+src=["']\\{image_url_placeholder\\}["'][^>]*>\\s*<p[^>]*>${image.id}</p>`,
          "g"
        );

        // Only generate blobUrl for valid images
        // const blobUrl = URL.createObjectURL(image.data);

        preSavedBodyRef = preSavedBodyRef.replace(
          regex,
          `<img src="${image.base64}" alt="${image.id}" width="25%"/><p class="text-xs text-gray-500" style="justify-self: center;">${image.id}</p>`
        );
      }
      //}
    } catch (err) {
      console.error("Error loading images from IndexedDB:", err);
    }
    //-------------------------------------------------------------------------------------
    // Replace tags with line breaks
    //-------------------------------------------------------------------------------------
    preSavedBodyRef = preSavedBodyRef
      .replace(/<div>/g, "")
      .replace(/<\/div>/g, "")
      .replace(/<br\s*\/?>/g, "___LINE_BREAK___")
      .replace(/___LINE_BREAK___/g, "<br>");

    // Update the body reference
    savedBodyRef!.current = preSavedBodyRef;
    //-------------------------------------------------------------------------------------
    setDraftArticleButtonClicked!(true);
  }
};
