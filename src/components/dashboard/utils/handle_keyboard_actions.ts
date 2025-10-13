import { removeStoredImage } from "../menu/button_menu/utils/images_edit/delete_img_from_localstorage";

export const handleKeyBoardActions = (
  e: React.KeyboardEvent<HTMLDivElement>,
  index: number,
  editorRefs: React.RefObject<(HTMLDivElement | null)[]>
) => {
  ///========================================================
  // To handle key board actions
  // 3 types of actions Enter on title, Enter on body and Delete
  ///========================================================
  //
  if (e.key === "Enter" && index === 1) {
    ///--------------------------------------------------------
    // Enter action where the user is on the Title div editor.
    ///--------------------------------------------------------
    //Allows to keep next line.
    if (editorRefs?.current && editorRefs.current[1]) {
      editorRefs.current[1].focus();
    }
  } else if (
    (e.key === "Backspace" || e.key === "Delete") &&
    window.getSelection
  ) {
    ///--------------------------------------------------------
    // Delete action
    ///--------------------------------------------------------
    const selection = window.getSelection();
    if (selection && selection!.rangeCount > 0) {
      if (selection?.rangeCount) {
        const range = selection.getRangeAt(0);
        let selectedNode = range.startContainer as HTMLElement;
        // Check if selection is inside an <img> tag
        if (selectedNode.nodeName !== "IMG") {
          selectedNode = selectedNode.parentElement as HTMLElement;
        }

        if (selectedNode && selectedNode.tagName === "IMG") {
          e.preventDefault();

          // Remove from IndexedDB if it has a reference ID
          const selectedText = selection?.toString().trim();
          //Remove the image from IndexDB
          const refId = selectedNode.dataset.refId;
          if (refId) {
            // 1️ Remove from localStorage object
            let stored = JSON.parse(localStorage.startWith("images") || "{}");
            for (const key in stored) {
              if (stored[key].imageId === refId || stored[key].type === refId) {
                delete stored[key];
              }
            }
            localStorage.setItem("images", JSON.stringify(stored));

            // 2️ Remove from sessionStorage object
            let sessionStored = JSON.parse(
              sessionStorage.startWith("images") || "{}"
            );
            for (const key in sessionStored) {
              if (
                sessionStored[key].imageId === refId ||
                sessionStored[key].type === refId
              ) {
                delete sessionStored[key];
              }
            }
            sessionStorage.setItem("images", JSON.stringify(sessionStored));
            // Remove from DOM
            selectedNode.remove();
          }
        }
        // selectedNode.remove();
      }
    }
  } else if (e.key === "ArrowDown") {
    ///--------------------------------------------------------
    // Arrow down when the user is on the body
    ///--------------------------------------------------------
    e.preventDefault(); // Prevent new lines
    const nextIndex = index + 1;
    if (editorRefs.current[nextIndex]) {
      editorRefs.current[nextIndex].focus();
    }
  } else if (e.key === "Enter") {
    ///--------------------------------------------------------
    // Enter action, Arrow down and Arrow up when the user is on the body
    ///--------------------------------------------------------
    e.preventDefault(); // Prevent new lines
    const nextIndex = index + 1;
    if (editorRefs.current[nextIndex]) {
      editorRefs.current[nextIndex].focus();
    }
    ///--------------------------------------------------------
    // Add a new line
    ///--------------------------------------------------------
    const selection = window.getSelection();
    if (!selection!.rangeCount) return;

    const range = selection!.getRangeAt(0);
    const p = document.createElement("p");
    p.innerHTML = "<br>"; // Ensures the new <p> is visible and editable
    range.collapse(false);
    range.insertNode(p);
    ///--------------------------------------------------------
    // Move the cursor inside the <p> ready for typing example:
    // <p>First paragraph</p>
    // <p>|<br></p>  ← cursor is inside here, ready to type
    ///--------------------------------------------------------
    range.setStart(p, 0);
    range.setEnd(p, 0);
    selection!.removeAllRanges();
    selection!.addRange(range);
    //
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    const prevIndex = index - 1;
    if (editorRefs.current[prevIndex]) {
      editorRefs.current[prevIndex].focus();
    }
  } else if (e.key === "Enter" && e.shiftKey) {
    e.preventDefault();
    const selection = window.getSelection();
    if (!selection!.rangeCount) return;

    const range = selection!.getRangeAt(0);
    const br = document.createElement("br");
    range.insertNode(br);
    range.setStartAfter(br);
    range.setEndAfter(br);
    selection!.removeAllRanges();
    selection!.addRange(range);
  }
};
