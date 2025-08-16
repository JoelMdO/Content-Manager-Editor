import emailMe from "../../../buttons/utils/email_me";
import { CustomDashButtonProps } from "../type/type_playbook_custombutton";
import handleNoteClick from "../../utils/handle_note_click";

///--------------------------------------------------------
// Function to handle the view note button click
///--------------------------------------------------------
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
///--------------------------------------------------------
// Main Function to handle the cases of the playbookCustomButton
///--------------------------------------------------------

export function playbookButtonLogic({
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
}: Partial<CustomDashButtonProps>) {
  onClick?.();
  switch (type) {
    case "logo":
      emailMe();
      break;
    case "new-playbook":
      newPlaybook(resetForm, router);
      break;
    case "new-playbook-at-readplaybook":
      new_playbook_at_readplaybook(setIsCreating);
      break;
    case "updatePlaybook":
      updatePlaybook(setUpdateNote);
      break;
    case "view-note":
      viewNote({
        noteViewMode,
        setNoteViewMode,
        setEntries,
        setViewDetails,
        setUpdateNote,
        id,
      });
      break;
  }
}
