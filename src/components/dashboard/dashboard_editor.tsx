import { debouncedUpdateStore } from "./utils/debounceUpdateStore";
import { useContext, useEffect } from "react";
import { handleKeyBoardActions } from "./utils/handle_keyboard_actions";
import { handleContentChange } from "./utils/handle_content_change";
import { ButtonProps } from "./menu/button_menu/type/type_menu_button";
import MenuContext from "@/components/dashboard/menu/button_menu/context/menu_context";
import { useTranslatedArticleDraft } from "../dashboard/hooks/useTranslatedArticleDraft";
import TranslationLoader from "../loaders/translation_loader";
import saveArticle from "./utils/save_article";

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
    setOpenDialogNoSection,
    openDialogNoSection,
    sectionsDialogRef,
  } = useContext(MenuContext) as ButtonProps;
  //
  //
  ///--------------------------------------------------------
  // Get the translated article draft
  ///--------------------------------------------------------
  useTranslatedArticleDraft();
  ///--------------------------------------------------------
  // Update of editorRefs on every change through draftArticle button
  // or when the text has been translated.
  ///--------------------------------------------------------
  useEffect(() => {
    const editableDiv = editorRefs?.current[1];
    if (editableDiv && savedBodyRef?.current) {
      editableDiv.innerHTML = savedBodyRef.current; // Force HTML rendering
    }
  }, [isDraftArticleButtonClicked, savedBodyRef?.current]);
  ///--------------------------------------------------------
  // Save to localStorage every 10 minutes (only if content exists)
  ///--------------------------------------------------------
  useEffect(() => {
    const interval = setInterval(() => {
      const dbName = sessionStorage.getItem("db");

      let currentTitle = editorRefs?.current[0]?.innerHTML || "";
      let currentBody = editorRefs?.current[1]?.innerHTML || "";
      saveArticle({
        dbName,
        currentTitle,
        currentBody,
        language,
        DRAFT_KEY,
        setOpenDialogNoSection,
      });

      setLastAutoSave(new Date());
      //}
    }, 10 * 60000); // 10 minutes.

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
  // Open the sections dialog when the section is not selected
  // and the autoSave has triggered.
  ///--------------------------------------------------------
  useEffect(() => {
    if (openDialogNoSection) {
      sectionsDialogRef?.current?.showModal();
    }
    setOpenDialogNoSection(false);
  }, [openDialogNoSection]);
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
