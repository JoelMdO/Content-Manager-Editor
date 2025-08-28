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
    } else if (className.includes("font_h2") || style.includes("font_h2")) {
      content = `## ${content}`;
    } else if (className.includes("font_h3") || style.includes("font_h3")) {
      content = `### ${content}`;
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
