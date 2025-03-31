import deleteImageFromIndexDB from "../images_edit/delete_img_from_indexdb";

export const handleClear = (
  setTheTitle: (value: string) => void,
  setTheBody: (value: string) => void,
  editorRefs: React.RefObject<(HTMLDivElement | null)[]>
) => {
  ///======================================================
  // Clear content from dashboard
  ///======================================================

  // Clear title and body state
  setTheTitle("");
  setTheBody("");
   
  // Remove session storage items
  sessionStorage.removeItem("tempTitle");
  sessionStorage.removeItem("tempBody");

  // Clear contentEditable divs
  editorRefs.current.forEach((ref) => {
    if (ref) {
      ref.innerText = "";
    }
  });

  // Delete images from IndexedDB
  deleteImageFromIndexDB(undefined, "clear-all").then((response: any) => {
  });
};