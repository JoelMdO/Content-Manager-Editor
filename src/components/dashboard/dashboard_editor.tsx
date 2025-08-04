import { debouncedUpdateStore } from "./utils/debounceUpdateStore";
import { useContext, useEffect, useRef, useState } from "react";
import { handleKeyBoardActions } from "./utils/handle_keyboard_actions";
import { handleContentChange } from "./utils/handle_content_change";
import { ButtonProps } from "./menu/button_menu/type/type_menu_button";
// import { use } from "chai";
import MenuContext from "@/components/dashboard/menu/button_menu/context/menu_context";
// import { useGetInitialArticleDraft } from "../../hooks/useGetInitialArticleDraft";
// import { subtle } from "crypto";
import { useTranslatedArticleDraft } from "../dashboard/hooks/useTranslatedArticleDraft";
import TranslationLoader from "../loaders/translation_loader";
// import removeBase64FromImgTags from "./menu/button_menu/utils/remove_img_base64";
import saveArticle from "./utils/save_article";
// import AutoSaveScreen from "../loaders/auto_save";

const DashboardEditor = () => {
  //
  //
  const {
    savedTitleRef,
    savedBodyRef,
    editorRefs,
    dbNameToSearch,
    DRAFT_KEY,
    setPlaceHolderArticle,
    setPlaceHolderTitle,
    isPlaceHolderTitle,
    isPlaceHolderArticle,
    isDraftArticleButtonClicked,
    isTranslating,
    setLastAutoSave,
    language,
  } = useContext(MenuContext) as ButtonProps;
  //
  //
  //console.log("savedTitleRef at dashboard_editor:", savedTitleRef);
  //console.log("savedBodyRef at dashboard_editor:", savedBodyRef);
  //debugger;
  ///--------------------------------------------------------
  // Get the translated article draft
  ///--------------------------------------------------------
  useTranslatedArticleDraft();
  //--------------------------------------------------------
  // Read the sessionStorage on page initial load, based on the corresponded db.
  // And retrieve if any article is already created.
  //--------------------------------------------------------
  // useGetInitialArticleDraft();
  useEffect(() => {
    //console.log("reloading dashboard_editor");
    console.log("savedTitleRef at dashboard_editor:", savedTitleRef);
    console.log("savedBodyRef at dashboard_editor:", savedBodyRef);
  }, [isDraftArticleButtonClicked]);
  ///--------------------------------------------------------
  // Save to localStorage every 10 minutes (only if content exists)
  ///--------------------------------------------------------
  useEffect(() => {
    console.log("Setting up auto-save every 1 minutes for db:", dbNameToSearch);

    const interval = setInterval(() => {
      const dbName = sessionStorage.getItem("db");
      console.log("dbName at useEffect update by timer:", dbName);

      let currentTitle = editorRefs?.current[0]?.innerHTML || "";
      let currentBody = editorRefs?.current[1]?.innerHTML || "";
      saveArticle({ dbName, currentTitle, currentBody, language, DRAFT_KEY });
      setLastAutoSave(new Date());
      //}
    }, 60000); // 1 minute //TODO change to 10 minutes.

    return () => clearInterval(interval);
  }, [dbNameToSearch, DRAFT_KEY]);
  ///---------------------------------------------------
  //  Cleanup debounce on unmount
  ///---------------------------------------------------
  useEffect(() => {
    return () => {
      debouncedUpdateStore.cancel();
    };
  }, []);
  //
  ///--------------------------------------------------------
  // Update of editorRefs on every change through draftArticle button
  // or when the text has been translated.
  ///--------------------------------------------------------
  useEffect(() => {
    const editableDiv = editorRefs?.current[1];
    if (editableDiv && savedBodyRef?.current) {
      editableDiv.innerHTML = savedBodyRef.current; // Force HTML rendering
    }
  }, [savedBodyRef?.current]);
  //
  ///--------------------------------------------------------
  // UI
  ///--------------------------------------------------------
  return (
    <div className="border border-gray-600 border-1px">
      {isTranslating && <TranslationLoader />}
      {["Title", "Article"].map((placeholder, index) => (
        <div
          key={index}
          ref={(el) => {
            // if (el && !editorRefs!.current[index]) {
            if (editorRefs && !editorRefs!.current[index]) {
              editorRefs!.current[index] = el;
            }
          }}
          className={`${
            placeholder === "Title"
              ? "h-[10dvh] font-bold"
              : "h-[70dvh] md:h-[85dvh] font-normal overflow-auto"
          } p-4 border rounded-g shadow-sm focus:outline-none cursor-pointer text-white`}
          contentEditable={true}
          onKeyDown={(e) => handleKeyBoardActions(e, index, editorRefs!)}
          suppressContentEditableWarning={true}
          onFocus={() =>
            index === 0
              ? setPlaceHolderTitle!(false)
              : setPlaceHolderArticle!(false)
          }
          onInput={(e) => {
            const content = (e.target as HTMLDivElement).innerHTML;
            handleContentChange(index, content, debouncedUpdateStore);
          }}
        >
          {index === 0
            ? savedTitleRef?.current
              ? savedTitleRef.current
              : isPlaceHolderTitle && (
                  <span className="text-gray-400">{`${placeholder} here...`}</span>
                )
            : savedBodyRef?.current
            ? savedBodyRef.current
            : isPlaceHolderArticle && (
                <span className="text-gray-400">{`Write your ${placeholder} here...`}</span>
              )}
        </div>
      ))}
    </div>
  );
};

export default DashboardEditor;
