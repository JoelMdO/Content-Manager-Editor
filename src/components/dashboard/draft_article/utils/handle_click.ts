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
    console.log("Loading article from storage:", {
      hasImages: jsonArticle.some((item: any) => item.type === "image"),
      imageData: jsonArticle.filter((item: any) => item.type === "image"),
    });

    let preSavedBodyRef =
      jsonArticle.find((item: any) => item.type === dbFieldName)?.content || "";

    //-------------------------------------------------------------------------------------
    // Purpose: Load images from IndexedDB and replace <img src="{image_url_placeholder}">
    // with the blob URL for preview in the content editor.
    //-------------------------------------------------------------------------------------
    try {
      let images: any[] = [];

      images = jsonArticle.filter((item: any) => item.type === "image");
      console.log("Processing images for rendering:", {
        count: images.length,
        imageDetails: images.map((img) => ({
          id: img.id || img.imageId,
          hasBase64: !!img.base64,
          base64Length: img.base64 ? img.base64.length : 0,
          hasBlobUrl: !!img.blobUrl,
        })),
      });

      for (const image of images) {
        // Create a regex to match the <img> tag and its associated <p> tag with the image ID
        const imageIdentifier = image.imageId || image.id; // Handle both possible ID fields
        console.log("Trying to match image with ID:", imageIdentifier);

        const regex = new RegExp(
          `<img\\s+src=["']\\{image_url_placeholder\\}["'][^>]*>\\s*<p[^>]*>${imageIdentifier}</p>`,
          "g"
        );

        // Only generate blobUrl for valid images
        // const blobUrl = URL.createObjectURL(image.data);

        // Try to use base64 first, if not available use blobUrl
        const imageSource = image.base64 || image.blobUrl;
        console.log("Image data available:", {
          id: image.id,
          hasBase64: !!image.base64,
          hasBlobUrl: !!image.blobUrl,
          selectedSource: imageSource,
        });

        if (imageSource) {
          preSavedBodyRef = preSavedBodyRef.replace(
            regex,
            `<img src="${imageSource}" alt="${imageIdentifier}" width="25%"/><p class="text-xs text-gray-500" style="justify-self: center;">${imageIdentifier}</p>`
          );
        } else {
          console.warn(`No valid image source found for image ${image.id}`);
        }
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
