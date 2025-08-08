// import deleteImageFromIndexDB from "./images_edit/delete_img_from_indexdb";

import { removeStoredImage } from "./images_edit/delete_img_from_localstorage";

export const handleClear = (
  // setTheTitle: (value: string) => void,
  // setTheBody: (value: string) => void,
  editorRefs: React.RefObject<(HTMLDivElement | null)[]>
) => {
  ///======================================================
  // Clear content from dashboard
  ///======================================================

  // Clear title and body state
  // setTheTitle("");
  // setTheBody("");

  // Remove session storage items
  const dbName = sessionStorage.getItem("db");
  sessionStorage.removeItem(`tempTitle-${dbName}`);
  sessionStorage.removeItem(`tempBody-${dbName}`);
  sessionStorage.removeItem(`articleContent-${dbName}`);

  // Clear contentEditable divs
  editorRefs.current![0]!.innerText = "";
  editorRefs.current![1]!.innerText = "";
  // editorRefs.current.forEach((ref) => {
  //   if (ref) {
  //     ref.innerText = "";
  //   }
  // });

  // Delete images from IndexedDB
  // deleteImageFromIndexDB(undefined, "clear-all");
};
