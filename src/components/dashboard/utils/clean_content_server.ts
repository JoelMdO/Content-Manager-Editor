import { JSDOM } from "jsdom";
import createDOMPurify from "dompurify";

const window = new JSDOM("").window;
const DOMPurify = createDOMPurify(window);

export function cleanNestedDivsServer(content: string): string {
  // Create a new DOMParser instance
  // const parser = new DOMParser();

  // // Parse the HTML string into a document
  // const doc = parser.parseFromString(content, "text/html");
  // Use JSDOM to parse HTML instead of DOMParser
  const dom = new JSDOM(content);
  const doc = dom.window.document;
  // Add classes we want to preserve
  const preserveClasses = ["font_h2", "bold", "italic", "underline"];

  function processNode(node: ChildNode): string {
    if (node.nodeType === dom.window.Node.TEXT_NODE) {
      // Preserve text content
      return node.textContent || "";
    }

    if (node.nodeType === dom.window.Node.ELEMENT_NODE) {
      const element = node as HTMLElement;
      const tagName = element.tagName.toLowerCase();

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
          return `<h2 style="font-size: 1.5em; font-weight: bold;">${Array.from(
            element.childNodes
          )
            .map((child) => processNode(child))
            .join("")}</h2>`;
        }
        if (classList.includes("font_h3")) {
          return `<h3 style="font-size: 1.17em; font-weight: bold;">${Array.from(
            element.childNodes
          )
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
        let attributes = Array.from(element.attributes)
          .filter((attr) => {
            // Keep specific classes
            if (attr.name === "class") {
              const classes = attr.value.split(" ");
              return classes.some((cls) => preserveClasses.includes(cls));
            }
            return ["href", "src", "alt", "style"].includes(attr.name);
          })
          .map((attr) => `${attr.name}="${attr.value}"`)
          .join(" ");

        // Process children recursively
        const innerContent = Array.from(element.childNodes)
          .map((child) => processNode(child))
          .join("");

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

  // Process the body content
  const cleanedContent = processNode(doc.body);

  // Sanitize the final output
  return DOMPurify.sanitize(cleanedContent, {
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
    ],
    ALLOWED_ATTR: ["href", "src", "alt", "class", "style"],
    ADD_ATTR: ["style"],
  });
}
