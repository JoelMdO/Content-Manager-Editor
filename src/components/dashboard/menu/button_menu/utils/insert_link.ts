import callHub from "../../../../../services/api/call_hub";
import linkWrapperHtml from "./wrapper_html";

type insertLinkPResult = { status: number; message: string };

const insertLink = async (
  type: string,
  link_url: string,
  editorRef?: HTMLDivElement | null
): Promise<insertLinkPResult> => {
  ///========================================================
  // Function to insert a link at the cursor position
  ///========================================================
  if (type == "playbook") {
    const response = await callHub("clean-link", link_url);
    //
    if (response.status === 200) {
      return { status: 200, message: link_url };
    } else {
      return { status: 205, message: "Link not valid" };
    }
  } else {
    ///========================================================
    // Function to insert a link at the cursor position
    ///========================================================
    //
    try {
      // Store reference before API call
      if (link_url === undefined || !editorRef)
        return { status: 205, message: "Link not inserted" };
      // Check if there's an active selection or range
      const selection = window.getSelection();
      const range = selection?.getRangeAt(0);
      const editorRefBefore = editorRef;
      const response = await callHub("clean-link", link_url);
      //
      if (response.status === 200) {
        //Create a component for the link
        const link = linkWrapperHtml("link", link_url);
        // Click to open link
        link.onclick = (e) => {
          e.preventDefault();
          window.open(link_url, "_blank");
        };
        //
        // Insert the link at cursor position
        const editor = editorRefBefore;
        if (!selection || selection.rangeCount === 0) {
          editor?.appendChild(link);
          return { status: 200, message: "Link inserted successfully" };
        }

        if (range) {
          range.deleteContents();
          // Ensure the range is expanded (if collapsed)
          if (range.collapsed) {
            const spaceNode = document.createTextNode("\u00A0");
            editor?.appendChild(spaceNode);
            const sel = window.getSelection();
            const newRange = document.createRange();
            newRange.setStart(spaceNode, spaceNode!.nodeValue!.length);
            newRange.insertNode(link);
            //Move cursor after the link
            // Insert a space node AFTER the link to move the cursor there
            newRange.setStartAfter(link);
            newRange.insertNode(spaceNode);
            // Move selection AFTER the spaceNode (which is after the link)
            newRange.setStartAfter(spaceNode);
            newRange.setEndAfter(spaceNode);
            newRange.collapse(false);
            //
            // Get the <p> (or closest block) where the <a> was inserted
            const parentBlock = link.closest("div") || link.parentElement;

            // Create a new <div> for a new paragraph
            const newDiv = document.createElement("div");
            newDiv.innerHTML = "<br>";

            // Insert the new <div> properly after the parent block
            if (parentBlock && parentBlock.parentNode) {
              parentBlock.parentNode.insertBefore(
                newDiv,
                parentBlock.nextSibling
              );
            }

            // Move selection to the new div
            newRange.setStart(newDiv, 0);
            newRange.collapse(true);
            sel!.removeAllRanges();
            sel!.addRange(newRange);

            editor.focus();

            // editor.focus(); // Focus the editor
            return { status: 200, message: "Link inserted successfully" };
          }
          // Delete the current selection (if any) and insert the link
          range.insertNode(link);
          range.collapse(false); // Move the cursor to the end of the inserted link
          return { status: 200, message: "Link inserted successfully" };
        } else {
          // If no selection, append at the end of the editor
          editor?.appendChild(link);
          return { status: 200, message: "Link inserted successfully" };
        }
      } else {
        return { status: 205, message: "Link not inserted" };
      }
      // Clear file input
    } catch (error) {
      return { status: 205, message: error as string };
    }
  }
};

export default insertLink;
