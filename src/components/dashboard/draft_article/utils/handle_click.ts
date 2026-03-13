//=========================================================
// HANDLE CLICK, purpose:
// Update UI with the draft article content
//=========================================================
import loadArticle from "../../preview/utils/load_markdown_article";
import { cleanNestedDivs } from "../../utils/clean_content";
import { StorageItem, StorageItemOrNull } from "../../../../types/storage_item";
import { useDraftStore } from "@/store/useDraftStore";
import { hydrateImagesInHTML } from "@/lib/imageStore/hydrateImages";

// Define a single props object type that combines all required properties
type HandleClickProps = {
  newSavedTitleRef?: React.RefObject<string>;
  DRAFT_KEY: string;
  savedTitleRef?: React.RefObject<string | null>;
  tag: string;
  newTitleRef?: string;
  setLanguage?: (language: "en" | "es") => void;
  language?: string;
  setSummaryContent?: (summaryContent: string) => void;
  setArticle?: (article: StorageItemOrNull) => void;
};

// Updated function to accept a single props object
export const handleClick = async ({
  newSavedTitleRef,
  DRAFT_KEY,
  savedTitleRef,
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
    setArticle!(null);
    sessionStorage.setItem(`articleContent-${db}`, articleStored!);
  } else if (tag === "draft-es") {
    savedTitleRef!.current =
      jsonArticle.find((item: StorageItem) => item.type === "es-title")
        ?.content || "";
    // console.log(
    //   jsonArticle.find((item: StorageItem) => item.type === "es-title")
    //     ?.content || "",
    // );

    dbFieldName = "es-body";
    setLanguage!("es");
    setArticle!(null);
    sessionStorage.setItem(`articleContent-${db}`, articleStored!);
  } else if (tag === "summary-en") {
    ///--------------------------------------------------------
    // load from sessionStorage.
    ///--------------------------------------------------------
    setLanguage!("en");
    let summary =
      jsonArticle.find((item: StorageItem) => item.type === "summary")
        ?.content || "";
    //console.log("summary from handleClick:", summary);

    //---------------------------------------------------------------------
    // Fallback to sessionStorage if not found in sessionStorage
    //---------------------------------------------------------------------
    if (summary === undefined || summary === null || summary === "") {
      summary =
        jsonSessionStorageArticle.find(
          (item: StorageItem) => item.type === "summary",
        )?.content || "";
    }
    // Clean the summary content (remove extra divs, ensure proper formatting)
    if (summary) {
      summary = summary
        .replace(/<div>/g, "")
        .replace(/<\/div>/g, "")
        .trim();
    }
    //
    setSummaryContent!(summary);
    return;
  } else if (tag === "summary-es") {
    // load from sessionStorage.
    setLanguage!("es");
    let summary =
      jsonArticle.find((item: StorageItem) => item.type === "es-summary")
        ?.content || "";
    //---------------------------------------------------------------------
    // Fallback to sessionStorage if not found in sessionStorage
    //---------------------------------------------------------------------
    if (summary === undefined || summary === null || summary === "") {
      summary =
        jsonSessionStorageArticle.find(
          (item: StorageItem) => item.type === "es-summary",
        )?.content || "";
    }
    // Clean the summary content (remove extra divs, ensure proper formatting)
    if (summary) {
      summary = summary
        .replace(/<div>/g, "")
        .replace(/<\/div>/g, "")
        .trim();
    }
    //
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
    //console.log("Loading article from storage:", {
    //   hasImages: jsonArticle.some((item: any) => item.type.startsWith("image")),
    //   imageData: jsonArticle.filter((item: any) =>
    //     item.type.startsWith("image")
    //   ),
    // });

    let preSavedBodyRef =
      jsonArticle.find((item: StorageItem) => item.type === dbFieldName)
        ?.content || "";
    //console.log("preSavedBodyRef before image processing:", preSavedBodyRef);

    //-------------------------------------------------------------------------------------
    // Replace tags with line breaks
    //-------------------------------------------------------------------------------------
    preSavedBodyRef = preSavedBodyRef
      .replace(/<div>/g, "")
      .replace(/<\/div>/g, "")
      .replace(/<br\s*\/?>/g, "___LINE_BREAK___")
      .replace(/___LINE_BREAK___/g, "<br>");

    // Update the body reference
    const cleanedBody = cleanNestedDivs(preSavedBodyRef);
    //console.log("Cleaned body on draft after cleanNestedDivs:", cleanedBody);

    // Replace <img ... data-ref-id> tags with blob URLs from IndexedDB
    // so the editor receives HTML with valid src attributes.
    let hydratedBody = cleanedBody;
    try {
      hydratedBody = await hydrateImagesInHTML(cleanedBody);
      //console.log("hydratedBody after hydrateImagesInHTML:", hydratedBody);
    } catch (e) {
      //console.warn("[handleClick] hydrateImagesInHTML failed:", e);
    }

    // ORIGINAL — replaced by: loadDraftIntoEditor imperative action in useDraftStore
    // CHANGE LOG
    // Changed by : Copilot
    // Date       : 2026-03-11
    // Reason     : Removed reactive setDraftArticleButtonClicked trigger. Draft
    //              content is now written directly to the editor DOM via the
    //              imperative loadDraftIntoEditor action, eliminating the
    //              useEffect re-render cascade that caused paragraph collapse.
    // Impact     : DashboardEditor no longer needs isDraftArticleButtonClicked
    //              in its useEffect dependency array.
    //
    // setDraftArticleButtonClicked!(true);
    useDraftStore.getState().loadDraftIntoEditor(
      savedTitleRef?.current ?? "",
      // pass hydrated HTML (blob URLs inserted) to the editor
      typeof hydratedBody === "string" ? hydratedBody : cleanedBody,
    );
    //-------------------------------------------------------------------------------------
  }
};
