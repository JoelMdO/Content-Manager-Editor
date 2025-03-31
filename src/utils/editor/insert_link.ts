import callHub from "../../services/api/call_hub";
import { AppDispatch } from "../../services/store";
import linkWrapperHtml from "@/utils/wrapper_html";


const insertLink = async (dispatch: AppDispatch, link_url: string, editorRef: HTMLDivElement | null): Promise<any> => {
    ///========================================================
    // Function to insert a link at the cursor position
    ///========================================================
    //
    try{
    // Store reference before API call
    if(link_url === undefined || !editorRef) return {status: 205, message: "Link not inserted"};;
    // Check if there's an active selection or range
    const selection = window.getSelection();
    let range = selection?.getRangeAt(0);
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
            return {status: 200, message: "Link inserted successfully"};
        }
        
        if (range) {
            range.deleteContents(); 
        // Ensure the range is expanded (if collapsed)
        if (range.collapsed) {
            const spaceNode = document.createTextNode(" ");
            editor?.appendChild(spaceNode);
                var sel = window.getSelection();
                var newRange = document.createRange();
                newRange.setStart(spaceNode, spaceNode!.nodeValue!.length);
                newRange.insertNode(link);
                //Move cursor afger the link
                // Insert a space node AFTER the link to move the cursor there
                newRange.setStartAfter(link);
                newRange.insertNode(spaceNode);
                // Move selection AFTER the spaceNode (which is after the link)
                newRange.setStartAfter(spaceNode);
                newRange.setEndAfter(spaceNode);
                newRange.collapse(false);
                //
                // Get the <p> (or closest block) where the <a> was inserted
                let parentBlock = link.closest("div") || link.parentElement;

                // Create a new <div> for a new paragraph
                const newDiv = document.createElement("div");
                newDiv.innerHTML = "<br>";

                // Insert the new <div> properly after the parent block
                if (parentBlock && parentBlock.parentNode) {
                    parentBlock.parentNode.insertBefore(newDiv, parentBlock.nextSibling);
                }

                // Move selection to the new div
                newRange.setStart(newDiv, 0);
                newRange.collapse(true);
                sel!.removeAllRanges();
                sel!.addRange(newRange);

                editor.focus();
            
            // editor.focus(); // Focus the editor
            return {status: 200, message: "Link inserted successfully"};
        }
        // Delete the current selection (if any) and insert the link
            range.insertNode(link);
            range.collapse(false);  // Move the cursor to the end of the inserted link
            return { status: 200, message: "Link inserted successfully" };
        } else {
            // If no selection, append at the end of the editor
            editor?.appendChild(link);
            return {status: 200, message: "Link inserted successfully"};
        }
    } else {
        return {status: 205, message: "Link not inserted"};
    }
    // Clear file input
    } catch (error) {
        return {status: 205, message: error};
}};

export default insertLink;