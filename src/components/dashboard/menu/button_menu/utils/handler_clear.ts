import { useEditorStore } from "@/store/useEditorStore";

export const handleClear = () => {
  ///======================================================
  // Clear content from dashboard (TipTap-based)
  ///======================================================

  // Clear TipTap editor instances
  const { titleEditorRef, bodyEditorRef, savedTitleRef, savedBodyRef } =
    useEditorStore.getState();

  titleEditorRef.current?.commands.clearContent(true);
  bodyEditorRef.current?.commands.clearContent(true);

  // Reset string caches
  savedTitleRef.current = "";
  savedBodyRef.current = null;

  // Reset placeholder state
  useEditorStore.getState().setPlaceHolderTitle(true);
  useEditorStore.getState().setPlaceHolderArticle(true);

  // Remove session and local storage items
  const dbName = sessionStorage.getItem("db");
  sessionStorage.removeItem(`tempTitle-${dbName}`);
  sessionStorage.removeItem(`tempBody-${dbName}`);
  sessionStorage.removeItem(`articleContent-${dbName}`);
  localStorage.removeItem(`draft-articleContent-${dbName}`);
};
