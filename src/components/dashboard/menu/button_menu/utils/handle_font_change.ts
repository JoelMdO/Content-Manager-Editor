//==========================================
// Original Code (Preserved for Reference)
import { setMarkdownAttr } from "./set_markdown_attr";
import sectionQuoteListWrapperHtml from "./wrapper_sections";
//==========================================

export const handleFontChange = (
  value: SetMarkDownAttr,
  editorRefs: (HTMLDivElement | null)[]
) => {
  ///--------------------------------------------------------
  // Handle font changes for section, quote, and list elements.
  ///--------------------------------------------------------
  const selection = window.getSelection();
  if (selection && ["section", "quote", "list"].includes(value)) {
    sectionQuoteListWrapperHtml(value, selection, editorRefs);
    ///--------------------------------------------------------
    // Handle font changes for regular text.
    ///--------------------------------------------------------
  } else {
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const selectedText = range.toString().trim();

      if (selectedText.length === 0) return; // Exit if no text is selected

      const selectedNode = range.startContainer;
      let spanNode: HTMLElement | null = selectedNode.parentElement;

      // Traverse up to find the nearest <span> or <div>
      while (
        spanNode &&
        spanNode.tagName !== "SPAN" &&
        spanNode.tagName !== "DIV"
      ) {
        spanNode = spanNode.parentElement;
      }

      const fontStyle = value === "italic" ? "italic" : "normal";
      const fontWeight = value === "bold" ? "700" : "400"; // Using numeric values consistently
      const textDecoration = value === "underline" ? "underline" : "none";
      const fontSizeH2 = value === "font_h2" ? "1.5em" : "1em";
      const fontSizeH3 = value === "font_h3" ? "1.17em" : "1em";

      if (spanNode && spanNode.tagName === "SPAN") {
        // Update existing <span> stylesis

        if (value === "italic") {
          const isItalic = spanNode.style.fontStyle === "italic";
          spanNode.style.fontStyle = isItalic ? "normal" : "italic";
          setMarkdownAttr(spanNode, "italic", !isItalic);
        } else if (value === "bold") {
          const isBold = ["700", "bold"].includes(spanNode.style.fontWeight);
          spanNode.style.fontWeight = isBold ? "400" : "700"; // Use numeric values consistently
          setMarkdownAttr(spanNode, "bold", !isBold);
        } else if (value === "underline") {
          const isUnderlined = spanNode.style.textDecoration === "underline";
          spanNode.style.textDecoration = isUnderlined ? "none" : "underline";
          setMarkdownAttr(spanNode, "underline", !isUnderlined);
        } else if (value === "font_h2") {
          const isFontH2 = spanNode.style.fontSize === "1.5em";
          spanNode.style.fontSize = isFontH2 ? "1em" : "1.5em";
          setMarkdownAttr(spanNode, "font_h2", !isFontH2);
        } else if (value === "font_h3") {
          const isFontH3d = spanNode.style.fontSize === "1.17em";
          spanNode.style.fontSize = isFontH3d ? "1em" : "1.17em";
          setMarkdownAttr(spanNode, "font_h3", !isFontH3d);
        }
      } else {
        // Create a new <span> for the selected text
        const extractedContent = range.extractContents();
        const span = document.createElement("span");
        if (value === "italic") span.style.fontStyle = "italic";
        if (value === "bold") span.style.fontWeight = "700";
        if (value === "underline") span.style.textDecoration = "underline";
        if (value === "font_h2") span.style.fontSize = "1.5em";
        if (value === "font_h3") span.style.fontSize = "1.17em";
        setMarkdownAttr(
          span,
          value as "bold" | "italic" | "underline" | "font_h2" | "font_h3",
          true
        );
        span.appendChild(extractedContent);
        range.insertNode(span);
      }
    }
  }
};
