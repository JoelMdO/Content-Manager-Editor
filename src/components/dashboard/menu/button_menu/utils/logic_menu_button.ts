import errorAlert from "@/components/alerts/error";
import postButtonClicked from "./post_button_clicked";
import successAlert from "@/components/alerts/sucess";
<<<<<<< HEAD
import { debouncedUpdateStore } from "../../../utils/debounceUpdateStore";
import { handlePost } from "./handle_post";
import { ButtonProps } from "../type/type_menu_button";
import { handleClear } from "./handler_clear";
import translateButtonClicked from "./translate_button_clicked";
import router from "next/router";
import saveArticle from "@/components/dashboard/utils/save_article";
=======
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
>>>>>>> 1295580d32457ddac461590b78b05994a943dd08
///--------------------------------------------------------
// Post function to handle the save button click
///--------------------------------------------------------
export const post = ({ setIsClicked, router }: Partial<ButtonProps>) => {
  //
<<<<<<< HEAD

  handlePost(debouncedUpdateStore);
  setIsClicked!(true);
=======
  console.log("post button clicked");

  handlePost(debouncedUpdateStore);
  setIsClicked!(true);
  // postButtonClicked(italic!, bold!)
>>>>>>> 1295580d32457ddac461590b78b05994a943dd08
  postButtonClicked()
    .then((response) => {
      setIsClicked!(false);
      if (response.status === 200) {
        successAlert("saved");
<<<<<<< HEAD
=======
        //TODO check if needed to be saved again
        //Delete indexDB and localStorage
        //indexedDB.deleteDatabase("imageStore");
        //localStorage.clear();
        //console.log('"Post response body:", response.body);');
>>>>>>> 1295580d32457ddac461590b78b05994a943dd08
      } else if (
        response.status === 401 ||
        response.message === "User not authenticated"
      ) {
        errorAlert("saved", "nonauth", response.message);
        router!.push("/");
<<<<<<< HEAD
      } else if (response.status === 206) {
        errorAlert("saved", "nonsection", response.message);
=======
>>>>>>> 1295580d32457ddac461590b78b05994a943dd08
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
<<<<<<< HEAD
  console.log("dNameToSearch", dbNameToSearch);

  const dbName =
    dbNameToSearch === undefined
      ? sessionStorage.getItem("db")
      : typeof dbNameToSearch === "string"
=======
  // console.log("saving draft");
  // console.log("dbNameToSearch:", dbNameToSearch);
  // console.log("DRAFT_KEY:", DRAFT_KEY);

  const dbName =
    typeof dbNameToSearch === "string"
>>>>>>> 1295580d32457ddac461590b78b05994a943dd08
      ? dbNameToSearch
      : dbNameToSearch?.current;
  ///--------------------------------------------------------
  // Load if any draft on sessionStorage
  ///--------------------------------------------------------
<<<<<<< HEAD
=======
  //console.log("dbName at saveDraft:", dbName);
>>>>>>> 1295580d32457ddac461590b78b05994a943dd08
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
<<<<<<< HEAD
=======
  console.log("Draft saved successfully");
>>>>>>> 1295580d32457ddac461590b78b05994a943dd08
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
<<<<<<< HEAD
=======
  // console.log("Clearing UI with:", editorRefs, savedTitleRef, savedBodyRef);

>>>>>>> 1295580d32457ddac461590b78b05994a943dd08
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
<<<<<<< HEAD
=======
  // console.log("Opening dialog...", dialogRef?.current);
>>>>>>> 1295580d32457ddac461590b78b05994a943dd08
  dialogRef!.current?.showModal();
};
///--------------------------------------------------------
// Styles
///--------------------------------------------------------
<<<<<<< HEAD
const openStylesDialog = ({ setIsFontStyleOpen }: Partial<ButtonProps>) => {
  setIsFontStyleOpen!((setIsFontStyleOpen) => !setIsFontStyleOpen);
=======
const openStylesDialog = ({
  // stylesDialogRef,
  setIsFontStyleOpen,
}: Partial<ButtonProps>) => {
  setIsFontStyleOpen!((setIsFontStyleOpen) => !setIsFontStyleOpen);
  //console.log("Opening dialog...", stylesDialogRef?.current);
  // stylesDialogRef!.current?.showModal();
>>>>>>> 1295580d32457ddac461590b78b05994a943dd08
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
<<<<<<< HEAD
=======
    //  console.log("Opening dialog...", sectionsDialogRef?.current);
>>>>>>> 1295580d32457ddac461590b78b05994a943dd08
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
<<<<<<< HEAD
=======
  console.log('"Translating article to Spanish at logic ...');
>>>>>>> 1295580d32457ddac461590b78b05994a943dd08
  setTranslating!(true);
  translateButtonClicked()
    .then((response) => {
      setIsClicked!(false);
      setTranslating!(false);
      if (response.status === 200) {
        successAlert("translate");
        if (response.body) {
          const dbName = sessionStorage.getItem("db");
<<<<<<< HEAD
=======
          console.log("Translating article for database:", dbName);
>>>>>>> 1295580d32457ddac461590b78b05994a943dd08

          // Get existing content
          const articleContent = JSON.parse(
            sessionStorage.getItem(`articleContent-${dbName}`) || "[]"
          );
<<<<<<< HEAD
=======
          console.log("Current article content:", articleContent);
>>>>>>> 1295580d32457ddac461590b78b05994a943dd08

          // Check if translation already exists
          // Remove all previous es-title, es-body, es-section items
          const filteredContent = articleContent.filter(
            (item: any) =>
              item.type !== "es-title" &&
              item.type !== "es-body" &&
<<<<<<< HEAD
              item.type !== "es-section"
=======
              item.type !== "es-section" &&
              item.type !== "body"
>>>>>>> 1295580d32457ddac461590b78b05994a943dd08
          );
          //
          const translated = (response.body as any).translated_text;
          const title = translated.title || "";
          const es_body = translated.body || "";
          const section = translated.section || "";
<<<<<<< HEAD
=======
          const body = response.sessionStorageBody || "";
>>>>>>> 1295580d32457ddac461590b78b05994a943dd08

          // Add new translation
          filteredContent.push({ type: "es-title", content: title });
          filteredContent.push({ type: "es-body", content: es_body });
          filteredContent.push({ type: "es-section", content: section });
<<<<<<< HEAD
=======
          filteredContent.push({ type: "body", content: body });
>>>>>>> 1295580d32457ddac461590b78b05994a943dd08

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
<<<<<<< HEAD
          //
=======

          articleContent.push({ type: "es-title", content: title });
          articleContent.push({ type: "es-body", content: es_body });
          articleContent.push({ type: "es-section", content: section });
          articleContent.push({ type: "body", content: body });
          //
          console.log("Setting translationReady to true");
>>>>>>> 1295580d32457ddac461590b78b05994a943dd08
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
<<<<<<< HEAD
=======
  //debugger;
>>>>>>> 1295580d32457ddac461590b78b05994a943dd08
};
///--------------------------------------------------------
// Main Function to handle the cases of the Menu Buttons
///--------------------------------------------------------

export const buttonMenuLogic = ({
  fileInputRef,
  dialogRef,
  sectionsDialogRef,
  setIsClicked,
<<<<<<< HEAD
=======
  // italic,
  // bold,
>>>>>>> 1295580d32457ddac461590b78b05994a943dd08
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
<<<<<<< HEAD
=======
  // onClick?.();
  // console.log(
  //   "type at button logic:",
  //   type,
  //   "sectionsDialogRef:",
  //   sectionsDialogRef
  // );

>>>>>>> 1295580d32457ddac461590b78b05994a943dd08
  switch (type) {
    case "image":
      loadImage({ fileInputRef, setIsClicked });
      break;
    case "link":
<<<<<<< HEAD
      openLinkDialog({ dialogRef, setIsClicked });
      break;
    case "sections":
      openSelectorDialog({ sectionsDialogRef, setIsClicked });
      break;
    case "post":
=======
      // console.log('"Opening link dialog...");', dialogRef);

      openLinkDialog({ dialogRef, setIsClicked });
      break;
    case "sections":
      // console.log('"Opening sections dialog...");', sectionsDialogRef);

      openSelectorDialog({ sectionsDialogRef, setIsClicked });
      break;
    case "post":
      // post({ setIsClicked, italic, bold, router });
      console.log('"post button clicked at logic_menu_button.ts"');
>>>>>>> 1295580d32457ddac461590b78b05994a943dd08
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
