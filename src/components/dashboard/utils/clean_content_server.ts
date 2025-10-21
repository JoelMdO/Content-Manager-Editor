import { JSDOM } from "jsdom";
import createDOMPurify from "dompurify";

const window = new JSDOM("").window;
const DOMPurify = createDOMPurify(window);

export function cleanNestedDivsServer(content: string): string {
  //
  const dom = new JSDOM(content);
  const doc = dom.window.document;
  // Add classes we want to preserve
  const preserveClasses = ["font_h2", "bold", "italic", "underline"];
  // Function to process empty nodes
  function isNodeEmpty(node: HTMLElement): boolean {
    // Consider empty if it has no text OR only <br> and whitespace
    const clone = node.cloneNode(true) as HTMLElement;
    clone.querySelectorAll("br").forEach((br) => br.remove());
    return clone.textContent?.trim() === "";
  }
  //
  // Recursive function to process nodes
  function processNode(node: ChildNode): string {
    if (node.nodeType === dom.window.Node.TEXT_NODE) {
      // Preserve text content
      return node.textContent || "";
    }

    if (node.nodeType === dom.window.Node.ELEMENT_NODE) {
      const element = node as HTMLElement;
      const tagName = element.tagName.toLowerCase();

      // 🧹 Remove empty headings (like <h2><br><br></h2>)
      if (["h1", "h2", "h3"].includes(tagName) && isNodeEmpty(element)) {
        return "";
      }

      // Check for spans with specific classes and convert them
      if (tagName === "span") {
        const classList = element.className.split(" ");

        // Convert spans with specific classes to semantic elements
        if (classList.includes("bold")) {
          return `<strong>${Array.from(element.childNodes)
            .map((child) => processNode(child))
            .join("")}</strong>`;
        }
        if (classList.includes("italic")) {
          return `<em>${Array.from(element.childNodes)
            .map((child) => processNode(child))
            .join("")}</em>`;
        }
        if (classList.includes("underline")) {
          return `<u>${Array.from(element.childNodes)
            .map((child) => processNode(child))
            .join("")}</u>`;
        }
        if (classList.includes("font_h2")) {
          return `<h2>${Array.from(element.childNodes)
            .map((child) => processNode(child))
            .join("")}</h2>`;
        }
        if (classList.includes("font_h3")) {
          return `<h3>${Array.from(element.childNodes)
            .map((child) => processNode(child))
            .join("")}</h3>`;
        }
      }
      // Preserve specific formatting elements and their attributes
      if (
        [
          "strong",
          "b",
          "i",
          "em",
          "u",
          "a",
          "br",
          "img",
          "hr",
          "p",
          "h1",
          "h2",
          "h3",
        ].includes(tagName)
      ) {
        const attributes = Array.from(element.attributes)
          .filter((attr) => {
            // Keep specific classes
            if (attr.name === "class") {
              const classes = attr.value.split(" ");
              return classes.some((cls) => preserveClasses.includes(cls));
            }
            // Only keep style on allowed tags (e.g. img or a)
            if (attr.name === "style") {
              // ❗ Remove style from h1/h2/h3/hr
              if (["h1", "h2", "h3"].includes(tagName)) return false;
            }
            return ["href", "src", "alt", "style"].includes(attr.name);
          })
          .map((attr) => `${attr.name}="${attr.value}"`)
          .join(" ");

        // Process inner content
        const innerContent = Array.from(element.childNodes)
          .map(processNode)
          .join("");

        // Remove empty <p> as well if needed
        if (tagName === "p" && innerContent.trim() === "") {
          return "";
        }
        //
        if (["br", "img", "hr"].includes(tagName)) {
          return attributes ? `<${tagName} ${attributes}>` : `<${tagName}>`;
        }

        // Return element with preserved formatting
        return attributes
          ? `<${tagName} ${attributes}>${innerContent}</${tagName}>`
          : `<${tagName}>${innerContent}</${tagName}>`;
      }

      // For divs and other elements, just process their children
      return Array.from(element.childNodes)
        .map((child) => processNode(child))
        .join("");
    }

    return "";
  }
  //
  //
  // Process the body content
  let cleanContent = processNode(doc.body);
  // Replace &nbsp; with regular spaces
  cleanContent = cleanContent.replace(/&nbsp;/gi, " ");

  // Final string-level cleanup
  cleanContent = cleanContent
    // Normalize all <br> variants first
    .replace(/<br\s*\/?>/gi, "<br>")
    // Collapse 3+ consecutive <br> to exactly 2 (do this BEFORE stripping whitespace)
    .replace(/(<br>){3,}/gi, "<br><br>")
    // Now strip excessive whitespace around BRs (but keep text readable)
    .replace(/\s*(<br>)\s*/gi, "$1")
    // Remove <br> from inside empty headings
    .replace(/<(h[1-3])>(<br>)+<\/\1>/gi, "")
    // Clean <br> around <hr>
    .replace(/(<br>)+(<hr\b[^>]*>)/gi, "$2")
    .replace(/(<hr\b[^>]*>)(<br>)+/gi, "$1");

  // Second pass to catch any new consecutive BRs created
  cleanContent = cleanContent.replace(/(<br>){3,}/gi, "<br><br>");
  // Remove nested identical block elements like <p><p>Text</p></p>
  cleanContent = cleanContent.replace(
    /<p>\s*(<p>[\s\S]*?<\/p>)\s*<\/p>/gi,
    "$1"
  );

  // Flatten <div><p>Text</p></div> to just <p>Text</p>
  cleanContent = cleanContent.replace(/<div>\s*([\s\S]*?)\s*<\/div>/gi, "$1");

  // Collapse <p><br></p> repeated blocks
  cleanContent = cleanContent.replace(/(<p><br><\/p>){2,}/gi, "<p><br></p>");

  // Remove empty spans left over
  cleanContent = cleanContent.replace(/<span[^>]*>\s*<\/span>/gi, "");

  // Remove wrapping <p> around <img> if it’s the only child
  cleanContent = cleanContent.replace(/<p>\s*(<img[^>]+>)\s*<\/p>/gi, "$1");
  //Add DIV tag if needed
  if (!cleanContent.trim().startsWith("<div>")) {
    cleanContent = `<div>${cleanContent}</div>`;
  } else {
  }
  // Sanitize the final output
  return DOMPurify.sanitize(cleanContent, {
    ALLOWED_TAGS: [
      "strong",
      "b",
      "i",
      "em",
      "u",
      "a",
      "br",
      "img",
      "hr",
      "p",
      "h1",
      "h2",
      "h3",
      "div",
    ],
    ALLOWED_ATTR: ["href", "src", "alt", "class", "style"],
    // ADD_ATTR: ["style"],
  });
}
