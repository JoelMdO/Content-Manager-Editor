/**
 * Simple Text Editor with Proper Structure Handling
 * Handles: paste, cut, delete, backspace, and maintains clean HTML structure
 */

export default class TextEditor {
  private editor: HTMLElement;
  private isComposing: boolean = false;

  constructor(editorElement: HTMLElement) {
    this.editor = editorElement;
    this.editor.contentEditable = "true";
    this.initializeStructure();
    this.setupEventListeners();
  }

  /**
   * Initialize with proper structure - ensure content is wrapped in a div
   */
  public initializeStructure(): void {
    if (!this.editor.firstChild || this.editor.firstChild.nodeName !== "DIV") {
      // Empty editor - add initial wrapper div
      const wrapper = document.createElement("div");
      wrapper.innerHTML = "<br>"; // Browser needs this for cursor positioning
      this.editor.appendChild(wrapper);
    } else {
      // Wrap existing content if not already wrapped
      this.normalizeStructure();
    }
  }

  /**
   * Normalize the editor structure - ensure all content is in proper containers
   */
  private normalizeStructure(): void {
    const children = Array.from(this.editor.childNodes);

    // If we have orphaned text nodes or inline elements, wrap them
    let needsWrapper = false;
    for (const child of children) {
      if (child.nodeType === Node.TEXT_NODE && child.textContent?.trim()) {
        needsWrapper = true;
        break;
      }
      if (child.nodeType === Node.ELEMENT_NODE) {
        const tagName = (child as Element).tagName.toLowerCase();
        if (["span", "strong", "em", "u", "a"].includes(tagName)) {
          needsWrapper = true;
          break;
        }
      }
    }

    if (needsWrapper) {
      const wrapper = document.createElement("div");
      while (this.editor.firstChild) {
        wrapper.appendChild(this.editor.firstChild);
      }
      this.editor.appendChild(wrapper);
    }
  }

  /**
   * Setup all event listeners for proper handling
   */
  private setupEventListeners(): void {
    // Handle Enter key - create new paragraphs or line breaks
    this.editor.addEventListener("keydown", (e) => this.handleKeyDown(e));

    // Handle paste - clean and normalize pasted content
    this.editor.addEventListener("paste", (e) => this.handlePaste(e));

    // Handle cut - ensure structure remains valid after cut
    this.editor.addEventListener("cut", (e) => this.handleCut(e));

    // Handle input - normalize after any input
    this.editor.addEventListener("input", (e) => this.handleInput(e));

    // Handle composition (for IME input like Chinese, Japanese)
    this.editor.addEventListener("compositionstart", () => {
      this.isComposing = true;
    });

    this.editor.addEventListener("compositionend", () => {
      this.isComposing = false;
      this.normalizeAfterInput();
    });

    // Handle beforeinput for better control (modern browsers)
    this.editor.addEventListener("beforeinput", (e) =>
      this.handleBeforeInput(e)
    );
  }

  /**
   * Handle keydown events - Enter, Backspace, Delete
   */
  private handleKeyDown(e: KeyboardEvent): void {
    // Don't interfere during composition
    if (this.isComposing) return;

    switch (e.key) {
      case "Enter":
        this.handleEnterKey(e);
        break;
      case "Backspace":
        this.handleBackspace(e);
        break;
      case "Delete":
        this.handleDelete(e);
        break;
    }
  }

  /**
   * Handle Enter key - create proper line breaks or new blocks
   */
  private handleEnterKey(e: KeyboardEvent): void {
    e.preventDefault();

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);

    // Check if we're in a heading
    let currentBlock = this.getBlockElement(range.startContainer);
    const isHeading =
      currentBlock && ["H1", "H2", "H3"].includes(currentBlock.tagName);

    if (e.shiftKey || !isHeading) {
      // Shift+Enter or regular text: insert <br>
      this.insertLineBreak(range);
    } else {
      // In heading without Shift: exit heading and create new paragraph
      this.exitBlock(range, currentBlock!);
    }

    // Clean up after insertion
    setTimeout(() => this.normalizeAfterInput(), 0);
  }

  /**
   * Insert a line break at cursor position
   */
  private insertLineBreak(range: Range): void {
    const br = document.createElement("br");
    range.deleteContents();
    range.insertNode(br);

    // Insert second br if at end of block (for cursor positioning)
    const nextNode = br.nextSibling;
    if (
      !nextNode ||
      (nextNode.nodeType === Node.ELEMENT_NODE &&
        (nextNode as Element).tagName === "BR")
    ) {
      const br2 = document.createElement("br");
      br.parentNode?.insertBefore(br2, br.nextSibling);
      range.setStartAfter(br);
    } else {
      range.setStartAfter(br);
    }

    range.collapse(true);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
  }

  /**
   * Exit current block (e.g., heading) and create new paragraph
   */
  private exitBlock(range: Range, currentBlock: HTMLElement): void {
    const newBlock = document.createElement("div");
    newBlock.innerHTML = "<br>";

    // Insert after current block
    currentBlock.parentNode?.insertBefore(newBlock, currentBlock.nextSibling);

    // Move cursor to new block
    range.setStart(newBlock, 0);
    range.collapse(true);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
  }

  /**
   * Handle Backspace key - prevent structure corruption
   */
  private handleBackspace(e: KeyboardEvent): void {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);

    // If at the start of editor, prevent deletion
    if (this.isAtEditorStart(range)) {
      e.preventDefault();
      return;
    }

    // If deleting would leave empty block, handle specially
    const currentBlock = this.getBlockElement(range.startContainer);
    if (currentBlock && this.isBlockEmpty(currentBlock) && range.collapsed) {
      e.preventDefault();
      this.mergeWithPreviousBlock(currentBlock);
      return;
    }

    // Let default happen, then normalize
    setTimeout(() => this.normalizeAfterInput(), 0);
  }

  /**
   * Handle Delete key - prevent structure corruption
   */
  private handleDelete(e: KeyboardEvent): void {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);

    // If at the end of editor, prevent deletion
    if (this.isAtEditorEnd(range)) {
      e.preventDefault();
      return;
    }

    // Let default happen, then normalize
    setTimeout(() => this.normalizeAfterInput(), 0);
  }

  /**
   * Handle paste event - clean pasted content
   */
  private handlePaste(e: ClipboardEvent): void {
    e.preventDefault();

    const clipboardData = e.clipboardData;
    if (!clipboardData) return;

    // Try to get HTML first, fallback to plain text
    let html = clipboardData.getData("text/html");
    const text = clipboardData.getData("text/plain");

    if (html) {
      // Clean the HTML
      html = this.cleanPastedHTML(html);
    } else if (text) {
      // Convert plain text to HTML (preserve line breaks)
      html = text.replace(/\n/g, "<br>");
    }

    if (html) {
      // Insert cleaned HTML
      document.execCommand("insertHTML", false, html);

      // Normalize after paste
      setTimeout(() => this.normalizeAfterInput(), 0);
    }
  }

  /**
   * Clean pasted HTML - remove unwanted tags and attributes
   */
  private cleanPastedHTML(html: string): string {
    // Create temporary div to parse HTML
    const temp = document.createElement("div");
    temp.innerHTML = html;

    // Remove script tags and other dangerous elements
    const dangerousTags = ["script", "style", "iframe", "object", "embed"];
    dangerousTags.forEach((tag) => {
      temp.querySelectorAll(tag).forEach((el) => el.remove());
    });

    // Clean attributes (keep only specific safe ones)
    const allowedAttrs = ["href", "src", "alt", "title"];
    temp.querySelectorAll("*").forEach((el) => {
      const attrs = Array.from(el.attributes);
      attrs.forEach((attr) => {
        if (!allowedAttrs.includes(attr.name)) {
          el.removeAttribute(attr.name);
        }
      });
    });

    // Convert certain tags to our preferred format
    temp.querySelectorAll("b").forEach((el) => {
      const strong = document.createElement("strong");
      strong.innerHTML = el.innerHTML;
      el.replaceWith(strong);
    });

    temp.querySelectorAll("i").forEach((el) => {
      const em = document.createElement("em");
      em.innerHTML = el.innerHTML;
      el.replaceWith(em);
    });

    return temp.innerHTML;
  }

  /**
   * Handle cut event - ensure structure remains valid
   */
  private handleCut(e: ClipboardEvent): void {
    // Let default cut happen
    setTimeout(() => {
      // Check if editor is now empty
      if (!this.editor.textContent?.trim()) {
        this.editor.innerHTML = "<div><br></div>";
        this.placeCursorAtStart();
      } else {
        this.normalizeAfterInput();
      }
    }, 0);
  }

  /**
   * Handle input event - normalize structure after any input
   */
  private handleInput(e: Event): void {
    if (this.isComposing) return;

    // Debounce normalization slightly for performance
    setTimeout(() => this.normalizeAfterInput(), 0);
  }

  /**
   * Handle beforeinput event - for fine-grained control
   */
  private handleBeforeInput(e: Event): void {
    const inputEvent = e as InputEvent;

    // Handle specific input types that might break structure
    switch (inputEvent.inputType) {
      case "insertParagraph":
        // We handle this in keydown
        break;
      case "deleteContentBackward":
      case "deleteContentForward":
        // We handle this in keydown
        break;
    }
  }

  /**
   * Normalize structure after input changes
   */
  private normalizeAfterInput(): void {
    // Remove empty text nodes
    this.removeEmptyTextNodes(this.editor);

    // Remove consecutive <br> tags (more than 2)
    this.normalizeLineBreaks();

    // Ensure we have at least one block
    if (!this.editor.firstChild || !this.editor.textContent?.trim()) {
      this.editor.innerHTML = "<div><br></div>";
    }

    // Remove empty blocks (except if it's the only one)
    this.removeEmptyBlocks();

    // Merge adjacent text nodes
    this.editor.normalize();
  }

  /**
   * Remove empty text nodes recursively
   */
  private removeEmptyTextNodes(node: Node): void {
    const children = Array.from(node.childNodes);
    children.forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE && !child.textContent?.trim()) {
        // Don't remove if it's the only content
        if (node.childNodes.length > 1) {
          child.remove();
        }
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        this.removeEmptyTextNodes(child);
      }
    });
  }

  /**
   * Normalize line breaks - max 2 consecutive <br>
   */
  private normalizeLineBreaks(): void {
    const brs = this.editor.querySelectorAll("br");
    let consecutiveCount = 0;
    let previousBr: HTMLElement | null = null;

    brs.forEach((br) => {
      const prev = br.previousSibling;

      if (prev && prev.nodeName === "BR") {
        consecutiveCount++;
        if (consecutiveCount >= 2) {
          // Remove this BR (3rd or more consecutive)
          br.remove();
        }
        previousBr = br as HTMLElement;
      } else {
        consecutiveCount = 0;
        previousBr = br as HTMLElement;
      }
    });
  }

  /**
   * Remove empty blocks (but keep at least one)
   */
  private removeEmptyBlocks(): void {
    const blocks = Array.from(this.editor.children);

    blocks.forEach((block, index) => {
      if (this.isBlockEmpty(block as HTMLElement)) {
        // Keep first block even if empty
        if (blocks.length > 1 && index > 0) {
          block.remove();
        }
      }
    });
  }

  /**
   * Check if block is empty (only whitespace or single <br>)
   */
  private isBlockEmpty(block: HTMLElement): boolean {
    const text = block.textContent?.trim();
    if (text) return false;

    const children = Array.from(block.childNodes);
    if (children.length === 0) return true;
    if (children.length === 1 && children[0].nodeName === "BR") return true;

    return false;
  }

  /**
   * Get the block-level element containing the node
   */
  private getBlockElement(node: Node): HTMLElement | null {
    let current: Node | null = node;

    while (current && current !== this.editor) {
      if (current.nodeType === Node.ELEMENT_NODE) {
        const element = current as HTMLElement;
        const tagName = element.tagName;

        if (["DIV", "P", "H1", "H2", "H3", "BLOCKQUOTE"].includes(tagName)) {
          return element;
        }
      }
      current = current.parentNode;
    }

    return null;
  }

  /**
   * Check if cursor is at the start of editor
   */
  private isAtEditorStart(range: Range): boolean {
    if (!range.collapsed) return false;

    const block = this.getBlockElement(range.startContainer);
    if (!block) return false;

    // Check if it's the first block
    if (block !== this.editor.firstChild) return false;

    // Check if cursor is at offset 0
    return range.startOffset === 0;
  }

  /**
   * Check if cursor is at the end of editor
   */
  private isAtEditorEnd(range: Range): boolean {
    if (!range.collapsed) return false;

    const block = this.getBlockElement(range.startContainer);
    if (!block) return false;

    // Check if it's the last block
    if (block !== this.editor.lastChild) return false;

    // Check if cursor is at the end
    const container = range.startContainer;
    if (container.nodeType === Node.TEXT_NODE) {
      return range.startOffset === container.textContent?.length;
    }
    return range.startOffset === container.childNodes.length;
  }

  /**
   * Merge current block with previous block
   */
  private mergeWithPreviousBlock(currentBlock: HTMLElement): void {
    const prevBlock = currentBlock.previousSibling;

    if (prevBlock && prevBlock.nodeType === Node.ELEMENT_NODE) {
      const prevElement = prevBlock as HTMLElement;

      // Move cursor to end of previous block
      const range = document.createRange();
      range.selectNodeContents(prevElement);
      range.collapse(false);

      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);

      // Remove current block
      currentBlock.remove();
    }
  }

  /**
   * Place cursor at the start of editor
   */
  private placeCursorAtStart(): void {
    const range = document.createRange();
    const selection = window.getSelection();

    if (this.editor.firstChild) {
      range.setStart(this.editor.firstChild, 0);
      range.collapse(true);
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  }

  /**
   * Get current HTML content
   */
  public getContent(): string {
    return this.editor.innerHTML;
  }

  /**
   * Set HTML content
   */
  public setContent(html: string): void {
    this.editor.innerHTML = html;
    this.normalizeStructure();
    this.normalizeAfterInput();
  }

  /**
   * Clear all content
   */
  public clear(): void {
    this.editor.innerHTML = "<div><br></div>";
    this.placeCursorAtStart();
  }
}

// Example usage:
// const editor = new TextEditor(document.getElementById('editor')!);
// editor.setContent('<div>Hello world</div>');
// const content = editor.getContent();
