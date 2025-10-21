import { debouncedUpdateStore } from "./utils/debounceUpdateStore";
import { useContext, useEffect } from "react";
import { handleKeyBoardActions } from "./utils/handle_keyboard_actions";
import { handleContentChange } from "./utils/handle_content_change";
import { ButtonProps } from "./menu/button_menu/type/type_menu_button";
import MenuContext from "@/components/dashboard/menu/button_menu/context/menu_context";
import { useTranslatedArticleDraft } from "../dashboard/hooks/useTranslatedArticleDraft";
import DialogsLoader from "../../components/loaders/dialogs_loader";
import saveArticle from "./utils/save_article";
import DOMPurify from "dompurify";
import { cleanNestedDivs } from "./utils/clean_content";
import { ImageItem } from "@/types/image_item";

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
    article,
    isMarkdownText,
    setIsMarkdownText,
  } = useContext(MenuContext) as ButtonProps;
  //
  //
  ///--------------------------------------------------------
  // Add evenlisteners to editorRefs on mount
  ///--------------------------------------------------------
  useEffect(() => {
    const editableBodyDiv = editorRefs?.current[1];
    if (!editableBodyDiv) return;

    // Handle paste
    const handlePaste = (e: ClipboardEvent) => {
      e.preventDefault();
      const text = e.clipboardData?.getData("text/plain") || "";
      const selection = window.getSelection();
      if (!selection || !selection.rangeCount) return;
      const range = selection.getRangeAt(0);
      range.deleteContents();

      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = text
        .split("\n")
        .map((line) => `<p>${line}</p>`)
        .join("");

      const frag = document.createDocumentFragment();
      Array.from(tempDiv.childNodes).forEach((node) => frag.appendChild(node));

      range.insertNode(frag);
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
    };

    // Handle cut
    const handleCut = () => {
      // Use a small delay to check DOM after cut
      requestAnimationFrame(() => {
        editableBodyDiv.querySelectorAll("p, div, span").forEach((el) => {
          if (el.textContent?.trim() === "" && !el.querySelector("img, a")) {
            el.remove();
          }
        });
      });
    };

    // ✅ Add listeners
    editableBodyDiv.addEventListener("paste", handlePaste);
    editableBodyDiv.addEventListener("cut", handleCut);

    // 🧹 Clean up on unmount
    return () => {
      editableBodyDiv.removeEventListener("paste", handlePaste);
      editableBodyDiv.removeEventListener("cut", handleCut);
    };
  }, [editorRefs]);

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
    if (editableDiv && savedBodyRef?.current && !article?.content) {
      // Check if content is markdown
      let processedContent = savedBodyRef.current;
      // Clean if any nested html tags
      processedContent = cleanNestedDivs(processedContent);
      // Check for any remaining image placeholders and log them
      const hasPlaceholders = savedBodyRef.current.includes(
        "{image_url_placeholder}"
      );
      if (hasPlaceholders) {
        //TODO ADD LOGS
        // console.warn("Found unprocessed image placeholders in content:", {
        //   content: savedBodyRef.current,
        // });
      }

      // Ensure no unprocessed placeholders remain
      if (processedContent.includes("{image_url_placeholder}")) {
        // Try to get images from session storage
        //console.log(
        //   "Process includes image placeholders, checking session storage."
        // );

        const dbName = sessionStorage.getItem("db");
        //console.log(
        //   "Dashboard editor checking session storage for db:",
        //   dbName
        // );

        const localArticle = localStorage.getItem(
          `draft-articleContent-${dbName}`
        );
        const articleContent = JSON.parse(localArticle!);
        const images: ImageItem[] = articleContent.filter((item: ImageItem) =>
          item.type!.startsWith("image")
        );

        //console.log("Available images for placeholder replacement:", images);

        // Replace any remaining placeholders with actual image data
        images.forEach((image: ImageItem) => {
          const imgSource = image.base64 || image.blobUrl;
          if (imgSource) {
            const imageIdentifier = image.imageId || image.id;
            //console.log("Dashboard editor trying to replace image:", {
            //   imageIdentifier,
            //   contentHasId: processedContent.includes(imageIdentifier),
            // });

            const placeholder = new RegExp(
              `<img[^>]*src=["']{image_url_placeholder}["'][^>]*>\\s*<p[^>]*>${imageIdentifier}</p>`,
              "g"
            );
            processedContent = processedContent.replace(
              placeholder,
              `<img src="${imgSource}" alt="${imageIdentifier}" width="150" height="150" style="justify-self: center;"/><p class="text-xs text-gray-500" style="justify-self: center;">${imageIdentifier}</p>`
            );
          }
        });
      }

      editableDiv.innerHTML = processedContent; // Force HTML rendering
    }
  }, [isDraftArticleButtonClicked, savedBodyRef, article, editorRefs]);
  ///--------------------------------------------------------
  // Set HTML content from Preview Editor
  ///--------------------------------------------------------
  useEffect(() => {
    //console.log("loading article html");
    if (!article?.content || !article?.title) {
      //console.log("No article content or title available yet");
      return;
    }

    const editableBodyDiv = editorRefs?.current[1];
    const editableTitleDiv = editorRefs?.current[0];
    // console.warn("article at UseEffect", article);
    // Check if both divs exist before setting innerHTML
    if (editableBodyDiv && editableTitleDiv && article) {
      //console.log("article at UseEffect on if", article);

      try {
        // Sanitize content before setting innerHTML
        const sanitizedTitle = DOMPurify.sanitize(article.title);
        const sanitizedContent = DOMPurify.sanitize(article.content);

        editableTitleDiv.innerHTML = sanitizedTitle;
        editableBodyDiv.innerHTML = sanitizedContent;

        // Update markdown state
        setIsMarkdownText(false);
      } catch {
        // console.error("Error setting article content:", error);
      }
    }
  }, [article, editorRefs, setIsMarkdownText]);
  ///--------------------------------------------------------
  // Save to localStorage every 10 minutes (only if content exists)
  ///--------------------------------------------------------
  useEffect(() => {
    const interval = setInterval(() => {
      const dbName = sessionStorage.getItem("db");

      const currentTitle = editorRefs?.current[0]?.innerHTML || "";
      const currentBody = editorRefs?.current[1]?.innerHTML || "";
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
  }, [
    dbNameToSearch,
    DRAFT_KEY,
    editorRefs,
    language,
    setLastAutoSave,
    setOpenDialogNoSection,
  ]);
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
  }, [openDialogNoSection, sectionsDialogRef, setOpenDialogNoSection]);
  ///--------------------------------------------------------
  // UI
  ///--------------------------------------------------------
  return (
    <div className="border border-gray-600 border-1px">
      {isTranslating && <DialogsLoader type={"translation"} />}
      {isSummary && <DialogsLoader type={"summary"} />}
      {isLoadingPreview && <DialogsLoader type={"preview"} />}
      {isMarkdownText && <DialogsLoader type={"load_html"} />}
      {["Title", "Article"].map((placeholder, index) => (
        <div
          key={index}
          ref={(el) => {
            // if (el && !editorRefs!.current[index]) {
            if (editorRefs) {
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
            //console.log("content with styles:", element);
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
