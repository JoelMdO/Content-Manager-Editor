<<<<<<< HEAD
import emailMe from "../../../buttons/utils/email_me";
=======
// import errorAlert from "@/components/alerts/error";
// import postButtonClicked from "../../../Menu/Menu Button/utils/save_button_clicked";
// import successAlert from "@/components/alerts/sucess";
// import handleNoteClick from "../playbook/handle_note_click";
import emailMe from "../../../buttons/utils/email_me";
// import { useCallback } from "react";
// import { customDashLogicProps } from "@/types/customDash_type";
// import { debouncedUpdateStore } from "../../utils/dashboard/debounceUpdateStore";
// import { ButtonProps } from "@/components/Menu/Menu Button/type/type_menu_button";
>>>>>>> 1295580d32457ddac461590b78b05994a943dd08
import { CustomDashButtonProps } from "../type/type_playbook_custombutton";
import handleNoteClick from "../../utils/handle_note_click";

///--------------------------------------------------------
// Function to handle the view note button click
///--------------------------------------------------------
<<<<<<< HEAD
export function viewNote({
  noteViewMode,
  setNoteViewMode,
  setEntries,
  setViewDetails,
  setUpdateNote,
  id,
}: Partial<CustomDashButtonProps>) {
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
}
///--------------------------------------------------------
// Function to update the playbook
///--------------------------------------------------------
export function updatePlaybook(setUpdateNote?: any) {
  setUpdateNote?.({ isUpdateNote: false, noteId: "" });
}

///--------------------------------------------------------
// Function to create a new playbook
///--------------------------------------------------------
export function newPlaybook(resetForm?: any, router?: any) {
  resetForm?.();
  router?.push("/home");
}
///--------------------------------------------------------
//
///--------------------------------------------------------
export function new_playbook_at_readplaybook(setIsCreating?: any) {
  setIsCreating?.(false);
}
=======
export const viewNote =
  ({
    noteViewMode,
    setNoteViewMode,
    setEntries,
    setViewDetails,
    setUpdateNote,
    id,
  }: Partial<CustomDashButtonProps>) =>
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
>>>>>>> 1295580d32457ddac461590b78b05994a943dd08
///--------------------------------------------------------
// Main Function to handle the cases of the playbookCustomButton
///--------------------------------------------------------

<<<<<<< HEAD
export function playbookButtonLogic({
=======
export const playbookButtonLogic = ({
>>>>>>> 1295580d32457ddac461590b78b05994a943dd08
  type,
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
<<<<<<< HEAD
}: Partial<CustomDashButtonProps>) {
=======
}: Partial<CustomDashButtonProps>) => {
>>>>>>> 1295580d32457ddac461590b78b05994a943dd08
  onClick?.();
  switch (type) {
    case "logo":
      emailMe();
      break;
    case "new-playbook":
<<<<<<< HEAD
      newPlaybook(resetForm, router);
      break;
    case "new-playbook-at-readplaybook":
      new_playbook_at_readplaybook(setIsCreating);
      break;
    case "updatePlaybook":
      updatePlaybook(setUpdateNote);
=======
      newPlaybook(resetForm, router)();
      break;
    case "new-playbook-at-readplaybook":
      new_playbook_at_readplaybook(setIsCreating)();
      break;
    case "updatePlaybook":
      updatePlaybook(setUpdateNote)();
      // setUpdateNote?.({ isUpdateNote: false, noteId: "" });
>>>>>>> 1295580d32457ddac461590b78b05994a943dd08
      break;
    case "view-note":
      viewNote({
        noteViewMode,
        setNoteViewMode,
        setEntries,
        setViewDetails,
        setUpdateNote,
        id,
<<<<<<< HEAD
      });
      break;
  }
}
=======
      })();
      break;
  }
};
>>>>>>> 1295580d32457ddac461590b78b05994a943dd08
