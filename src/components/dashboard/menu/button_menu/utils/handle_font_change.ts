import type { Editor } from "@tiptap/core";

/**
 * Maps toolbar button values to TipTap chain commands on the given editor.
 * Called from FontStyleUI's onClick handler with the body editor instance.
 */
export const handleFontChange = (value: string, editor: Editor) => {
  const chain = editor.chain().focus();

  switch (value) {
    case "bold":
      chain.toggleBold().run();
      break;
    case "italic":
      chain.toggleItalic().run();
      break;
    case "underline":
      chain.toggleUnderline().run();
      break;
    case "font_h2":
      chain.toggleHeading({ level: 2 }).run();
      break;
    case "font_h3":
      chain.toggleHeading({ level: 3 }).run();
      break;
    case "section":
      chain.setHorizontalRule().run();
      break;
    case "quote":
      chain.toggleBlockquote().run();
      break;
    case "list":
      chain.toggleBulletList().run();
      break;
    case "ordered_list":
      chain.toggleOrderedList().run();
      break;
    case "code_block":
      chain.toggleCodeBlock().run();
      break;
    case "table":
      chain.insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
      break;
    case "highlight":
      chain.toggleHighlight().run();
      break;
    default:
      break;
  }
};
