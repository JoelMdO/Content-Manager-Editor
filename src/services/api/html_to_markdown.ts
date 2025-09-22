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
  type?: string;
}

class HTMLToMarkdownConverter {
  imageCounter: number;
  linkCounter: number;
  private dom: JSDOM;
  private Node: typeof Node;

  constructor() {
    this.imageCounter = 0;
    this.linkCounter = 0;
    this.dom = new JSDOM();
    this.Node = this.dom.window.Node;
  }

  convert({ html, options = {}, type }: HTMLTypes): string {
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
    const newType = type === "post" ? "post" : "";
    return this.processNode(
      body,
      "",
      0,
      {
        preserveWhitespace,
        includeImageAlt,
        preserveImageDimensions,
        convertTables,
        preserveLineBreaks,
      },
      newType
    ).trim();
  }

  processNode(
    node: Node,
    markdown = "",
    depth = 0,
    options: Required<HtmlToMarkdownOptions>,
    type?: string
  ): string {
    if (!node) return markdown;
    console.log("type", type);

    if (node.nodeType === this.Node.TEXT_NODE) {
      const text = node.textContent || "";
      return (
        markdown +
        (options.preserveWhitespace ? text : text.replace(/\s+/g, " "))
      );
    }

    if (node.nodeType === this.Node.ELEMENT_NODE) {
      const tagName = (node as HTMLElement).tagName.toLowerCase();

      switch (tagName) {
        case "h1":
          return (
            markdown +
            this.processHeading(node as HTMLElement, 1, options, type)
          );
        case "h2":
          return (
            markdown +
            this.processHeading(node as HTMLElement, 2, options, type)
          );
        case "h3":
          return (
            markdown +
            this.processHeading(node as HTMLElement, 3, options, type)
          );
        case "h4":
          return (
            markdown +
            this.processHeading(node as HTMLElement, 4, options, type)
          );
        case "h5":
          return (
            markdown +
            this.processHeading(node as HTMLElement, 5, options, type)
          );
        case "h6":
          return (
            markdown +
            this.processHeading(node as HTMLElement, 6, options, type)
          );
        case "p":
          return (
            markdown + this.processParagraph(node as HTMLElement, options, type)
          );
        case "br":
          return markdown + (options.preserveLineBreaks ? "  \n" : "\n");
        case "hr":
          return markdown + "\n\n---\n\n";
        case "strong":
        case "b":
          return (
            markdown + this.processStrong(node as HTMLElement, options, type)
          );
        case "em":
        case "i":
          return (
            markdown + this.processEmphasis(node as HTMLElement, options, type)
          );
        case "code":
          return (
            markdown +
            this.processInlineCode(node as HTMLElement, options, type)
          );
        case "pre":
          return (
            markdown + this.processCodeBlock(node as HTMLElement, options, type)
          );
        case "a":
          return (
            markdown + this.processLink(node as HTMLElement, options, type)
          );
        case "img":
          return (
            markdown + this.processImage(node as HTMLElement, options, type)
          );
        case "ul":
          return (
            markdown +
            this.processUnorderedList(node as HTMLElement, depth, options, type)
          );
        case "ol":
          return (
            markdown +
            this.processOrderedList(node as HTMLElement, depth, options, type)
          );
        case "li":
          return (
            markdown +
            this.processListItem(node as HTMLElement, depth, options, type)
          );
        case "blockquote":
          return (
            markdown +
            this.processBlockquote(node as HTMLElement, options, type)
          );
        case "table":
          if (options.convertTables) {
            return (
              markdown + this.processTable(node as HTMLElement, options, type)
            );
          }
          return (
            markdown + this.processChildren(node as HTMLElement, options, type)
          );
        case "div":
          return markdown + this.processDiv(node as HTMLElement, options, type);
        case "span":
          return (
            markdown + this.processSpan(node as HTMLElement, options, type)
          );
        case "del":
        case "s":
        case "strike":
          return (
            markdown +
            this.processStrikethrough(node as HTMLElement, options, type)
          );
        case "sup":
          return (
            markdown +
            this.processSuperscript(node as HTMLElement, options, type)
          );
        case "sub":
          return (
            markdown + this.processSubscript(node as HTMLElement, options, type)
          );
        case "kbd":
          return (
            markdown + this.processKeyboard(node as HTMLElement, options, type)
          );
        case "mark":
          return (
            markdown + this.processHighlight(node as HTMLElement, options, type)
          );
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
            this.processChildren(node as HTMLElement, options, type) +
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
          return (
            markdown + this.processChildren(node as HTMLElement, options, type)
          );
        case "script":
        case "style":
        case "noscript":
          return markdown;
        default:
          return (
            markdown + this.processChildren(node as HTMLElement, options, type)
          );
      }
    }
    return markdown;
  }

  processChildren(
    node: HTMLElement,
    options: Required<HtmlToMarkdownOptions>,
    type?: string
  ): string {
    let result = "";
    for (let child of Array.from(node.childNodes)) {
      result = this.processNode(child, result, 0, options, type);
    }
    return result;
  }

  processHeading(
    node: HTMLElement,
    level: number,
    options: Required<HtmlToMarkdownOptions>,
    type?: string
  ): string {
    const content = this.processChildren(node, options, type);
    const hashes = "#".repeat(level);
    return `\n${hashes} ${content.trim()}\n\n`;
  }

  processParagraph(
    node: HTMLElement,
    options: Required<HtmlToMarkdownOptions>,
    type?: string
  ): string {
    const content = this.processChildren(node, options, type);
    if (!content.trim()) return "";
    // return `\n\n${content.trim()}\n\n`;
    return `${content.trim()}\n`;
  }

  processStrong(
    node: HTMLElement,
    options: Required<HtmlToMarkdownOptions>,
    type?: string
  ): string {
    const content = this.processChildren(node, options, type);
    return `**${content}**`;
  }

  processEmphasis(
    node: HTMLElement,
    options: Required<HtmlToMarkdownOptions>,
    type?: string
  ): string {
    const content = this.processChildren(node, options, type);
    return `*${content}*`;
  }

  processInlineCode(
    node: HTMLElement,
    options: Required<HtmlToMarkdownOptions>,
    type?: string
  ): string {
    const content = node.textContent || "";
    return `\`${content}\``;
  }

  processCodeBlock(
    node: HTMLElement,
    options: Required<HtmlToMarkdownOptions>,
    type?: string
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
    options: Required<HtmlToMarkdownOptions>,
    type?: string
  ): string {
    const content = this.processChildren(node, options, type);
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
    options: Required<HtmlToMarkdownOptions>,
    type?: string
  ): string {
    console.log("type in processImage", type);

    const src = node.getAttribute("src") || "";
    const alt = options.includeImageAlt
      ? node.getAttribute("alt") || `Image ${++this.imageCounter}`
      : "";
    // Instead of including the full base64, just use a placeholder
    let imageMarkdown = `![${alt}]({src_${alt}})`;
    console.log("node in processImage", node);
    console.log("alt in processImage", alt);

    //
    if (type === "post") {
      console.log("src in processImage", src);
      console.log("alt in processImage", alt);

      return `![${alt}](${src})`;
    }
    //
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
    options: Required<HtmlToMarkdownOptions>,
    type?: string
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
    options: Required<HtmlToMarkdownOptions>,
    type?: string
  ): string {
    const items = Array.from(node.children).filter(
      (child) => child.tagName.toLowerCase() === "li"
    );
    console.log("items as processORderedList", items);

    let result = "\n";
    items.forEach((item, index) => {
      result += this.processListItem(
        item as HTMLElement,
        depth,
        options,
        `${index + 1}.`
      );
    });
    console.log("result as processOrderedList", result);

    return result + "\n";
  }

  processListItem(
    node: HTMLElement,
    depth: number,
    options: Required<HtmlToMarkdownOptions>,
    marker = "-",
    type?: string
  ): string {
    const indent = "  ".repeat(depth);
    // Get text content excluding nested lists
    let textContent = "";
    for (const child of Array.from(node.childNodes)) {
      if (child.nodeType === this.Node.TEXT_NODE) {
        textContent += child.textContent || "";
      } else if (child.nodeType === this.Node.ELEMENT_NODE) {
        const childElement = child as HTMLElement;
        const tagName = childElement.tagName.toLowerCase();

        // Skip nested lists, process other elements
        if (tagName !== "ul" && tagName !== "ol") {
          textContent += this.processNode(child, "", depth, options);
        }
      }
    }

    // Clean up the text content
    textContent = textContent.trim();
    // const content = this.processChildren(node, options).trim();
    // const nestedLists = node.querySelectorAll("ul, ol");
    const nestedLists = Array.from(node.children).filter(
      (child) =>
        child.tagName.toLowerCase() === "ul" ||
        child.tagName.toLowerCase() === "ol"
    );
    console.log("nestedLists", nestedLists);

    // let processedContent = content;
    let nestedMarkdown = "";
    nestedLists.forEach((list) => {
      const listType = list.tagName.toLowerCase();
      // const nestedMarkdown =
      nestedMarkdown +=
        listType === "ul"
          ? this.processUnorderedList(
              list as HTMLElement,
              depth + 1,
              options,
              type
            )
          : this.processOrderedList(
              list as HTMLElement,
              depth + 1,
              options,
              type
            );
      // processedContent = processedContent.replace(
      //   list.outerHTML,
      //   nestedMarkdown
      // );
    });
    console.log("nestedMarkdown processedListItem", nestedMarkdown);
    // Combine text content with nested lists
    let result = `${indent}${marker} ${textContent}`;
    if (nestedMarkdown) {
      result += nestedMarkdown;
    }
    result += "\n";

    return result;
    // return `${indent}${marker} ${nestedMarkdown}\n`;
    // return `${indent}${marker} ${processedContent}\n`;
  }

  processBlockquote(
    node: HTMLElement,
    options: Required<HtmlToMarkdownOptions>,
    type?: string
  ): string {
    const content = this.processChildren(node, options, type);
    const lines = content.split("\n");
    const quotedLines = lines.map((line) => `> ${line}`).join("\n");
    return `\n\n${quotedLines}\n\n`;
  }

  processTable(
    node: HTMLElement,
    options: Required<HtmlToMarkdownOptions>,
    type?: string
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
    options: Required<HtmlToMarkdownOptions>,
    type?: string
  ): string {
    const className = node.getAttribute("class") || "";
    if (className.includes("code-block") || className.includes("highlight")) {
      return this.processCodeBlock(node, options, type);
    }
    const content = this.processChildren(node, options, type);
    // return content ? `\n\n${content.trim()}\n\n` : "";
    return content ? `${content.trim()}\n` : "";
  }

  processSpan(
    node: HTMLElement,
    options: Required<HtmlToMarkdownOptions>,
    type?: string
  ): string {
    const style = node.getAttribute("style") || "";
    const className = node.getAttribute("class") || "";
    let content = this.processChildren(node, options, type);
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
    } else if (className.includes("font_h2") || style.includes("font_h2")) {
      content = `## ${content}`;
    } else if (className.includes("font_h3") || style.includes("font_h3")) {
      content = `### ${content}`;
    }
    return content;
  }

  processStrikethrough(
    node: HTMLElement,
    options: Required<HtmlToMarkdownOptions>,
    type?: string
  ): string {
    const content = this.processChildren(node, options, type);
    return `~~${content}~~`;
  }

  processSuperscript(
    node: HTMLElement,
    options: Required<HtmlToMarkdownOptions>,
    type?: string
  ): string {
    const content = this.processChildren(node, options, type);
    return `^${content}^`;
  }

  processSubscript(
    node: HTMLElement,
    options: Required<HtmlToMarkdownOptions>,
    type?: string
  ): string {
    const content = this.processChildren(node, options, type);
    return `~${content}~`;
  }

  processKeyboard(
    node: HTMLElement,
    options: Required<HtmlToMarkdownOptions>,
    type?: string
  ): string {
    const content = this.processChildren(node, options, type);
    return `\`${content}\``;
  }

  processHighlight(
    node: HTMLElement,
    options: Required<HtmlToMarkdownOptions>,
    type?: string
  ): string {
    const content = this.processChildren(node, options, type);
    return `==${content}==`;
  }
}

export default HTMLToMarkdownConverter;

export function convertHtmlToMarkdown(
  html: string,
  options: HtmlToMarkdownOptions = {},
  type: string = ""
): string {
  const converter = new HTMLToMarkdownConverter();
  return converter.convert({ html, options, type });
}
