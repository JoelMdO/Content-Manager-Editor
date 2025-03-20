import { addFontStyle, addFontWeight, deleteFontStyle, deleteFontWeight } from "@/slices/data_slice";
import { AppDispatch } from "./store";

  export const handleFontChange = (value: string, dispatch: AppDispatch) => {
    const selection = window.getSelection();
    if (selection!.rangeCount! > 0) {
    //get range of text selected
    const range = selection!.getRangeAt(0);
    console.log("range", range);
    const selectedText = range.toString().trim();
    console.log("selectedText", selectedText);
    //check if the selected text is inside a <span> element
    let selectedNode = range.startContainer.nextSibling;
    console.log("selectedNode", selectedNode);
      // Traverse up to find the nearest <span>
      let spanNode: HTMLElement | null = selectedNode as HTMLElement;
      while (spanNode && spanNode.tagName !== "SPAN") {
      spanNode = spanNode.parentElement;
      }
    console.log("spanNode", spanNode);
    //
    let fontWeight: string = "normal";
    let fontStyle: string = "normal";
    //First to check if the text has already and style
    //and if text inside a <span> element with the type of font weight.
    if (spanNode && spanNode.tagName === "SPAN") {
        console.log("at if");
        const text = spanNode.textContent ?? "";
        switch (value){
        case "italic":
        if (spanNode.style.fontStyle === "normal") {
          spanNode.style.fontStyle = "italic";
          console.log('Dispatching addFontStyle with text:', text);
          dispatch(addFontStyle({ text }));
        } else {
          spanNode.style.fontStyle = "normal";
          console.log('Dispatching deleteFontStyle with text:', text);
          dispatch(deleteFontStyle({ text }));
        }
        break;
        case "bold":
          if (spanNode.style.fontWeight === "normal") {
            spanNode.style.fontWeight = "bold";
            console.log('Dispatching addFontWeight with text:', text);
            dispatch(addFontWeight({ text }));
          } else {
            spanNode.style.fontWeight = "normal";
            console.log('Dispatching deleteFontWeight with text:', text);
            dispatch(deleteFontWeight({ text }));
          }
        break;
        default:
          spanNode.style.fontWeight = "normal";
          spanNode.style.fontStyle = "normal";
        break;
        }
    } else {
    console.log("at else text is not inside a span");
    switch (value){
      case "italic":
      fontStyle = "italic";
      break;
      case "bold":
      fontWeight = "bold";
      break;
      default:
      fontStyle = "normal";
      fontWeight = "normal";
      break;
    }
    console.log("font weight", fontWeight, "font style", fontStyle);
    const extractedContent = range.extractContents();
    console.log("extractedContent", extractedContent);
    const span = document.createElement("span");
    span.style.fontWeight = fontWeight;
    span.style.fontStyle = fontStyle;
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
  }}
};