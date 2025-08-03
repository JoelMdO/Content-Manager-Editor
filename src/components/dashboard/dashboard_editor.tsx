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
  useTranslatedArticleDraft(); // TODO working on translated received as JSON so easy to reuse
  //--------------------------------------------------------
  // Read the sessionStorage on page initial load, based on the corresponded db.
  // And retrieve if any article is already created.
  //--------------------------------------------------------
  // useGetInitialArticleDraft();
  useEffect(() => {
    //console.log("reloading dashboard_editor");
  }, [isDraftArticleButtonClicked]);
  ///--------------------------------------------------------
  // Get the translated article draft
  ///--------------------------------------------------------
  // useEffect(() => {
  //   if (translationReady) {
  // console.log("Translation is ready, fetching translated draft...");
  // Fetch the translated article draft
  // useTranslatedArticleDraft();
  //}
  // }, [translationReady]);
  ///--------------------------------------------------------
  // Save to localStorage every 10 minutes (only if content exists)
  ///--------------------------------------------------------
  useEffect(() => {
    console.log("Setting up auto-save every 1 minutes for db:", dbNameToSearch);
    const dbName =
      typeof dbNameToSearch === "string"
        ? dbNameToSearch
        : dbNameToSearch?.current || "";

    const interval = setInterval(() => {
      let currentTitle = editorRefs?.current[0]?.innerHTML || "";
      let currentBody = editorRefs?.current[1]?.innerHTML || "";
      saveArticle({ dbName, currentTitle, currentBody, language, DRAFT_KEY });
      // // Purpose: Check if the currentTitle contains a placeholder "Title" or a gray placeholder span.
      // //---------------------------------------------------------------------------------------------
      // // Get current content from the editor divs
      // let currentTitle = editorRefs?.current[0]?.innerHTML || "";
      // let currentBody = editorRefs?.current[1]?.innerHTML || "";
      // //console.log("currentBody at auto-save:", currentBody);
      // // Check for placeholders in the title
      // const hasTitlePlaceholder =
      //   /<span class="text-gray-400">.*?<\/span>/g.test(currentTitle) &&
      //   currentTitle.includes("Title");
      // console.log("hasTitlePlaceholdertitle:", hasTitlePlaceholder);
      // if (hasTitlePlaceholder) return;
      // // Check for placeholders in the body
      // const hasBodyPlaceholder =
      //   /<span class="text-gray-400">.*?<\/span>/g.test(currentBody) &&
      //   currentBody.includes("Article");
      // console.log("hasBodyPlaceholderBody:", hasBodyPlaceholder);
      // if (hasBodyPlaceholder) return;

      // // Load if any draft on localStorage
      // //------------------------------------------
      // const localStoreText = localStorage.getItem(
      //   `draft-articleContent-${dbName}`
      // );
      // const jsonArticle = JSON.parse(localStoreText || "[]");
      // //console.log("article at draft article:", jsonArticle);

      // let localStoredTitle =
      //   jsonArticle.find((item: any) => item.type === "title")?.content || "";
      // let localStoredBody =
      //   jsonArticle.find((item: any) => item.type === "body")?.content || "";
      // // console.log("storedTitle at auto-save:", storedTitle);
      // // console.log("storedBody at auto-save:", storedBody);
      // //
      // // Load if any draft on sessionStorage
      // //------------------------------------------
      // const sessionStoreText = sessionStorage.getItem(
      //   `articleContent-${dbName}`
      // );
      // const sessionJsonArticle = JSON.parse(sessionStoreText || "[]");
      // //console.log("article at draft article:", jsonArticle);

      // let sessionStoredTitle =
      //   sessionJsonArticle.find((item: any) => item.type === "title")
      //     ?.content || "";
      // let sessionStoredBody =
      //   sessionJsonArticle.find((item: any) => item.type === "body")?.content ||
      //   "";
      // // Purpose: Compare textTitle and textBody with local Storage storedTitleRef and storedBodyRef
      // //------------------------------------------
      // const titles = [sessionStoredTitle, localStoredTitle];
      // console.log("titles at auto-save befpre map:", titles);

      // const cleanTitleText = titles.map((title) => {
      //   // If title is a RefObject, use its current value; otherwise, use as is
      //   const strTitle =
      //     typeof title === "string" ? title : title?.current || "";
      //   return strTitle
      //     .replace(/<span class="text-gray-400">.*?<\/span>/g, "")
      //     .replace(/<[^>]*>/g, "")
      //     .trim();
      // });
      // console.log("Title 1:", cleanTitleText[0]);
      // console.log("Title 2:", cleanTitleText[1]);
      // //
      // //
      // if (cleanTitleText[0] !== cleanTitleText[1]) {
      //   console.log("different title:", cleanTitleText[0]);
      //   currentTitle = cleanTitleText[0];
      // }
      // //
      // const content = [sessionStoredBody, localStoredBody];
      // let images: object[] = [];
      // console.log("content at auto-save before map:", content);

      // const cleanBodyText = content.map((body) => {
      //   const strBody = typeof body === "string" ? body : body?.current || "";
      //   return strBody
      //     .replace(/<span class="text-gray-400">.*?<\/span>/g, "")
      //     .replace(/<img[^>]*?>/gi, "")
      //     .trim();
      //   // .replace(/<img\b[^>]*\bsrc=["']blob:[^"']*["'][^>]*>/gi, "")
      // });
      // //

      // if (
      //   cleanTitleText[0] === cleanTitleText[1] &&
      //   cleanBodyText[0] === cleanBodyText[1]
      // ) {
      //   console.log("⏳ No content changes detected — skipping auto-save.");
      //   return;
      // }
      // //
      // if (cleanBodyText[0] !== cleanBodyText[1]) {
      //   console.log(
      //     "different cleanBody:"
      //     // cleanBodyText[0],
      //     // "currentBody:",
      //     // currentBody
      //   );
      //   //
      //   currentBody = cleanBodyText[0].replace(
      //     /<img[^>]*?>/gi,
      //     '<img src="{image_url_placeholder}">'
      //   );
      //   // Check on images
      //   const sessionStoredImages = JSON.parse(
      //     sessionStorage.getItem(`articleContent-${dbName}`) || "[]"
      //   ).filter((item: any) => item.type === "image");
      //   const localStoredImages = JSON.parse(
      //     localStorage.getItem(`draft-articleContent-${dbName}`) || "[]"
      //   ).filter((item: any) => item.type === "image");
      //   const areArraysEqual =
      //     JSON.stringify(sessionStoredImages.sort()) ===
      //     JSON.stringify(localStoredImages.sort());
      //   console.log("sessionStoredImages:", sessionStoredImages);
      //   console.log("localStoredImages:", localStoredImages);

      //   console.log("Are arrays equal (ignoring order)?", areArraysEqual);
      //   if (!areArraysEqual) {
      //     //==========================================
      //     // Original Code (Preserved for Reference)
      //     //==========================================
      //     // images = sessionStoredImages.filter((item: any) =>
      //     //   localStoredImages.some(
      //     //     (localItem: any) =>
      //     //       JSON.stringify(localItem) === JSON.stringify(item)
      //     //   )
      //     // );

      //     //------------------------------------------
      //     // Purpose: Find images that are present in either sessionStoredImages or localStoredImages but not both, based on unique imageId and fileName.
      //     //------------------------------------------
      //     images = [
      //       ...sessionStoredImages.filter(
      //         (sessionImg: any) =>
      //           !localStoredImages.some(
      //             (localImg: any) =>
      //               sessionImg.imageId === localImg.imageId &&
      //               sessionImg.fileName === localImg.fileName
      //           )
      //       ),
      //       ...localStoredImages.filter(
      //         (localImg: any) =>
      //           !sessionStoredImages.some(
      //             (sessionImg: any) =>
      //               localImg.imageId === sessionImg.imageId &&
      //               localImg.fileName === sessionImg.fileName
      //           )
      //       ),
      //     ];
      //     console.log("images at auto-save:", images);
      //   }
      //   //
      // }
      // // console.log("cleanTitle:", cleanTitle);
      // // console.log("cleanBody:", cleanBody);
      // let articleData = [];
      // //Load current images if any
      // //------------------------------------------
      // // Purpose: Safely get the db name from either a string or a ref object for sessionStorage key.
      // //------------------------------------------
      // //console.log("Body 1 ready to save:", currentBody);
      // //console.log("Title 2 ready to save:", currentTitle);
      // const id = JSON.parse(
      //   sessionStorage.getItem(`articleContent-${dbName}`) || "[]"
      // ).filter((item: any) => item.type === "id");
      // //console.log("images at auto-save:", images);
      // //console.log("id at auto-save:", id);
      // // console.log("images at auto-save:", images);
      // const htmlCleanedBody = removeBase64FromImgTags(currentBody);
      // console.log("htmlCleanedBody at auto-save:", htmlCleanedBody);

      // if (language === "en") {
      //   //
      //   articleData = [
      //     { type: "title", content: currentTitle },
      //     { type: "body", content: htmlCleanedBody },
      //     ...images,
      //     ...id,
      //   ];
      //   console.log("Auto-saving content to localStorage: EN", articleData);

      //   const articleJson = JSON.stringify(articleData);
      //   console.log("Article JSON at auto-save:", articleJson);

      //   localStorage.setItem(DRAFT_KEY!, articleJson);
      // } else {
      //   articleData = [
      //     { type: "es-title", content: currentTitle },
      //     { type: "es-body", content: htmlCleanedBody },
      //     ...images,
      //     ...id,
      //   ];

      //   const articleJson = JSON.stringify(articleData);
      //   localStorage.setItem(DRAFT_KEY!, articleJson);
      //   // console.log("✅ Auto-saved content to localStorage:", {
      //   //   title: cleanTitle ? "Has content" : "Empty",
      //   //   body: cleanBody ? "Has content" : "Empty",
      //   //   timestamp: new Date().toISOString(),
      //   // });
      // }
      setLastAutoSave(new Date());
      //}
    }, 60000); // 1 minute //TODO change to 10 minutes.

    return () => clearInterval(interval);
  }, [dbNameToSearch, DRAFT_KEY, editorRefs]);
  ///--------------------------------------------------------
  // Save to localStorage on tab/browser close
  ///--------------------------------------------------------
  //TODO: Implement this feature
  ///--------------------------------------------------------
  // Get changes on savedBodyRef when a draft click is made to load the article
  ///--------------------------------------------------------
  useEffect(() => {
    if (editorRefs.current && savedBodyRef.current) {
      editorRefs.current[1]!.innerHTML = savedBodyRef.current;
    }
  }, [savedBodyRef.current]);
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
