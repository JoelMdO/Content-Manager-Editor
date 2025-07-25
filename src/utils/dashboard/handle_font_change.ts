// import {
//   addFontStyle,
//   addFontWeight,
//   deleteFontStyle,
//   deleteFontWeight,
// } from "../../store/slices/data_slice";
// import { AppDispatch } from "../../store/store";

import { ButtonProps } from "@/components/Menu/Menu Button/type/type_menu_button";
import { set } from "cypress/types/lodash";

// export const handleFontChange = (value: string, dispatch: AppDispatch) => {
export const handleFontChange = (
  value: string
  // setIsFontStylePressed: React.Dispatch<React.SetStateAction<boolean>>
) => {
  ///========================================================
  // Function to handle when the user select text and wants to
  // change the font style to Bold or Italic.
  ///========================================================
  //
  // setIsFontStyleOpen(false);
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
    ///--------------------------------------------------------
    // Helper for font style to facilitate parsing to markdown
    ///--------------------------------------------------------
    // Helper: set data attribute for markdown parsing
    const setMarkdownAttr = (
      span: HTMLElement,
      type: "bold" | "italic" | "underline",
      enabled: boolean
    ) => {
      if (type === "bold") {
        span.style.fontWeight = enabled ? "bold" : "normal";
        if (enabled) {
          span.classList.add("bold");
        } else {
          span.classList.remove("bold");
        }
      } else if (type === "italic") {
        span.style.fontStyle = enabled ? "italic" : "normal";
        if (enabled) {
          span.classList.add("italic");
        } else {
          span.classList.remove("italic");
        }
      } else {
        span.style.textDecoration = enabled ? "underline" : "normal";
        if (enabled) {
          span.classList.add("underline");
        } else {
          span.classList.remove("underline");
        }
      }
    };
    //First to check if the text has already and style
    //and if text inside a <span> element with the type of font weight.
    if (spanNode && spanNode.tagName === "SPAN") {
      const text = spanNode.textContent ?? "";
      switch (value) {
        case "italic":
          if (spanNode.style.fontStyle === "normal") {
            spanNode.style.fontStyle = "italic";
            setMarkdownAttr(spanNode, "italic", true);
            // dispatch(addFontStyle({ text }));
          } else {
            spanNode.style.fontStyle = "normal";
            setMarkdownAttr(spanNode, "italic", false);
            // dispatch(deleteFontStyle({ text }));
          }
          break;
        case "bold":
          if (spanNode.style.fontWeight === "normal") {
            spanNode.style.fontWeight = "bold";
            setMarkdownAttr(spanNode, "bold", true);
            // dispatch(addFontWeight({ text }));
          } else {
            spanNode.style.fontWeight = "normal";
            setMarkdownAttr(spanNode, "bold", false);
            // dispatch(deleteFontWeight({ text }));
          }
          break;
        case "underline":
          if (spanNode.style.fontWeight === "normal") {
            spanNode.style.fontWeight = "underline";
            setMarkdownAttr(spanNode, "underline", true);
            // dispatch(addFontWeight({ text }));
          } else {
            spanNode.style.fontWeight = "normal";
            setMarkdownAttr(spanNode, "underline", false);
            // dispatch(deleteFontWeight({ text }));
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
        default:
          fontStyle = "normal";
          fontWeight = "normal";
          break;
      }
      const extractedContent = range.extractContents();
      const span = document.createElement("span");
      span.style.fontWeight = fontWeight;
      span.style.fontStyle = fontStyle;
      range.insertNode(span);
      span.appendChild(extractedContent);
      //Update redux with text and style
      // const newText = selectedText ?? "";
      // if (fontStyle === "italic") {
      //   dispatch(addFontStyle({ text: newText }));
      // }
      // if (fontWeight === "bold") {
      //   dispatch(addFontWeight({ text: newText }));
      // }
    }
  }
};
