<<<<<<< HEAD
export const handleClear = (
=======
// import deleteImageFromIndexDB from "./images_edit/delete_img_from_indexdb";

import { removeStoredImage } from "./images_edit/delete_img_from_localstorage";

export const handleClear = (
  // setTheTitle: (value: string) => void,
  // setTheBody: (value: string) => void,
>>>>>>> 1295580d32457ddac461590b78b05994a943dd08
  editorRefs: React.RefObject<(HTMLDivElement | null)[]>
) => {
  ///======================================================
  // Clear content from dashboard
  ///======================================================

<<<<<<< HEAD
=======
  // Clear title and body state
  // setTheTitle("");
  // setTheBody("");

>>>>>>> 1295580d32457ddac461590b78b05994a943dd08
  // Remove session storage items
  const dbName = sessionStorage.getItem("db");
  sessionStorage.removeItem(`tempTitle-${dbName}`);
  sessionStorage.removeItem(`tempBody-${dbName}`);
  sessionStorage.removeItem(`articleContent-${dbName}`);

  // Clear contentEditable divs
  editorRefs.current![0]!.innerText = "";
  editorRefs.current![1]!.innerText = "";
<<<<<<< HEAD
=======
  // editorRefs.current.forEach((ref) => {
  //   if (ref) {
  //     ref.innerText = "";
  //   }
  // });

  // Delete images from IndexedDB
  // deleteImageFromIndexDB(undefined, "clear-all");
>>>>>>> 1295580d32457ddac461590b78b05994a943dd08
};
