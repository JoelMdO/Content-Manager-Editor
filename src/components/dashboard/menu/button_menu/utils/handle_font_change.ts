//==========================================
// Original Code (Preserved for Reference)
//==========================================
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
    span.style.textDecoration = enabled ? "underline" : "none";
    if (enabled) {
      span.classList.add("underline");
    } else {
      span.classList.remove("underline");
    }
  }
};

export const handleFontChange = (value: string) => {
  const selection = window.getSelection();
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
    const fontWeight = value === "bold" ? "bold" : "normal";
    const textDecoration = value === "underline" ? "underline" : "none";

    if (spanNode && spanNode.tagName === "SPAN") {
      // Update existing <span> styles
      if (value === "italic") {
        const isItalic = spanNode.style.fontStyle === "italic";
        spanNode.style.fontStyle = isItalic ? "normal" : "italic";
        setMarkdownAttr(spanNode, "italic", !isItalic);
      } else if (value === "bold") {
        const isBold = spanNode.style.fontWeight === "bold";
        spanNode.style.fontWeight = isBold ? "normal" : "bold";
        setMarkdownAttr(spanNode, "bold", !isBold);
      } else if (value === "underline") {
        const isUnderlined = spanNode.style.textDecoration === "underline";
        spanNode.style.textDecoration = isUnderlined ? "none" : "underline";
        setMarkdownAttr(spanNode, "underline", !isUnderlined);
      }
    } else {
      // Create a new <span> for the selected text
      const extractedContent = range.extractContents();
      const span = document.createElement("span");
      span.style.fontStyle = fontStyle;
      span.style.fontWeight = fontWeight;
      span.style.textDecoration = textDecoration;
      setMarkdownAttr(span, value as "bold" | "italic" | "underline", true);
      span.appendChild(extractedContent);
      range.insertNode(span);
    }
  }
};
