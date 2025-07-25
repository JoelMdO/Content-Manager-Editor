// import errorAlert from "@/components/alerts/error";
// import saveButtonClicked from "../../../Menu/Menu Button/utils/save_button_clicked";
// import successAlert from "@/components/alerts/sucess";
// import handleNoteClick from "../playbook/handle_note_click";
import emailMe from "../../utils/email_me";
// import { useCallback } from "react";
import { customDashLogicProps } from "@/types/customDash_type";
// import { debouncedUpdateStore } from "../../utils/dashboard/debounceUpdateStore";
import { ButtonProps } from "@/components/Menu/Menu Button/type/type_menu_button";

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
// Main Function to handle the cases of the CustomDashBoardButton
///--------------------------------------------------------

export const buttonLogic = ({
  type,
  setIsClicked,
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
}: // DRAFT_KEY,
// dbNameToSearch,
ButtonProps) => {
  onClick?.();
  switch (type) {
    case "logo":
      emailMe();
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
