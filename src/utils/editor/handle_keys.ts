import deleteImageFromIndexDB from "../images_edit/delete_img_from_indexdb";


export const handleKeyBoardActions = (
    e: React.KeyboardEvent<HTMLDivElement>,
    index: number,
    editorRefs: React.RefObject<(HTMLDivElement|null)[]>
) => {
    if (e.key === "Enter" && index === 1) {
      //Allows to keep next line.
        if (editorRefs?.current && editorRefs.current[1]) {
            editorRefs.current[1].focus();
        }
    } else if ((e.key === 'Backspace' || e.key === 'Delete')  && window.getSelection) {
            const selection = window.getSelection();
            if (selection &&  selection!.rangeCount > 0) {
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
                    console.log("Selected file name:", selectedText);
                    //Remove the image from IndexDB
                    const refId = selectedNode.dataset.refId;
                    if (refId) {
                        deleteImageFromIndexDB(selectedText);
                    }
                    // Remove the image reference text ImgRef
                    const imgRef = document.querySelector(`p[data-ref-id='${refId}']`);
                    if (imgRef) {
                        imgRef.remove();
                    }
                    // Remove from DOM
                    selectedNode.parentNode?.removeChild(selectedNode);
                }
            }
            }
            
    } else if (e.key === "Enter" || e.key === "ArrowDown") {
        e.preventDefault(); // Prevent new lines
        const nextIndex = index + 1;
        if (editorRefs.current[nextIndex]) {
            editorRefs.current[nextIndex].focus();
        }
    } else if (e.key === "ArrowUp") {
        e.preventDefault();
        const prevIndex = index - 1;
        if (editorRefs.current[prevIndex]) {
            editorRefs.current[prevIndex].focus();
        }
    }
};