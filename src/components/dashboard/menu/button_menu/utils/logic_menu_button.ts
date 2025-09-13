import errorAlert from "@/components/alerts/error";
import postButtonClicked from "./post_button_clicked";
import successAlert from "@/components/alerts/sucess";
import { debouncedUpdateStore } from "../../../utils/debounceUpdateStore";
import { handlePost } from "./handle_post";
import { ButtonProps } from "../type/type_menu_button";
import { handleClear } from "./handler_clear";
import translateButtonClicked from "./translate_button_clicked";
import router from "next/router";
import saveArticle from "@/components/dashboard/utils/save_article";
import summaryButtonClicked from "./summary_button_clicked";
import { current } from "@reduxjs/toolkit";
import { set } from "lodash";
///--------------------------------------------------------
// Post function to handle the save button click
///--------------------------------------------------------
export const post = ({ setIsClicked, router }: Partial<ButtonProps>) => {
  //

  handlePost(debouncedUpdateStore);
  setIsClicked!(true);
  postButtonClicked()
    .then((response) => {
      if (response.status === 200) {
        successAlert("saved");
      } else if (
        response.status === 401 ||
        response.message === "User not authenticated"
      ) {
        errorAlert("saved", "nonauth", response.message);
        router!.push("/");
      } else if (response.status === 206) {
        errorAlert("saved", "nonsection", response.message);
      } else {
        errorAlert("saved", "non200", response.message);
      }
    })
    .catch((error) => {
      errorAlert("saved", "error", error);
    })
    .finally(() => {
      setTimeout(() => {
        setIsClicked!(false);
      }, 500);
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
  console.log("dNameToSearch", dbNameToSearch);

  const dbName =
    dbNameToSearch === undefined
      ? sessionStorage.getItem("db")
      : typeof dbNameToSearch === "string"
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
  setTimeout(() => {
    setIsClicked!(false);
  }, 1000);
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
  dialogRef?.current!.showModal();
};
///--------------------------------------------------------
// Styles
///--------------------------------------------------------
const openStylesDialog = ({ setIsFontStyleOpen }: Partial<ButtonProps>) => {
  setIsFontStyleOpen!((setIsFontStyleOpen) => !setIsFontStyleOpen);
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
          );
          //
          const translated = (response.body as any).translated_text;
          const title = translated.title || "";
          const es_body = translated.body || "";
          const section = translated.section || "";

          // Add new translation
          filteredContent.push({ type: "es-title", content: title });
          filteredContent.push({ type: "es-body", content: es_body });
          filteredContent.push({ type: "es-section", content: section });

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
    })
    .finally(() => {
      setTimeout(() => {
        setIsClicked!(false);
      }, 500);
    });
};
///--------------------------------------------------------
// Summary
///--------------------------------------------------------
export const getSummary = ({
  setIsClicked,
  summaryDialogRef,
  setIsSummary,
  setSummaryContent,
  setLanguage,
}: Partial<ButtonProps>) => {
  if (!summaryDialogRef?.current) return;

  setIsClicked!(true);
  setIsSummary!(true); // Needed for DialogsLoader

  // Call summary creation
  summaryButtonClicked({ setSummaryContent })
    .then((response) => {
      if (response?.status === 200) {
        setLanguage!("en");
        // Only show modal if ref exists and we got successful response
        if (summaryDialogRef?.current) {
          summaryDialogRef.current.showModal();
        }
      } else {
        errorAlert(
          "summary",
          "nonSummary",
          response?.summary || "Failed to create summary"
        );
      }
    })
    .catch((error) => {
      errorAlert("summary", "error", error);
    })
    .finally(() => {
      setTimeout(() => {
        setIsClicked!(false);
        setIsSummary!(false); // Reset loader state
      }, 500);
    });
};
///--------------------------------------------------------
// Main Function to handle the cases of the Menu Buttons
///--------------------------------------------------------

export const buttonMenuLogic = ({
  fileInputRef,
  dialogRef,
  sectionsDialogRef,
  setIsClicked,
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
  setLanguage,
  openDialogNoSection,
  setOpenDialogNoSection,
  summaryDialogRef,
  setIsSummary,
  setSummaryContent,
}: Partial<ButtonProps>) => {
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
    case "summary":
      console.log("calling summary");
      getSummary({
        setIsClicked,
        summaryDialogRef,
        setIsSummary,
        setSummaryContent,
        setLanguage,
      });
      break;
    default:
      openStylesDialog({ stylesDialogRef, setIsFontStyleOpen });
      break;
  }
};
