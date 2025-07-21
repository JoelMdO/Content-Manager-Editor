import errorAlert from "@/components/alerts/error";
import saveButtonClicked from "./save_button_clicked";
import successAlert from "@/components/alerts/sucess";
import handleNoteClick from "../playbook/handle_note_click";
import emailMe from "./email_me";
import { useCallback } from "react";
import { customDashLogicProps } from "@/types/customDash_type";
import { debouncedUpdateStore } from "../../utils/dashboard/debounceUpdateStore";

///--------------------------------------------------------
// Post function to handle the save button click
///--------------------------------------------------------
export const post =
  ({ setIsClicked, italic, bold, router }: Partial<customDashLogicProps>) =>
  () => {
    setIsClicked!(true);
    saveButtonClicked(italic!, bold!)
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
///--------------------------------------------------------
// Function to handle the view note button click
///--------------------------------------------------------
export const viewNote =
  ({
    noteViewMode,
    setNoteViewMode,
    setEntries,
    setViewDetails,
    setUpdateNote,
    id,
  }: Partial<customDashLogicProps>) =>
  () => {
    const toggleMode = noteViewMode === "view" ? "edit" : "view";
    setNoteViewMode!(toggleMode);
    if (noteViewMode === "view") {
      setEntries?.((prev: any[] | undefined) =>
        prev
          ? prev.map((entry) =>
              entry.id === id ? { ...entry, loading: true } : entry
            )
          : []
      );
      handleNoteClick(id!).then((meta) => {
        setViewDetails?.(true);
        setEntries?.((prev: any[] | undefined) =>
          prev
            ? prev.map((entry) =>
                entry.id === id ? { ...entry, loading: false } : entry
              )
            : []
        );
        if (meta) {
          setEntries?.((prev: any[] | undefined) =>
            prev ? prev.map((entry) => (entry.id === id ? meta : entry)) : []
          );
        }
      });
    } else {
      setUpdateNote?.({ isUpdateNote: true, noteId: id! });
    }
  };
///--------------------------------------------------------
// Function to update the playbook
///--------------------------------------------------------
export const updatePlaybook = (setUpdateNote?: any) => () =>
  setUpdateNote?.({ isUpdateNote: false, noteId: "" });
///--------------------------------------------------------
// Function to create a new playbook
///--------------------------------------------------------
export const newPlaybook = (resetForm?: any, router?: any) => () => {
  resetForm?.();
  router?.push("/home");
};
///--------------------------------------------------------
//
///--------------------------------------------------------
export const new_playbook_at_readplaybook = (setIsCreating?: any) => () =>
  setIsCreating?.(false);
///--------------------------------------------------------

// Save to sessionStorage on every change
///--------------------------------------------------------
export const saveDraft = (
  dbNameToSearch: string,
  DRAFT_KEY: (db: string) => string
) => {
  const draft = sessionStorage.getItem(`articleContent-${dbNameToSearch}`);
  if (draft) {
    localStorage.setItem(DRAFT_KEY(dbNameToSearch), draft);
  }
};
///--------------------------------------------------------
// Main Function to handle the cases of the CustomDashBoardButton
///--------------------------------------------------------

export const buttonLogic = ({
  type,
  setIsClicked,
  italic,
  bold,
  router,
  noteViewMode,
  setNoteViewMode,
  setEntries,
  setViewDetails,
  setUpdateNote,
  id,
  resetForm,
  setIsCreating,
  onClick,
  DRAFT_KEY,
  dbNameToSearch,
}: Partial<customDashLogicProps>) => {
  onClick?.();
  switch (type) {
    case "logo":
      emailMe();
      break;
    case "post":
      post({ setIsClicked, italic, bold, router })();
      break;
    case "save":
      saveDraft(dbNameToSearch!, DRAFT_KEY!);
      break;
    case "new-playbook":
      newPlaybook(resetForm, router)();
      break;
    case "new-playbook-at-readplaybook":
      new_playbook_at_readplaybook(setIsCreating)();
      break;
    case "updatePlaybook":
      updatePlaybook(setUpdateNote)();
      // setUpdateNote?.({ isUpdateNote: false, noteId: "" });
      break;
    case "view-note":
      viewNote({
        noteViewMode,
        setNoteViewMode,
        setEntries,
        setViewDetails,
        setUpdateNote,
        id,
      })();
      break;
  }
};
