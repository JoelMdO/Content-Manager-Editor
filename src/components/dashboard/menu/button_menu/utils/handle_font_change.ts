//==========================================
// Original Code (Preserved for Reference)
//==========================================
const setMarkdownAttr = (
  span: HTMLElement,
  type:
    | "bold"
    | "italic"
    | "underline"
    | "font_h2"
    | "font_h3"
    | "font_decrease",
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
  } else if (type === "font_h2") {
    span.style.fontSize = enabled ? "1.5em" : "1em";
    if (enabled) {
      span.classList.add("font_h2");
    } else {
      span.classList.remove("font_h2");
    }
  } else if (type === "font_h3") {
    span.style.fontSize = enabled ? "1.17em" : "1em";
    if (enabled) {
      span.classList.add("font_h3");
    } else {
      span.classList.remove("font_h3");
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
    const fontSizeH2 = value === "font_h2" ? "1.5em" : "1em";
    const fontSizeH3 = value === "font_h3" ? "1.17em" : "1em";

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
      span.style.fontStyle = fontStyle;
      span.style.fontWeight = fontWeight;
      span.style.textDecoration = textDecoration;
      span.style.fontSize = fontSizeH2 !== "1em" ? fontSizeH2 : fontSizeH3;
      setMarkdownAttr(
        span,
        value as "bold" | "italic" | "underline" | "font_h2" | "font_h3",
        true
      );
      span.appendChild(extractedContent);
      range.insertNode(span);
    }
  }
};
