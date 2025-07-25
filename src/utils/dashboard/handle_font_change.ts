import {
  addFontStyle,
  addFontWeight,
  deleteFontStyle,
  deleteFontWeight,
} from "../../store/slices/data_slice";
import { AppDispatch } from "../../store/store";

export const handleFontChange = (value: string, dispatch: AppDispatch) => {
  ///========================================================
  // Function to handle when the user select text and wants to
  // change the font style to Bold or Italic.
  ///========================================================
  //
  const selection = window.getSelection();
  if (selection!.rangeCount! > 0) {
    //get range of text selected
    const range = selection!.getRangeAt(0);
    const selectedText = range.toString().trim();
    //check if the selected text is inside a <span> element
    const selectedNode = range.startContainer.nextSibling;
    // Traverse up to find the nearest <span>
    let spanNode: HTMLElement | null = selectedNode as HTMLElement;
    while (spanNode && spanNode.tagName !== "SPAN") {
      spanNode = spanNode.parentElement;
    }
    //
    let fontWeight: string = "normal";
    let fontStyle: string = "normal";
    let textDecoration: string = "none";
    //First to check if the text has already and style
    //and if text inside a <span> element with the type of font weight.
    if (spanNode && spanNode.tagName === "SPAN") {
      const text = spanNode.textContent ?? "";
      switch (value) {
        case "italic":
          if (spanNode.style.fontStyle === "normal") {
            spanNode.style.fontStyle = "italic";
            dispatch(addFontStyle({ text }));
          } else {
            spanNode.style.fontStyle = "normal";
            dispatch(deleteFontStyle({ text }));
          }
          break;
        case "bold":
          if (spanNode.style.fontWeight === "normal") {
            spanNode.style.fontWeight = "bold";
            dispatch(addFontWeight({ text }));
          } else {
            spanNode.style.fontWeight = "normal";
            dispatch(deleteFontWeight({ text }));
          }
          break;
        case "underline":
          if (spanNode.style.textDecoration !== "underline") {
            spanNode.style.textDecoration = "underline";
            // Note: You may need to add underline actions to Redux if needed
          } else {
            spanNode.style.textDecoration = "none";
          }
          break;
        default:
          spanNode.style.fontWeight = "normal";
          spanNode.style.fontStyle = "normal";
          break;
      }
    } else {
      //If the text is not inside a <span> element or does not have
      //the type of font weight then create a new <span> element
      switch (value) {
        case "italic":
          fontStyle = "italic";
          break;
        case "bold":
          fontWeight = "bold";
          break;
        case "underline":
          textDecoration = "underline";
          break;
        default:
          fontStyle = "normal";
          fontWeight = "normal";
          break;
      }
      const extractedContent = range.extractContents();
      const span = document.createElement("span");
      span.style.fontWeight = fontWeight;
      span.style.fontStyle = fontStyle;
      span.style.textDecoration = textDecoration;
      range.insertNode(span);
      span.appendChild(extractedContent);
      //Update redux with text and style
      const newText = selectedText ?? "";
      if (fontStyle === "italic") {
        dispatch(addFontStyle({ text: newText }));
      }
      if (fontWeight === "bold") {
        dispatch(addFontWeight({ text: newText }));
      }
    }
  }
};
