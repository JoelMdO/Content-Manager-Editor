export const handleClear = (
  editorRefs: React.RefObject<(HTMLDivElement | null)[]>
) => {
  ///======================================================
  // Clear content from dashboard
  ///======================================================

  // Remove session storage items
  const dbName = sessionStorage.getItem("db");
  sessionStorage.removeItem(`tempTitle-${dbName}`);
  sessionStorage.removeItem(`tempBody-${dbName}`);
  sessionStorage.removeItem(`articleContent-${dbName}`);

  // Clear contentEditable divs
  editorRefs.current![0]!.innerText = "";
  editorRefs.current![1]!.innerText = "";
};
