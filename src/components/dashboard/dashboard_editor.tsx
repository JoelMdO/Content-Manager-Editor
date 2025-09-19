import { debouncedUpdateStore } from "./utils/debounceUpdateStore";
import { useContext, useEffect } from "react";
import { handleKeyBoardActions } from "./utils/handle_keyboard_actions";
import { handleContentChange } from "./utils/handle_content_change";
import { ButtonProps } from "./menu/button_menu/type/type_menu_button";
import MenuContext from "@/components/dashboard/menu/button_menu/context/menu_context";
import { useTranslatedArticleDraft } from "../dashboard/hooks/useTranslatedArticleDraft";
import DialogsLoader from "../../components/loaders/dialogs_loader";
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
    setText,
    isSummary,
    isLoadingPreview,
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
      // Check for any remaining image placeholders and log them
      const hasPlaceholders = savedBodyRef.current.includes(
        "{image_url_placeholder}"
      );
      if (hasPlaceholders) {
        console.warn("Found unprocessed image placeholders in content:", {
          content: savedBodyRef.current,
        });
      }

      // Ensure no unprocessed placeholders remain
      let processedContent = savedBodyRef.current;
      if (processedContent.includes("{image_url_placeholder}")) {
        // Try to get images from session storage
        const dbName = sessionStorage.getItem("db");
        const articleContent = JSON.parse(
          sessionStorage.getItem(`articleContent-${dbName}`) || "[]"
        );
        const images = articleContent.filter(
          (item: any) => item.type === "image"
        );

        console.log("Available images for placeholder replacement:", images);

        // Replace any remaining placeholders with actual image data
        images.forEach((image: any) => {
          const imgSource = image.base64 || image.blobUrl;
          if (imgSource) {
            const imageIdentifier = image.imageId || image.id;
            console.log("Dashboard editor trying to replace image:", {
              imageIdentifier,
              contentHasId: processedContent.includes(imageIdentifier),
            });

            const placeholder = new RegExp(
              `<img[^>]*src=["']{image_url_placeholder}["'][^>]*>\\s*<p[^>]*>${imageIdentifier}</p>`,
              "g"
            );
            processedContent = processedContent.replace(
              placeholder,
              `<img src="${imgSource}" alt="${imageIdentifier}" width="25%"/><p class="text-xs text-gray-500" style="justify-self: center;">${imageIdentifier}</p>`
            );
          }
        });
      }

      editableDiv.innerHTML = processedContent; // Force HTML rendering
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
      {isTranslating && <DialogsLoader type={"translation"} />}
      {isSummary && <DialogsLoader type={"summary"} />}
      {isLoadingPreview && <DialogsLoader type={"preview"} />}
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
              : "h-[70dvh] md:h-[85dvh] overflow-auto"
          } p-4 border rounded-g shadow-sm focus:outline-none cursor-pointer text-blue-light`}
          contentEditable={true}
          onKeyDown={(e) => handleKeyBoardActions(e, index, editorRefs!)}
          onInput={(e) => {
            const element = e.currentTarget as HTMLElement;
            console.log("content with styles:", element);
            handleContentChange(
              index,
              element,
              language,
              setText,
              debouncedUpdateStore
            );
          }}
          suppressContentEditableWarning={true}
          onFocus={() =>
            index === 0
              ? setPlaceHolderTitle!(false)
              : setPlaceHolderArticle!(false)
          }
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
