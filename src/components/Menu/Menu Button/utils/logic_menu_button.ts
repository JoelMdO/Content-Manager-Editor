import errorAlert from "@/components/alerts/error";
import saveButtonClicked from "./save_button_clicked";
import successAlert from "@/components/alerts/sucess";
// import handleNoteClick from "../../../../utils/playbook/handle_note_click";
// import emailMe from "../../../../utils/buttons/email_me";
// import { useContext } from "react";
// import { customDashLogicProps } from "../../../../types/customDash_type";
import { debouncedUpdateStore } from "../../../../utils/dashboard/debounceUpdateStore";
// import { autoBatchEnhancer } from "@reduxjs/toolkit";
// import FontStyleUI from "../../../buttons/font_style_buttons";
import { handleSave } from "../../../../utils/dashboard/handle_save";
import { ButtonProps } from "../type/type_menu_button";
import { handleClear } from "../../../../utils/dashboard/handler_clear";
// import MenuContext from "../../../../utils/context/menu_context";
import translateButtonClicked from "./translate_button_clicked";
import router from "next/router";
import { set } from "cypress/types/lodash";
// import { useMenuContext } from "@/utils/context/menu_context";
///--------------------------------------------------------
// Post function to handle the save button click
///--------------------------------------------------------
export const post =
  // ({ setIsClicked, italic, bold, router }: Partial<ButtonProps>) =>


    ({ setIsClicked, router }: Partial<ButtonProps>) =>
    () => {
      //
      handleSave(debouncedUpdateStore);
      setIsClicked!(true);
      // saveButtonClicked(italic!, bold!)
      saveButtonClicked()
        .then((response) => {
          setIsClicked!(false);
          if (response.status === 200) {
            successAlert("saved");
            //TODO check if needed to be saved again
            if (response.body) {
              const dbName = sessionStorage.getItem("db");
              const articleContent = JSON.parse(
                sessionStorage.getItem(`articleContent-${dbName}`) || "[]"
              );
              articleContent.push({ type: "body", content: response.body });
            }
          } else if (
            response.status === 401 ||
            response.message === "User not authenticated"
          ) {
            errorAlert("saved", "nonauth", response.message);
            router!.push("/");
          } else {
            errorAlert("saved", "non200", response.message);
          }
        })
        .catch((error) => {
          setIsClicked!(false);
          errorAlert("saved", "error", error);
        });
    };
///--------------------------------------------------------
// Save to sessionStorage on every change
///--------------------------------------------------------
export const saveDraft = ({
  dbNameToSearch,
  DRAFT_KEY,
  setIsClicked,
  language,
}: Partial<ButtonProps>) => {
  setIsClicked!(true);
  // console.log("saving draft");
  // console.log("dbNameToSearch:", dbNameToSearch);
  // console.log("DRAFT_KEY:", DRAFT_KEY);

  const dbName =
    typeof dbNameToSearch === "string"
      ? dbNameToSearch
      : dbNameToSearch?.current;
  ///--------------------------------------------------------
  // Load if any draft on sessionStorage
  ///--------------------------------------------------------
  const draft = sessionStorage.getItem(`articleContent-${dbName}`);

  if (draft) {
    const articleContent = JSON.parse(draft);
    // console.log("articleContent:", articleContent);
    const newTitle =
      articleContent.find((item: any) => item.type === "title")?.content || "";
    const newBody =
      articleContent.find((item: any) => item.type === "body")?.content || "";
    const newTitleEsp =
      articleContent.find((item: any) => item.type === "es-title")?.content ||
      "";
    const newBodyEsp =
      articleContent.find((item: any) => item.type === "es-body")?.content ||
      "";

    //Check if the draft has been already saved on the localStorage
    const existingDraft = localStorage.getItem(DRAFT_KEY!);

    if (existingDraft) {
      const draftContent = JSON.parse(existingDraft);
      // console.log("Draft content found:", draftContent);
      // Remove the current language's title/body
      const filtered = draftContent.filter(
        (item: any) =>
          item.type !== (language === "en" ? "title" : "es-title") &&
          item.type !== (language === "en" ? "body" : "es-body")
      );

      // Add the new content
      filtered.push({
        type: language === "en" ? "title" : "es-title",
        content: newTitle,
      });
      filtered.push({
        type: language === "en" ? "body" : "es-body",
        content: newBody,
      });
    } else {
      //  console.log("Saving draft to localStorage:", draft);
      localStorage.setItem(DRAFT_KEY!, draft);
    }
    //debugger;
  }
};
///--------------------------------------------------------
// Clear the UI
///--------------------------------------------------------
export const clearUI = ({
  editorRefs,
  setSelectedSection,
  savedTitleRef,
  savedBodyRef,
  setIsClicked,
}: Partial<ButtonProps>) => {
  setIsClicked!(true);
  // console.log("Clearing UI with:", editorRefs, savedTitleRef, savedBodyRef);

  handleClear(editorRefs!);
  savedTitleRef!.current = "";
  savedBodyRef!.current = "";
  setSelectedSection!("Select category");
};
///--------------------------------------------------------
// Load Image
///--------------------------------------------------------
const loadImage = ({ fileInputRef, setIsClicked }: Partial<ButtonProps>) => {
  // setIsClicked!(true);
  fileInputRef!.current?.click();
};
///--------------------------------------------------------
// Link
///--------------------------------------------------------
const openLinkDialog = ({ dialogRef, setIsClicked }: Partial<ButtonProps>) => {
  setIsClicked!(true);
  // console.log("Opening dialog...", dialogRef?.current);
  dialogRef!.current?.showModal();
};
///--------------------------------------------------------
// Styles
///--------------------------------------------------------
const openStylesDialog = ({
  // stylesDialogRef,
  setIsFontStyleOpen,
}: Partial<ButtonProps>) => {
  setIsFontStyleOpen!((setIsFontStyleOpen) => !setIsFontStyleOpen);
  //console.log("Opening dialog...", stylesDialogRef?.current);
  // stylesDialogRef!.current?.showModal();
};
///--------------------------------------------------------
// Section Selector
///--------------------------------------------------------
const openSelectorDialog = ({
  sectionsDialogRef,
  setIsClicked,
}: Partial<ButtonProps>) => {
  setIsClicked!(true);
  if (sectionsDialogRef?.current) {
    //  console.log("Opening dialog...", sectionsDialogRef?.current);
    sectionsDialogRef!.current?.showModal();
  }
};
///--------------------------------------------------------
// Translate to Spanish
///--------------------------------------------------------
export const translateToSpanish = ({
  setTranslationReady,
  setIsClicked,
  setTranslating,
}: Partial<ButtonProps>) => {
  setIsClicked!(true);
  console.log('"Translating article to Spanish at logic ...');
  setTranslating!(true);
  translateButtonClicked()
    .then((response) => {
      setIsClicked!(false);
      setTranslating!(false);
      if (response.status === 200) {
        successAlert("translate");
        if (response.body) {
          const dbName = sessionStorage.getItem("db");
          console.log("Translating article for database:", dbName);

          // Get existing content
          const articleContent = JSON.parse(
            sessionStorage.getItem(`articleContent-${dbName}`) || "[]"
          );
          console.log("Current article content:", articleContent);

          // Check if translation already exists
          // Remove all previous es-title, es-body, es-section items
          const filteredContent = articleContent.filter(
            (item: any) =>
              item.type !== "es-title" &&
              item.type !== "es-body" &&
              item.type !== "es-section"
          );
          //
          const translated = (response.body as any).translated_text;
          const title = translated.title || "";
          const body = translated.body || "";
          const section = translated.section || "";

          // Add new translation
          filteredContent.push({ type: "es-title", content: title });
          filteredContent.push({ type: "es-body", content: body });
          filteredContent.push({ type: "es-section", content: section });

          // Store updated content in sessionStorage
          sessionStorage.setItem(
            `articleContent-${dbName}`,
            JSON.stringify(filteredContent)
          );

          // Also update localStorage if needed
          localStorage.setItem(
            `articleContent-${dbName}`,
            JSON.stringify(filteredContent)
          );
          //

          articleContent.push({ type: "es-title", content: title });
          articleContent.push({ type: "es-body", content: body });
          articleContent.push({ type: "es-section", content: section });
        }
        setTranslationReady!(true);
      } else if (
        response.status === 401 ||
        response.message === "User not authenticated"
      ) {
        errorAlert("translate", "nonTranslated", response.message);
        router!.push("/");
      } else {
        errorAlert("translate", "nonTranslated", response.message);
      }
    })
    .catch((error) => {
      setIsClicked!(false);
      errorAlert("translate", "error", error);
    });
  //debugger;
};
///--------------------------------------------------------
// Main Function to handle the cases of the playbookCustomButton
///--------------------------------------------------------

export const buttonMenuLogic = ({
  fileInputRef,
  dialogRef,
  sectionsDialogRef,
  setIsClicked,
  // italic,
  // bold,
  router,
  dbNameToSearch,
  DRAFT_KEY,
  savedTitleRef,
  savedBodyRef,
  setSelectedSection,
  editorRefs,
  type,
  stylesDialogRef,
  setIsFontStyleOpen,
  setTranslationReady,
  setTranslating,
  language,
}: Partial<ButtonProps>) => {
  // onClick?.();
  // console.log(
  //   "type at button logic:",
  //   type,
  //   "sectionsDialogRef:",
  //   sectionsDialogRef
  // );

  switch (type) {
    case "image":
      loadImage({ fileInputRef, setIsClicked });
      break;
    case "link":
      // console.log('"Opening link dialog...");', dialogRef);

      openLinkDialog({ dialogRef, setIsClicked });
      break;
    case "sections":
      // console.log('"Opening sections dialog...");', sectionsDialogRef);

      openSelectorDialog({ sectionsDialogRef, setIsClicked });
      break;
    case "post":
      // post({ setIsClicked, italic, bold, router });
      post({ setIsClicked, router });
      break;
    case "save":
      saveDraft({ dbNameToSearch, DRAFT_KEY, language, setIsClicked });
      break;
    case "translate":
      translateToSpanish({
        setIsClicked,
        setTranslationReady,
        setTranslating,
      });
      break;
    case "clear":
      clearUI({
        editorRefs,
        setSelectedSection,
        savedTitleRef,
        savedBodyRef,
        setIsClicked,
      });
      break;
    default:
      openStylesDialog({ stylesDialogRef, setIsFontStyleOpen });
      break;
  }
};
