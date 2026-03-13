import callHub from "../../../../../services/api/call_hub";
import type { Editor } from "@tiptap/core";

type InsertLinkResult = { status: number; message: string };

/**
 * Validates the URL with the hub, then inserts it as a TipTap link at the
 * current selection.  For the "playbook" type the editor is not used; the
 * validated URL is returned for the caller to store.
 */
const insertLink = async (
  type: string,
  link_url: string,
  editor?: Editor | null,
  editableTitle?: string,
): Promise<InsertLinkResult> => {
  if (!link_url) return { status: 205, message: "Link not inserted" };

  const response = await callHub("clean-link", link_url);
  if (response.status !== 200)
    return { status: 205, message: "Link not valid" };

  if (type === "playbook") {
    return { status: 200, message: link_url };
  }

  if (!editor) return { status: 205, message: "Link not inserted" };

  try {
    // If text is selected, wrap it; otherwise insert the link title as text
    const { from, to, empty } = editor.state.selection;
    if (empty) {
      // No selection — insert the link title as a new text node
      const text = editableTitle || link_url;
      editor
        .chain()
        .focus()
        .insertContent(`<a href="${link_url}">${text}</a>`)
        .run();
    } else {
      // Wrap the selected text with the link
      editor.chain().focus().setLink({ href: link_url }).run();
      void from;
      void to; // consumed by setLink implicitly
    }
    return { status: 200, message: "Link inserted successfully" };
  } catch (error) {
    return { status: 205, message: error as string };
  }
};

export default insertLink;
