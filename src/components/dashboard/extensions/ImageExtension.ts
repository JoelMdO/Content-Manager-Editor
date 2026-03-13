import { Image } from "@tiptap/extension-image";
import { deleteBlob } from "@/lib/imageStore/imageStore";
import { removeStoredImage } from "@/components/dashboard/menu/button_menu/utils/images_edit/delete_img_from_localstorage";

/**
 * CustomImage — extends the default TipTap Image extension to:
 * 1. Persist the `data-ref-id` attribute so the IndexedDB imageId survives
 *    HTML serialisation and de-serialisation (`editor.getHTML()` /
 *    `editor.commands.setContent()`).
 * 2. On Backspace / Delete when an image node is selected, call `deleteBlob`
 *    to remove the corresponding raw Blob from IndexedDB so the store does
 *    not accumulate orphaned data.
 */
export const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      "data-ref-id": {
        default: null,
        parseHTML: (element) => element.getAttribute("data-ref-id"),
        renderHTML: (attributes) => {
          if (!attributes["data-ref-id"]) return {};
          return { "data-ref-id": attributes["data-ref-id"] };
        },
      },
    };
  },

  addKeyboardShortcuts() {
    const deleteSelectedImage = () => {
      const { state } = this.editor;
      const { selection } = state;
      if (selection.empty) return false;
      const node = state.doc.nodeAt(selection.from);
      if (node?.type.name === "image") {
        const imageId = node.attrs["data-ref-id"] as string | null;
        if (imageId) {
          const dbName = sessionStorage.getItem("db") ?? "";
          void deleteBlob(imageId).catch((error) => {
            console.error("Failed to delete image blob from IndexedDB:", error);
          });
          removeStoredImage(imageId, dbName, true);
          removeStoredImage(imageId, dbName, false);
        }
      }
      // Return false so TipTap continues with its default deletion behaviour.
      return false;
    };

    return {
      Backspace: deleteSelectedImage,
      Delete: deleteSelectedImage,
    };
  },
});
