import { debouncedUpdateStore } from "@/utils/dashboard/debounceUpdateStore";
import { useContext, useEffect, useRef, useState } from "react";
import { handleKeyBoardActions } from "../utils/dashboard/handle_keyboard_actions";
import { handleContentChange } from "../utils/dashboard/handle_content_change";
import { ButtonProps } from "./Menu/Menu Button/type/type_menu_button";
// import { use } from "chai";
import MenuContext from "@/utils/context/menu_context";
import { useGetInitialArticleDraft } from "../hooks/useGetInitialArticleDraft";
// import { subtle } from "crypto";
import { useTranslatedArticleDraft } from "@/hooks/useTranslatedArticleDraft";

const DashboardEditor = () => {
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
    translationReady,
    isDraftArticleButtonClicked,
  } = useContext(MenuContext) as ButtonProps;
  //
  //
  //console.log("savedTitleRef at dashboard_editor:", savedTitleRef);
  //console.log("savedBodyRef at dashboard_editor:", savedBodyRef); // todo checking values when coming from localstorage
  //debugger;
  //--------------------------------------------------------
  // Read the sessionStorage on page initial load, based on the corresponded db.
  // And retrieve if any article is already created.
  //--------------------------------------------------------
  // useGetInitialArticleDraft();
  useEffect(() => {
    console.log("reloading dashboard_editor");
  }, [isDraftArticleButtonClicked]);
  ///--------------------------------------------------------
  // Get the translated article draft
  ///--------------------------------------------------------
  useEffect(() => {
    if (translationReady) {
      // console.log("Translation is ready, fetching translated draft...");
      // Fetch the translated article draft
      useTranslatedArticleDraft();
    }
  }, [translationReady]);
  ///--------------------------------------------------------
  // Save to localStorage every 10 minutes
  ///--------------------------------------------------------
  useEffect(() => {
    const interval = setInterval(() => {
      const draft = sessionStorage.getItem(`articleContent-${dbNameToSearch}`);
      const draftEsp = sessionStorage.getItem(
        `articleContent-${dbNameToSearch}-es`
      );
      //
      if (draft) {
        localStorage.setItem(DRAFT_KEY!, draft);
      }
      if (draftEsp) {
        localStorage.setItem(
          `draft-articleContent-${dbNameToSearch}-es`,
          draftEsp
        );
      }
    }, 600000); // 10 minutes
    return () => clearInterval(interval);
  }, []);
  ///--------------------------------------------------------
  // Save to localStorage on tab/browser close
  ///--------------------------------------------------------
  useEffect(() => {
    const handleBeforeUnload = () => {
      const draft = sessionStorage.getItem(DRAFT_KEY!);
      const draftEsp = sessionStorage.getItem(
        `articleContent-${dbNameToSearch}-es`
      );
      //
      if (draft) {
        localStorage.setItem(DRAFT_KEY!, draft);
      }
      if (draftEsp) {
        localStorage.setItem(
          `draft-articleContent-${dbNameToSearch}-es`,
          draftEsp
        );
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);
  ///--------------------------------------------------------
  // Get translated article draft
  ///--------------------------------------------------------

  ///---------------------------------------------------
  //  Cleanup debounce on unmount
  ///---------------------------------------------------
  useEffect(() => {
    return () => {
      debouncedUpdateStore.cancel();
    };
  }, []);
  //
  //
  ///--------------------------------------------------------
  // UI
  ///--------------------------------------------------------
  return (
    <div className="border border-gray-600 border-1px">
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
          {/* {index === 0
            ? savedTitleRef ||
              (isPlaceHolderTitle && (
                <span className="text-gray-400">{`${placeholder} here...`}</span>
              ))
            : savedBodyRef ||
              (isPlaceHolderArticle && (
                <span className="text-gray-400">{`Write your ${placeholder} here...`}</span>
              ))} */}
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
