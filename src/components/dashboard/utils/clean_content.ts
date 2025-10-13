import DOMPurify from "dompurify";

export function cleanNestedDivs(content: string): string {
  // Create a new DOMParser instance
  const parser = new DOMParser();

  // Parse the HTML string into a document
  const doc = parser.parseFromString(content, "text/html");
  // Add classes we want to preserve
  const preserveClasses = ["font_h2", "bold", "italic", "underline"];

  function processNode(node: Node): string {
    if (node.nodeType === Node.TEXT_NODE) {
      // Preserve text content
      return node.textContent || "";
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
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

        // Process inner content
        let innerContent = Array.from(element.childNodes)
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
    .replace(/(<br>)+(<hr\s*\/?>)/gi, "$2")
    .replace(/(<hr\s*\/?>)(<br>)+/gi, "$1");

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
  //
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
    ],
    ALLOWED_ATTR: ["href", "src", "alt", "class", "style"],
    ADD_ATTR: ["style"],
  });
}
