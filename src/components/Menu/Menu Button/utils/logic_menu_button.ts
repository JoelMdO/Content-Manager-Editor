import errorAlert from "@/components/alerts/error";
import saveButtonClicked from "./save_button_clicked";
import successAlert from "@/components/alerts/sucess";
// import handleNoteClick from "../../../../utils/playbook/handle_note_click";
// import emailMe from "../../../../utils/buttons/email_me";
import { useContext } from "react";
// import { customDashLogicProps } from "../../../../types/customDash_type";
import { debouncedUpdateStore } from "../../../../utils/dashboard/debounceUpdateStore";
// import { autoBatchEnhancer } from "@reduxjs/toolkit";
// import FontStyleUI from "../../../buttons/font_style_buttons";
import { handleSave } from "../../../../utils/dashboard/handle_save";
import { ButtonProps } from "../type/type_menu_button";
import { handleClear } from "../../../../utils/dashboard/handler_clear";
import MenuContext from "../../../../utils/context/menu_context";
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
// Save to sessionStorage on every change
///--------------------------------------------------------
export const saveDraft = ({
  dbNameToSearch,
  DRAFT_KEY,
  setIsClicked,
}: Partial<ButtonProps>) => {
  setIsClicked!(true);
  console.log("saving draft");
  console.log("dbNameToSearch:", dbNameToSearch);
  console.log("DRAFT_KEY:", DRAFT_KEY);

  const draft = sessionStorage.getItem(`articleContent-${dbNameToSearch}`);
  console.log("draft:", draft);

  if (draft) {
    console.log("Saving draft to localStorage:", draft);

    localStorage.setItem(DRAFT_KEY!, draft);
  }
  //debugger;
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
  console.log("Clearing UI with:", editorRefs, savedTitleRef, savedBodyRef);

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
  console.log("Opening dialog...", dialogRef?.current);
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
    console.log("Opening dialog...", sectionsDialogRef?.current);
    sectionsDialogRef!.current?.showModal();
  }
};
///--------------------------------------------------------
// Main Function to handle the cases of the CustomDashBoardButton
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
}: Partial<ButtonProps>) => {
  // onClick?.();
  console.log(
    "type at button logic:",
    type,
    "sectionsDialogRef:",
    sectionsDialogRef
  );

  switch (type) {
    case "image":
      loadImage({ fileInputRef, setIsClicked });
      break;
    case "link":
      console.log('"Opening link dialog...");', dialogRef);

      openLinkDialog({ dialogRef, setIsClicked });
      break;
    case "sections":
      console.log('"Opening sections dialog...");', sectionsDialogRef);

      openSelectorDialog({ sectionsDialogRef, setIsClicked });
      break;
    case "post":
      // post({ setIsClicked, italic, bold, router });
      post({ setIsClicked, router });
      break;
    case "save":
      saveDraft({ dbNameToSearch, DRAFT_KEY, setIsClicked });
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
