import { KeyboardEvent } from "react";
import { AppDispatch } from "./store";

const deleteImage = (e: KeyboardEvent<HTMLElement>, dispatch: AppDispatch) => {
    // Handle delete key for selected images
    if ((e.key === 'Backspace' || e.key === 'Delete') && window.getSelection) {
    const selection = window.getSelection();
    if (selection &&  selection!.rangeCount > 0) {
    const range = selection!.getRangeAt(0);
    const selectedNode = range.commonAncestorContainer;
    // Check if an image is selected (either directly or through parent)
    const imageToRemove = selectedNode.nodeName === 'IMG' 
    ? selectedNode 
    : selectedNode.parentNode?.nodeName === 'IMG' 
    ? selectedNode.parentNode 
    : null;

    if (imageToRemove && imageToRemove instanceof Element) {
    e.preventDefault();
      imageToRemove.parentNode?.removeChild(imageToRemove);  // Safely remove image from the DOM
    
      //TODO remove from SupaBase and IndexDB
    }
    }
    }
};

export default deleteImage;   