// CHANGE LOG
// Changed by : Copilot
// Date       : 2026-03-11 (TipTap migration)
// Reason     : Replace manual DOM image insertion (document.createElement +
//              range.insertNode) with TipTap's insertContent command so that
//              the image node is managed by the ProseMirror document model.
//              The custom `data-ref-id` attribute is preserved by CustomImage
//              extension and round-trips through getHTML() / setContent().
// ORIGINAL: created <img> DOM element, mutated editorRef.innerHTML directly.
//
import { ChangeEvent } from "react";
import type { Editor } from "@tiptap/core";
import callHub from "../../../../../../services/api/call_hub";
import { storeBlob } from "@/lib/imageStore/imageStore";
// import { cleanNestedDivs } from "@/components/dashboard/utils/clean_content";
//
type UploadImageResult = { status: number; message?: string };

export const getUploadedImageAttributes = (src: string, alt: string) => ({
  src,
  alt,
  width: 200,
});
//

const uploadImage = async (
  e: ChangeEvent<HTMLInputElement>,
  editor: Editor,
  dbName: string,
): Promise<UploadImageResult> => {
  ///========================================================
  // Function to upload an image via TipTap editor
  ///========================================================
  //
  try {
    const file = e.target.files?.[0];
    const fileName = file?.name;
    //
    if (!file || !editor) {
      return { status: 400, message: "No file or editor reference provided" };
    }

    // Check if the file is a valid image
    const response = await callHub("clean-image", file);

    if (response.status === 200) {
      // Create a formatted date string (dd-mm-yy)
      const date = new Date();
      // const formattedDate = `${String(date.getDate()).padStart(2, "0")}-${String(
      //   date.getMonth() + 1,
      // ).padStart(2, "0")}-${date.getFullYear().toString().slice(-2)}`;
      const imageId = `image-${fileName}`;

      // Store raw Blob in IndexedDB — no base64 / no sessionStorage size hit
      await storeBlob(imageId, file);

      // Blob URL for immediate in-editor display (revived by hydrateImages on
      // draft reload)
      const objectUrl = URL.createObjectURL(file);

      // Record image metadata in localStorage — base64 intentionally empty;
      // create_formData reads the Blob from IDB at publish time.
      const draftKey = `draft-articleContent-${dbName}`;
      const articleContent = JSON.parse(localStorage.getItem(draftKey) || "[]");
      const filteredContent = articleContent.filter(
        (item: { imageId: string }) => item.imageId !== imageId,
      );

      console.log("file data at upload_image", file);

      filteredContent.push({
        type: file.type ?? "image",
        imageId: imageId,
        fileName: file.name,
        blobUrl: objectUrl,
        base64: "",
      });
      localStorage.setItem(draftKey, JSON.stringify(filteredContent));

      // Insert image into TipTap document via insertContent (supports custom
      // attributes from CustomImage extension, unlike setImage which only
      // accepts src/alt/title).
      editor
        .chain()
        .focus()
        .insertContent({
          type: "image",
          attrs: {
            ...getUploadedImageAttributes(objectUrl, imageId),
            "data-ref-id": imageId,
            label: fileName,
          },
        })
        .run();

      // Immediately persist the updated body to localStorage so the image
      // survives page navigation. The 10-minute autosave may not have fired
      // yet, which would otherwise leave the draft without image content.
      // try {
      //   const currentBody = editor.getHTML();
      //   if (currentBody) {
      //     const draftKey = `draft-articleContent-${dbName}`;
      //     const stored = localStorage.getItem(draftKey);
      //     const storedArticle: { type: string; content?: string }[] =
      //       JSON.parse(stored || "[]");
      //     const updated = storedArticle.filter((i) => i.type !== "body");
      //     updated.push({ type: "body", content: cleanNestedDivs(currentBody) });
      //     localStorage.setItem(draftKey, JSON.stringify(updated));
      //     const hasDataRefId = currentBody.includes("data-ref-id");
      //     console.debug(
      //       "[upload_image] saved to localStorage key:",
      //       draftKey,
      //       "| data-ref-id in body:",
      //       hasDataRefId,
      //     );
      //   }
      // } catch {
      // Non-critical — the 10-minute autosave will catch this later
      //}

      e.target.value = "";
      return { status: 200, message: "Image uploaded" };
    } else {
      return { status: response.status, message: response.message as string };
    }
  } catch (error) {
    return {
      status: 205,
      message: error instanceof Error ? error.message : String(error),
    };
  }
};

export default uploadImage;
