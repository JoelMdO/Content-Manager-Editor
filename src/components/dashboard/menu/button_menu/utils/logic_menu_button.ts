import errorAlert from "@/components/alerts/error";
import postButtonClicked from "./post_button_clicked";
import successAlert from "@/components/alerts/sucess";
// import handleNoteClick from "../../../../utils/playbook/handle_note_click";
// import emailMe from "../../../../utils/buttons/email_me";
// import { useContext } from "react";
// import { customDashLogicProps } from "../../../../types/customDash_type";
import { debouncedUpdateStore } from "../../../utils/debounceUpdateStore";
// import { autoBatchEnhancer } from "@reduxjs/toolkit";
// import FontStyleUI from "../../../buttons/font_style_buttons";
import { handlePost } from "./handle_post";
import { ButtonProps } from "../type/type_menu_button";
import { handleClear } from "./handler_clear";
// import MenuContext from "../../../../utils/context/menu_context";
import translateButtonClicked from "./translate_button_clicked";
import router from "next/router";
import saveArticle from "@/components/dashboard/utils/save_article";
// import { set } from "cypress/types/lodash";
// import { useMenuContext } from "@/utils/context/menu_context";
///--------------------------------------------------------
// Post function to handle the save button click
///--------------------------------------------------------
export const post = ({ setIsClicked, router }: Partial<ButtonProps>) => {
  //

  handlePost(debouncedUpdateStore);
  setIsClicked!(true);
  // postButtonClicked(italic!, bold!)
  postButtonClicked()
    .then((response) => {
      setIsClicked!(false);
      if (response.status === 200) {
        successAlert("saved");
        //TODO check if needed to be saved again
        //Delete indexDB and localStorage
        //indexedDB.deleteDatabase("imageStore");
        //localStorage.clear();
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
  openDialogNoSection,
  setOpenDialogNoSection,
  sectionsDialogRef,
}: Partial<ButtonProps>) => {
  setIsClicked!(true);

  const dbName =
    typeof dbNameToSearch === "string"
      ? dbNameToSearch
      : dbNameToSearch?.current;
  ///--------------------------------------------------------
  // Load if any draft on sessionStorage
  ///--------------------------------------------------------
  saveArticle({
    dbName,
    currentTitle: "",
    currentBody: "",
    language,
    DRAFT_KEY,
    openDialogNoSection,
    setOpenDialogNoSection,
    sectionsDialogRef,
  });
  //
  setIsClicked!(false);
  //
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

  handleClear(editorRefs!);
  savedTitleRef!.current = "";
  savedBodyRef!.current = "";
  setSelectedSection!("Select category");
};
///--------------------------------------------------------
// Load Image
///--------------------------------------------------------
const loadImage = ({ fileInputRef, setIsClicked }: Partial<ButtonProps>) => {
  setIsClicked!(true);
  fileInputRef!.current?.click();
};
///--------------------------------------------------------
// Link
///--------------------------------------------------------
const openLinkDialog = ({ dialogRef, setIsClicked }: Partial<ButtonProps>) => {
  setIsClicked!(true);
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
  setTranslating!(true);
  translateButtonClicked()
    .then((response) => {
      setIsClicked!(false);
      setTranslating!(false);
      if (response.status === 200) {
        successAlert("translate");
        if (response.body) {
          const dbName = sessionStorage.getItem("db");

          // Get existing content
          const articleContent = JSON.parse(
            sessionStorage.getItem(`articleContent-${dbName}`) || "[]"
          );

          // Check if translation already exists
          // Remove all previous es-title, es-body, es-section items
          const filteredContent = articleContent.filter(
            (item: any) =>
              item.type !== "es-title" &&
              item.type !== "es-body" &&
              item.type !== "es-section"
            // item.type !== "body"
          );
          //
          const translated = (response.body as any).translated_text;
          const title = translated.title || "";
          const es_body = translated.body || "";
          const section = translated.section || "";
          // const body = response.sessionStorageBody || "";

          // Add new translation
          filteredContent.push({ type: "es-title", content: title });
          filteredContent.push({ type: "es-body", content: es_body });
          filteredContent.push({ type: "es-section", content: section });
          // filteredContent.push({ type: "body", content: body });

          // Store updated content in sessionStorage
          sessionStorage.setItem(
            `articleContent-${dbName}`,
            JSON.stringify(filteredContent)
          );

          // Also update localStorage if needed
          localStorage.setItem(
            `draft-articleContent-${dbName}`,
            JSON.stringify(filteredContent)
          );
          //

          // articleContent.push({ type: "es-title", content: title });
          // articleContent.push({ type: "es-body", content: es_body });
          // articleContent.push({ type: "es-section", content: section });
          // articleContent.push({ type: "body", content: body });
          //
          setTranslationReady!(true);
        }
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
// Main Function to handle the cases of the Menu Buttons
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
  openDialogNoSection,
  setOpenDialogNoSection,
}: Partial<ButtonProps>) => {
  // onClick?.();
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

      openLinkDialog({ dialogRef, setIsClicked });
      break;
    case "sections":

      openSelectorDialog({ sectionsDialogRef, setIsClicked });
      break;
    case "post":
      // post({ setIsClicked, italic, bold, router });
      post({ setIsClicked, router });
      break;
    case "save":
      saveDraft({
        dbNameToSearch,
        DRAFT_KEY,
        language,
        setIsClicked,
        openDialogNoSection,
        setOpenDialogNoSection,
        sectionsDialogRef,
      });
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
