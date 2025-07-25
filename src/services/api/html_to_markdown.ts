import { JSDOM } from "jsdom";

export interface HtmlToMarkdownOptions {
  preserveWhitespace?: boolean;
  includeImageAlt?: boolean;
  preserveImageDimensions?: boolean;
  convertTables?: boolean;
  preserveLineBreaks?: boolean;
}

interface HTMLTypes {
  html: string;
  options?: HtmlToMarkdownOptions;
}

class HTMLToMarkdownConverter {
  imageCounter: number;
  linkCounter: number;

  constructor() {
    this.imageCounter = 0;
    this.linkCounter = 0;
  }

  convert({ html, options = {} }: HTMLTypes): string {
    const {
      preserveWhitespace = true,
      includeImageAlt = true,
      preserveImageDimensions = true,
      convertTables = true,
      preserveLineBreaks = true,
    } = options;

    const dom = new JSDOM(html);
    const document = dom.window.document;
    this.imageCounter = 0;
    this.linkCounter = 0;
    const body = document.body || document.documentElement;

    return this.processNode(body, "", 0, {
      preserveWhitespace,
      includeImageAlt,
      preserveImageDimensions,
      convertTables,
      preserveLineBreaks,
    }).trim();
  }

  processNode(
    node: Node,
    markdown = "",
    depth = 0,
    options: Required<HtmlToMarkdownOptions>
  ): string {
    if (!node) return markdown;

    if (node.nodeType === 3) {
      const text = node.textContent || "";
      return (
        markdown +
        (options.preserveWhitespace ? text : text.replace(/\s+/g, " "))
      );
    }

    if (node.nodeType === 1) {
      const tagName = (node as HTMLElement).tagName.toLowerCase();

      switch (tagName) {
        case "h1":
          return (
            markdown + this.processHeading(node as HTMLElement, 1, options)
          );
        case "h2":
          return (
            markdown + this.processHeading(node as HTMLElement, 2, options)
          );
        case "h3":
          return (
            markdown + this.processHeading(node as HTMLElement, 3, options)
          );
        case "h4":
          return (
            markdown + this.processHeading(node as HTMLElement, 4, options)
          );
        case "h5":
          return (
            markdown + this.processHeading(node as HTMLElement, 5, options)
          );
        case "h6":
          return (
            markdown + this.processHeading(node as HTMLElement, 6, options)
          );
        case "p":
          return markdown + this.processParagraph(node as HTMLElement, options);
        case "br":
          return markdown + (options.preserveLineBreaks ? "  \n" : "\n");
        case "hr":
          return markdown + "\n\n---\n\n";
        case "strong":
        case "b":
          return markdown + this.processStrong(node as HTMLElement, options);
        case "em":
        case "i":
          return markdown + this.processEmphasis(node as HTMLElement, options);
        case "code":
          return (
            markdown + this.processInlineCode(node as HTMLElement, options)
          );
        case "pre":
          return markdown + this.processCodeBlock(node as HTMLElement, options);
        case "a":
          return markdown + this.processLink(node as HTMLElement, options);
        case "img":
          return markdown + this.processImage(node as HTMLElement, options);
        case "ul":
          return (
            markdown +
            this.processUnorderedList(node as HTMLElement, depth, options)
          );
        case "ol":
          return (
            markdown +
            this.processOrderedList(node as HTMLElement, depth, options)
          );
        case "li":
          return (
            markdown + this.processListItem(node as HTMLElement, depth, options)
          );
        case "blockquote":
          return (
            markdown + this.processBlockquote(node as HTMLElement, options)
          );
        case "table":
          if (options.convertTables) {
            return markdown + this.processTable(node as HTMLElement, options);
          }
          return markdown + this.processChildren(node as HTMLElement, options);
        case "div":
          return markdown + this.processDiv(node as HTMLElement, options);
        case "span":
          return markdown + this.processSpan(node as HTMLElement, options);
        case "del":
        case "s":
        case "strike":
          return (
            markdown + this.processStrikethrough(node as HTMLElement, options)
          );
        case "sup":
          return (
            markdown + this.processSuperscript(node as HTMLElement, options)
          );
        case "sub":
          return markdown + this.processSubscript(node as HTMLElement, options);
        case "kbd":
          return markdown + this.processKeyboard(node as HTMLElement, options);
        case "mark":
          return markdown + this.processHighlight(node as HTMLElement, options);
        case "section":
        case "article":
        case "header":
        case "footer":
        case "main":
        case "aside":
        case "nav":
          return (
            markdown +
            "\n\n" +
            this.processChildren(node as HTMLElement, options) +
            "\n\n"
          );
        case "time":
        case "abbr":
        case "acronym":
        case "address":
        case "cite":
        case "dfn":
        case "var":
        case "samp":
          return markdown + this.processChildren(node as HTMLElement, options);
        case "script":
        case "style":
        case "noscript":
          return markdown;
        default:
          return markdown + this.processChildren(node as HTMLElement, options);
      }
    }
    return markdown;
  }

  processChildren(
    node: HTMLElement,
    options: Required<HtmlToMarkdownOptions>
  ): string {
    let result = "";
    for (let child of Array.from(node.childNodes)) {
      result = this.processNode(child, result, 0, options);
    }
    return result;
  }

  processHeading(
    node: HTMLElement,
    level: number,
    options: Required<HtmlToMarkdownOptions>
  ): string {
    const content = this.processChildren(node, options);
    const hashes = "#".repeat(level);
    return `\n\n${hashes} ${content.trim()}\n\n`;
  }

  processParagraph(
    node: HTMLElement,
    options: Required<HtmlToMarkdownOptions>
  ): string {
    const content = this.processChildren(node, options);
    if (!content.trim()) return "";
    return `\n\n${content.trim()}\n\n`;
  }

  processStrong(
    node: HTMLElement,
    options: Required<HtmlToMarkdownOptions>
  ): string {
    const content = this.processChildren(node, options);
    return `**${content}**`;
  }

  processEmphasis(
    node: HTMLElement,
    options: Required<HtmlToMarkdownOptions>
  ): string {
    const content = this.processChildren(node, options);
    return `*${content}*`;
  }

  processInlineCode(
    node: HTMLElement,
    options: Required<HtmlToMarkdownOptions>
  ): string {
    const content = node.textContent || "";
    return `\`${content}\``;
  }

  processCodeBlock(
    node: HTMLElement,
    options: Required<HtmlToMarkdownOptions>
  ): string {
    const codeElement = node.querySelector("code");
    const content = codeElement
      ? codeElement.textContent
      : node.textContent || "";
    const langClass = codeElement
      ? Array.from(codeElement.classList).find((cls) =>
          cls.startsWith("language-")
        )
      : Array.from(node.classList).find((cls) => cls.startsWith("language-"));
    const language = langClass ? langClass.replace("language-", "") : "";
    return `\n\n\`\`\`${language}\n${content}\n\`\`\`\n\n`;
  }

  processLink(
    node: HTMLElement,
    options: Required<HtmlToMarkdownOptions>
  ): string {
    const content = this.processChildren(node, options);
    const href = node.getAttribute("href") || "";
    const title = node.getAttribute("title");
    if (!href) return content;
    if (title) {
      return `[${content}](${href} "${title}")`;
    }
    return `[${content}](${href})`;
  }

  processImage(
    node: HTMLElement,
    options: Required<HtmlToMarkdownOptions>
  ): string {
    const src = node.getAttribute("src") || "";
    const alt = options.includeImageAlt
      ? node.getAttribute("alt") || `Image ${++this.imageCounter}`
      : "";
    const title = node.getAttribute("title");
    let imageMarkdown = `![${alt}](${src}`;
    if (title) {
      imageMarkdown += ` "${title}"`;
    }
    imageMarkdown += ")";
    if (options.preserveImageDimensions) {
      const width = node.getAttribute("width");
      const height = node.getAttribute("height");
      if (width || height) {
        imageMarkdown += ` <!-- width="${width || "auto"}" height="${
          height || "auto"
        }" -->`;
      }
    }
    return imageMarkdown;
  }

  processUnorderedList(
    node: HTMLElement,
    depth: number,
    options: Required<HtmlToMarkdownOptions>
  ): string {
    const items = Array.from(node.children).filter(
      (child) => child.tagName.toLowerCase() === "li"
    );
    let result = "\n\n";
    items.forEach((item) => {
      result += this.processListItem(item as HTMLElement, depth, options, "-");
    });
    return result + "\n";
  }

  processOrderedList(
    node: HTMLElement,
    depth: number,
    options: Required<HtmlToMarkdownOptions>
  ): string {
    const items = Array.from(node.children).filter(
      (child) => child.tagName.toLowerCase() === "li"
    );
    let result = "\n\n";
    items.forEach((item, index) => {
      result += this.processListItem(
        item as HTMLElement,
        depth,
        options,
        `${index + 1}.`
      );
    });
    return result + "\n";
  }

  processListItem(
    node: HTMLElement,
    depth: number,
    options: Required<HtmlToMarkdownOptions>,
    marker = "-"
  ): string {
    const indent = "  ".repeat(depth);
    const content = this.processChildren(node, options).trim();
    const nestedLists = node.querySelectorAll("ul, ol");
    let processedContent = content;
    nestedLists.forEach((list) => {
      const listType = list.tagName.toLowerCase();
      const nestedMarkdown =
        listType === "ul"
          ? this.processUnorderedList(list as HTMLElement, depth + 1, options)
          : this.processOrderedList(list as HTMLElement, depth + 1, options);
      processedContent = processedContent.replace(
        list.outerHTML,
        nestedMarkdown
      );
    });
    return `${indent}${marker} ${processedContent}\n`;
  }

  processBlockquote(
    node: HTMLElement,
    options: Required<HtmlToMarkdownOptions>
  ): string {
    const content = this.processChildren(node, options);
    const lines = content.split("\n");
    const quotedLines = lines.map((line) => `> ${line}`).join("\n");
    return `\n\n${quotedLines}\n\n`;
  }

  processTable(
    node: HTMLElement,
    options: Required<HtmlToMarkdownOptions>
  ): string {
    const rows = Array.from(node.querySelectorAll("tr"));
    if (rows.length === 0) return "";
    let result = "\n\n";
    rows.forEach((row, rowIndex) => {
      const cells = Array.from(row.querySelectorAll("td, th"));
      const cellContents = cells.map((cell) => {
        const content = this.processChildren(
          cell as HTMLElement,
          options
        ).trim();
        return content.replace(/\|/g, "\\|");
      });
      result += `| ${cellContents.join(" | ")} |\n`;
      if (rowIndex === 0) {
        const separator = cells.map(() => "---").join(" | ");
        result += `| ${separator} |\n`;
      }
    });
    return result + "\n";
  }

  processDiv(
    node: HTMLElement,
    options: Required<HtmlToMarkdownOptions>
  ): string {
    const className = node.getAttribute("class") || "";
    if (className.includes("code-block") || className.includes("highlight")) {
      return this.processCodeBlock(node, options);
    }
    const content = this.processChildren(node, options);
    return content ? `\n\n${content.trim()}\n\n` : "";
  }

  processSpan(
    node: HTMLElement,
    options: Required<HtmlToMarkdownOptions>
  ): string {
    const style = node.getAttribute("style") || "";
    const className = node.getAttribute("class") || "";
    let content = this.processChildren(node, options);
    if (style.includes("font-weight: bold") || className.includes("bold")) {
      content = `**${content}**`;
    } else if (
      style.includes("font-style: italic") ||
      className.includes("italic")
    ) {
      content = `*${content}*`;
    } else if (
      className.includes("highlight") ||
      style.includes("background-color")
    ) {
      content = `==${content}==`;
    }
    return content;
  }

  processStrikethrough(
    node: HTMLElement,
    options: Required<HtmlToMarkdownOptions>
  ): string {
    const content = this.processChildren(node, options);
    return `~~${content}~~`;
  }

  processSuperscript(
    node: HTMLElement,
    options: Required<HtmlToMarkdownOptions>
  ): string {
    const content = this.processChildren(node, options);
    return `^${content}^`;
  }

  processSubscript(
    node: HTMLElement,
    options: Required<HtmlToMarkdownOptions>
  ): string {
    const content = this.processChildren(node, options);
    return `~${content}~`;
  }

  processKeyboard(
    node: HTMLElement,
    options: Required<HtmlToMarkdownOptions>
  ): string {
    const content = this.processChildren(node, options);
    return `\`${content}\``;
  }

  processHighlight(
    node: HTMLElement,
    options: Required<HtmlToMarkdownOptions>
  ): string {
    const content = this.processChildren(node, options);
    return `==${content}==`;
  }
}

export default HTMLToMarkdownConverter;

export function convertHtmlToMarkdown(
  html: string,
  options: HtmlToMarkdownOptions = {}
): string {
  const converter = new HTMLToMarkdownConverter();
  return converter.convert({ html, options });
}
// // utils/htmlToMarkdown.js
// import { JSDOM } from "jsdom";

// interface HTMLTypes {
//   html: string;
//   options: Record<string, any>;
// }

// class HTMLToMarkdownConverter {
//   imageCounter: number;
//   linkCounter: number;
//   constructor() {
//     this.imageCounter = 0;
//     this.linkCounter = 0;    Promise<{ status: number; message: string | Record<string, unknown> }>
//   }

//   /**
//    * Main conversion function
//    * @param {string} html - HTML string to convert
//    * @param {Object} options - Conversion options
//    * @returns {string} - Converted markdown
//    */
//   convert({ html, options }: HTMLTypes) {
//     const {
//       preserveWhitespace = true,
//       includeImageAlt = true,
//       preserveImageDimensions = true,
//       convertTables = true,
//       preserveLineBreaks = true,
//     } = options;

//     // Create DOM from HTML
//     const dom = new JSDOM(html);
//     const document = dom.window.document;

//     // Reset counters
//     this.imageCounter = 0;
//     this.linkCounter = 0;

//     // Process the body or the entire document
//     const body = document.body || document.documentElement;

//     return this.processNode(body, "", 0, {
//       preserveWhitespace,
//       includeImageAlt,
//       preserveImageDimensions,
//       convertTables,
//       preserveLineBreaks,
//     }).trim();
//   }

//   /**
//    * Process individual DOM nodes
//    */
//   processNode(node, markdown = "", depth = 0, options = {}) {
//     if (!node) return markdown;

//     // Handle text nodes
//     if (node.nodeType === 3) {
//       // Text node
//       const text = node.textContent;
//       if (options.preserveWhitespace) {
//         return markdown + text;
//       }
//       return markdown + text.replace(/\s+/g, " ");
//     }

//     // Handle element nodes
//     if (node.nodeType === 1) {
//       // Element node
//       const tagName = node.tagName.toLowerCase();

//       switch (tagName) {
//         case "h1":
//           return markdown + this.processHeading(node, 1, options);
//         case "h2":
//           return markdown + this.processHeading(node, 2, options);
//         case "h3":
//           return markdown + this.processHeading(node, 3, options);
//         case "h4":
//           return markdown + this.processHeading(node, 4, options);
//         case "h5":
//           return markdown + this.processHeading(node, 5, options);
//         case "h6":
//           return markdown + this.processHeading(node, 6, options);

//         case "p":
//           return markdown + this.processParagraph(node, options);

//         case "br":
//           return markdown + (options.preserveLineBreaks ? "  \n" : "\n");

//         case "hr":
//           return markdown + "\n\n---\n\n";

//         case "strong":
//         case "b":
//           return markdown + this.processStrong(node, options);

//         case "em":
//         case "i":
//           return markdown + this.processEmphasis(node, options);

//         case "code":
//           return markdown + this.processInlineCode(node, options);

//         case "pre":
//           return markdown + this.processCodeBlock(node, options);

//         case "a":
//           return markdown + this.processLink(node, options);

//         case "img":
//           return markdown + this.processImage(node, options);

//         case "ul":
//           return markdown + this.processUnorderedList(node, depth, options);

//         case "ol":
//           return markdown + this.processOrderedList(node, depth, options);

//         case "li":
//           return markdown + this.processListItem(node, depth, options);

//         case "blockquote":
//           return markdown + this.processBlockquote(node, options);

//         case "table":
//           if (options.convertTables) {
//             return markdown + this.processTable(node, options);
//           }
//           return markdown + this.processChildren(node, options);

//         case "div":
//           return markdown + this.processDiv(node, options);

//         case "span":
//           return markdown + this.processSpan(node, options);

//         case "del":
//         case "s":
//         case "strike":
//           return markdown + this.processStrikethrough(node, options);

//         case "sup":
//           return markdown + this.processSuperscript(node, options);

//         case "sub":
//           return markdown + this.processSubscript(node, options);

//         case "kbd":
//           return markdown + this.processKeyboard(node, options);

//         case "mark":
//           return markdown + this.processHighlight(node, options);

//         // Block elements that should add spacing
//         case "section":
//         case "article":
//         case "header":
//         case "footer":
//         case "main":
//         case "aside":
//         case "nav":
//           return (
//             markdown + "\n\n" + this.processChildren(node, options) + "\n\n"
//           );

//         // Inline elements that should be processed but not add extra formatting
//         case "time":
//         case "abbr":
//         case "acronym":
//         case "address":
//         case "cite":
//         case "dfn":
//         case "var":
//         case "samp":
//           return markdown + this.processChildren(node, options);

//         // Script and style tags should be ignored
//         case "script":
//         case "style":
//         case "noscript":
//           return markdown;

//         default:
//           // For unknown elements, just process children
//           return markdown + this.processChildren(node, options);
//       }
//     }

//     return markdown;
//   }

//   /**
//    * Process all child nodes
//    */
//   processChildren(node, options) {
//     let result = "";
//     for (let child of node.childNodes) {
//       result = this.processNode(child, result, 0, options);
//     }
//     return result;
//   }

//   /**
//    * Process headings
//    */
//   processHeading(node, level, options) {
//     const content = this.processChildren(node, options);
//     const hashes = "#".repeat(level);
//     return `\n\n${hashes} ${content.trim()}\n\n`;
//   }

//   /**
//    * Process paragraphs
//    */
//   processParagraph(node, options) {
//     const content = this.processChildren(node, options);
//     if (!content.trim()) return "";
//     return `\n\n${content.trim()}\n\n`;
//   }

//   /**
//    * Process strong/bold text
//    */
//   processStrong(node, options) {
//     const content = this.processChildren(node, options);
//     return `**${content}**`;
//   }

//   /**
//    * Process emphasis/italic text
//    */
//   processEmphasis(node, options) {
//     const content = this.processChildren(node, options);
//     return `*${content}*`;
//   }

//   /**
//    * Process inline code
//    */
//   processInlineCode(node, options) {
//     const content = node.textContent;
//     return `\`${content}\``;
//   }

//   /**
//    * Process code blocks
//    */
//   processCodeBlock(node, options) {
//     const codeElement = node.querySelector("code");
//     const content = codeElement ? codeElement.textContent : node.textContent;

//     // Try to detect language from class
//     const langClass = codeElement
//       ? Array.from(codeElement.classList).find((cls) =>
//           cls.startsWith("language-")
//         )
//       : Array.from(node.classList).find((cls) => cls.startsWith("language-"));

//     const language = langClass ? langClass.replace("language-", "") : "";

//     return `\n\n\`\`\`${language}\n${content}\n\`\`\`\n\n`;
//   }

//   /**
//    * Process links
//    */
//   processLink(node, options) {
//     const content = this.processChildren(node, options);
//     const href = node.getAttribute("href") || "";
//     const title = node.getAttribute("title");

//     if (!href) return content;

//     if (title) {
//       return `[${content}](${href} "${title}")`;
//     }
//     return `[${content}](${href})`;
//   }

//   /**
//    * Process images
//    */
//   processImage(node, options) {
//     const src = node.getAttribute("src") || "";
//     const alt = options.includeImageAlt
//       ? node.getAttribute("alt") || `Image ${++this.imageCounter}`
//       : "";
//     const title = node.getAttribute("title");

//     let imageMarkdown = `![${alt}](${src}`;

//     if (title) {
//       imageMarkdown += ` "${title}"`;
//     }

//     imageMarkdown += ")";

//     // Add dimensions if available and requested
//     if (options.preserveImageDimensions) {
//       const width = node.getAttribute("width");
//       const height = node.getAttribute("height");
//       if (width || height) {
//         imageMarkdown += ` <!-- width="${width || "auto"}" height="${
//           height || "auto"
//         }" -->`;
//       }
//     }

//     return imageMarkdown;
//   }

//   /**
//    * Process unordered lists
//    */
//   processUnorderedList(node, depth, options) {
//     const items = Array.from(node.children).filter(
//       (child) => child.tagName.toLowerCase() === "li"
//     );
//     let result = "\n\n";

//     items.forEach((item) => {
//       result += this.processListItem(item, depth, options, "-");
//     });

//     return result + "\n";
//   }

//   /**
//    * Process ordered lists
//    */
//   processOrderedList(node, depth, options) {
//     const items = Array.from(node.children).filter(
//       (child) => child.tagName.toLowerCase() === "li"
//     );
//     let result = "\n\n";

//     items.forEach((item, index) => {
//       result += this.processListItem(item, depth, options, `${index + 1}.`);
//     });

//     return result + "\n";
//   }

//   /**
//    * Process list items
//    */
//   processListItem(node, depth, options, marker = "-") {
//     const indent = "  ".repeat(depth);
//     const content = this.processChildren(node, options).trim();

//     // Handle nested lists
//     const nestedLists = node.querySelectorAll("ul, ol");
//     let processedContent = content;

//     nestedLists.forEach((list) => {
//       const listType = list.tagName.toLowerCase();
//       const nestedMarkdown =
//         listType === "ul"
//           ? this.processUnorderedList(list, depth + 1, options)
//           : this.processOrderedList(list, depth + 1, options);

//       processedContent = processedContent.replace(
//         list.outerHTML,
//         nestedMarkdown
//       );
//     });

//     return `${indent}${marker} ${processedContent}\n`;
//   }

//   /**
//    * Process blockquotes
//    */
//   processBlockquote(node, options) {
//     const content = this.processChildren(node, options);
//     const lines = content.split("\n");
//     const quotedLines = lines.map((line) => `> ${line}`).join("\n");
//     return `\n\n${quotedLines}\n\n`;
//   }

//   /**
//    * Process tables
//    */
//   processTable(node, options) {
//     const rows = Array.from(node.querySelectorAll("tr"));
//     if (rows.length === 0) return "";

//     let result = "\n\n";

//     rows.forEach((row, rowIndex) => {
//       const cells = Array.from(row.querySelectorAll("td, th"));
//       const cellContents = cells.map((cell) => {
//         const content = this.processChildren(cell, options).trim();
//         return content.replace(/\|/g, "\\|"); // Escape pipes
//       });

//       result += `| ${cellContents.join(" | ")} |\n`;

//       // Add header separator after first row
//       if (rowIndex === 0) {
//         const separator = cells.map(() => "---").join(" | ");
//         result += `| ${separator} |\n`;
//       }
//     });

//     return result + "\n";
//   }

//   /**
//    * Process div elements
//    */
//   processDiv(node, options) {
//     // Check if div has special classes or attributes
//     const className = node.getAttribute("class") || "";

//     // Handle special div types
//     if (className.includes("code-block") || className.includes("highlight")) {
//       return this.processCodeBlock(node, options);
//     }

//     // For regular divs, add spacing and process children
//     const content = this.processChildren(node, options);
//     return content ? `\n\n${content.trim()}\n\n` : "";
//   }

//   /**
//    * Process span elements
//    */
//   processSpan(node, options) {
//     // Check for special styling
//     const style = node.getAttribute("style") || "";
//     const className = node.getAttribute("class") || "";

//     let content = this.processChildren(node, options);

//     // Handle common span styles
//     if (style.includes("font-weight: bold") || className.includes("bold")) {
//       content = `**${content}**`;
//     } else if (
//       style.includes("font-style: italic") ||
//       className.includes("italic")
//     ) {
//       content = `*${content}*`;
//     } else if (
//       className.includes("highlight") ||
//       style.includes("background-color")
//     ) {
//       content = `==${content}==`; // Highlight syntax (some markdown parsers support this)
//     }

//     return content;
//   }

//   /**
//    * Process strikethrough text
//    */
//   processStrikethrough(node, options) {
//     const content = this.processChildren(node, options);
//     return `~~${content}~~`;
//   }

//   /**
//    * Process superscript
//    */
//   processSuperscript(node, options) {
//     const content = this.processChildren(node, options);
//     return `^${content}^`;
//   }

//   /**
//    * Process subscript
//    */
//   processSubscript(node, options) {
//     const content = this.processChildren(node, options);
//     return `~${content}~`;
//   }

//   /**
//    * Process keyboard input
//    */
//   processKeyboard(node, options) {
//     const content = this.processChildren(node, options);
//     return `\`${content}\``;
//   }

//   /**
//    * Process highlighted text
//    */
//   processHighlight(node, options) {
//     const content = this.processChildren(node, options);
//     return `==${content}==`;
//   }
// }

// // Export the converter
// export default HTMLToMarkdownConverter;

// // Main conversion function - this is the primary export
// export function convertHtmlToMarkdown(html, options = {}) {
//   const converter = new HTMLToMarkdownConverter();
//   return converter.convert(html, options);
// }

// // // Alternative named export for convenience
// // export const htmlToMarkdown = convertHtmlToMarkdown;

// // // Simple standalone function (if you prefer not to use the class)
// // export function simpleHtmlToMarkdown(html) {
// //   if (!html) return "";

// //   const converter = new HTMLToMarkdownConverter();
// //   return converter.convert(html, {
// //     preserveWhitespace: true,
// //     includeImageAlt: true,
// //     preserveImageDimensions: true,
// //     convertTables: true,
// //     preserveLineBreaks: true,
// //   });
// // }
