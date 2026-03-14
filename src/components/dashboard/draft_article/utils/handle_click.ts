//=========================================================
// HANDLE CLICK, purpose:
// Update UI with the draft article content
//=========================================================
import loadArticle from "../../preview/utils/load_markdown_article";
import { cleanNestedDivs } from "../../utils/clean_content";
import { StorageItem, StorageItemOrNull } from "../../../../types/storage_item";
import { useDraftStore } from "@/store/useDraftStore";
import { hydrateImagesInHTML } from "@/lib/imageStore/hydrateImages";
import { useUIStore } from "@/store/useUIStore";
import { useEditorStore } from "@/store/useEditorStore";
import {
  defaultDispatcher,
  defaultHandlerContext,
  DispatchProps,
} from "./handlers";

type HandleClickProps = {
  tag: string;
  newSavedTitleRef?: React.RefObject<string | null>;
  DRAFT_KEY?: string;
  savedTitleRef?: React.RefObject<string | null>;
  newTitleRef?: string;
  setLanguage?: (language: "en" | "es") => void;
  language?: string;
  setSummaryContent?: (summaryContent: string) => void;
  setArticle?: (article: StorageItemOrNull | null) => void;
};

export const handleClick = async (props: HandleClickProps) => {
  // ORIGINAL — commented out below per repository code-editing rules.
  /*
 
  export const handleClick = async ({
    newSavedTitleRef,
    //DRAFT_KEY,
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
    const articleStored = localStorage.getItem(`draft-articleContent-${db}`);
    const jsonArticle = JSON.parse(articleStored!);
    console.log({ db });

    console.log({ jsonArticleFromLocalStorage: jsonArticle });

    const sessionStorageArticle = sessionStorage.getItem(`articleContent-${db}`);
    const jsonSessionStorageArticle = JSON.parse(sessionStorageArticle!); //
    // ORIGINAL - replaced by update editor directly.
    // if (tag === "translated") {
    //   savedTitleRef!.current = newTitleRef!;
    //   dbFieldName = "es-body";
    // } else if (tag === "draft-en") {
    // UPDATED :
    if (tag === "draft-en") {
      savedTitleRef!.current = newSavedTitleRef!.current;
      dbFieldName = "body";
      setLanguage!("en");
      setArticle!(null);
      sessionStorage.setItem(`articleContent-${db}`, articleStored!);
    } else if (tag === "draft-es") {
      savedTitleRef!.current =
        jsonArticle.find((item: StorageItem) => item.type === "es-title")
          ?.content || "";

      dbFieldName = "es-body";
      setLanguage!("es");
      setArticle!(null);
      sessionStorage.setItem(`articleContent-${db}`, articleStored!);
    } else if (tag === "summary-en") {
      ///--------------------------------------------------------
      // load from sessionStorage.
      ///--------------------------------------------------------
      console.log("doing summary en");
      setLanguage!("en");
      let summary =
        jsonArticle.find((item: StorageItem) => item.type === "summary")
          ?.content || "";

      if (summary === undefined || summary === null || summary === "") {
        summary =
          jsonSessionStorageArticle.find(
            (item: StorageItem) => item.type === "summary",
          )?.content || "";
      }
      if (summary) {
        summary = summary
          .replace(/<div>/g, "")
          .replace(/<\/div>/g, "")
          .trim();
      }
      setSummaryContent!(summary);
      return;
    } else if (tag === "summary-es") {
      // load from sessionStorage.
      console.log("doing Summary ESP");

      setLanguage!("es");
      let summary =
        jsonArticle.find((item: StorageItem) => item.type === "es-summary")
          ?.content || "";

      if (summary === undefined || summary === null || summary === "") {
        summary =
          jsonSessionStorageArticle.find(
            (item: StorageItem) => item.type === "es-summary",
          )?.content || "";
      }

      if (summary) {
        summary = summary
          .replace(/<div>/g, "")
          .replace(/<\/div>/g, "")
          .trim();
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

    if (jsonArticle) {
      let preSavedBodyRef =
        jsonArticle.find((item: StorageItem) => item.type === dbFieldName)
          ?.content || "";

      preSavedBodyRef = preSavedBodyRef
        .replace(/<div>/g, "")
        .replace(/<\/div>/g, "")
        .replace(/<br\s*\/?/g, "___LINE_BREAK___")
        .replace(/___LINE_BREAK___/g, "<br>");

      const cleanedBody = cleanNestedDivs(preSavedBodyRef);

      let hydratedBody = cleanedBody;
      try {
        hydratedBody = await hydrateImagesInHTML(cleanedBody);
      } catch (e) {
        // ignore
      }

      useDraftStore.getState().loadDraftIntoEditor(
        savedTitleRef?.current ?? "",
        typeof hydratedBody === "string" ? hydratedBody : cleanedBody,
      );
    }
  };
  */

  // UPDATED — thin orchestrator using the SOLID handlers scaffold.
  // Compose default handler context and dispatch to registered handlers.
  const db = sessionStorage.getItem("dbName") || "DeCav";
  const ctx = defaultHandlerContext(db);
  try {
    await defaultDispatcher.dispatch(props.tag, props as DispatchProps, ctx);
  } catch (e) {
    console.error("[handleClick] dispatch failed", e);
  }
};

// CHANGE LOG
// Changed by : Copilot
// Date       : 2026-03-14
// Reason     : Replaced monolithic handleClick body with a thin orchestrator
//              that delegates to SOLID-friendly handlers (storage, processor,
//              editor loader). Original implementation retained above
//              commented for audit/history per repository rules.
// Impact     : Behavior unchanged for registered tags; future handlers can
//              be added by registering with `defaultDispatcher`.
