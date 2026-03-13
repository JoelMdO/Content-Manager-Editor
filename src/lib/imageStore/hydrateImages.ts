// CHANGE LOG
// Created by : Copilot
// Date       : 2026-03-11
// Reason     : Phase 5 — when a draft is loaded that contains images, their
//              <img> tags will have blob: URLs that are no longer valid
//              (blob: URLs are revoked when the page unloads). hydrateImages
//              scans the TipTap document for image nodes with data-ref-id and
//              replaces their src via a ProseMirror transaction so the fresh
//              blob: URL is stored in the document state (not just the DOM).
// Updated    : 2026-03-11 — accept Editor[] instead of HTMLDivElement[] so we
//              can write back through setNodeMarkup rather than raw DOM mutation.
//              Direct DOM mutation was overwritten by the next ProseMirror render.
//
//import type { Editor } from "@tiptap/core";
import { getBlob } from "./imageStore";

/**
 * Scan every TipTap editor for image nodes with data-ref-id and restore their
 * src from IndexedDB blobs via a ProseMirror transaction.
 * Images whose blob is not found in IDB are left unchanged (Cloudinary URLs, etc).
 */
/*
export async function hydrateImages(editors: (Editor | null)[]): Promise<void> {
  for (const editor of editors) {
    if (!editor) continue;

    const { state } = editor.view;

    // 1. Quick check: are there any images with data-ref-id to hydrate?
    const imageNodes: Record<string, unknown>[] = [];
    state.doc.descendants((node) => {
      if (node.type.name !== "image") return;
      const imageId = node.attrs["data-ref-id"] as string | null;
      if (imageId) imageNodes.push(node.attrs);
    });

    console.debug(
      "[hydrateImages] editor editable:",
      editor.isEditable,
      "| images with data-ref-id:",
      imageNodes.length,
      imageNodes.map((a) => a["data-ref-id"]),
    );

    if (imageNodes.length === 0) continue;

    // 2. Fetch all blobs in parallel
    const resolved = await Promise.all(
      imageNodes.map(async (attrs) => ({
        attrs,
        blob: await getBlob(attrs["data-ref-id"] as string),
      })),
    );

    // 3. Build imageId → blob map from resolved results
    const blobMap = new Map<string, Blob>();
    for (const { attrs, blob } of resolved) {
      const id = attrs["data-ref-id"] as string;
      console.debug(
        "[hydrateImages] IDB lookup for",
        id,
        "→",
        blob ? "FOUND" : "NOT FOUND",
      );
      if (blob && id) blobMap.set(id, blob);
    }
    if (blobMap.size === 0) continue;

    // 4. Use the CURRENT state (not the pre-await snapshot) so positions are
    //    guaranteed to be valid even if a plugin dispatched a transaction while
    //    the IDB reads were in flight.
    const currentState = editor.view.state;
    const tr = currentState.tr;
    let modified = false;

    currentState.doc.descendants((node, pos) => {
      if (node.type.name !== "image") return;
      const imageId = node.attrs["data-ref-id"] as string | null;
      if (!imageId) return;
      const blob = blobMap.get(imageId);
      if (!blob) return;

      // Revoke the stale blob: URL if present
      const oldSrc = node.attrs.src as string | undefined;
      if (oldSrc?.startsWith("blob:")) URL.revokeObjectURL(oldSrc);

      const newSrc = URL.createObjectURL(blob);
      tr.setNodeMarkup(pos, undefined, { ...node.attrs, src: newSrc });
      modified = true;
    });

    if (modified) {
      console.debug("[hydrateImages] dispatching setNodeMarkup transaction");
      editor.view.dispatch(tr);
    } else {
      console.debug(
        "[hydrateImages] no nodes matched in current state doc — no dispatch",
      );
    }
  }
}
*/

// UPDATED implementation: use `console.log` for visible output and log
// editor HTML before/after to help diagnose why <img> tags may be missing
// in the rendered editor. Keep original implementation commented above
// (per code-editing instructions) and add this updated function below.
// export async function hydrateImages(editors: (Editor | null)[]): Promise<void> {
//   for (const editor of editors) {
//     if (!editor) continue;

//     try {
//       console.log(
//         "[hydrateImages] editor instance:",
//         !!editor,
//         "isEditable:",
//         editor?.isEditable,
//       );
//       // Log current HTML (TipTap's getHTML may be undefined on some editors)
//       try {
//         // eslint-disable-next-line @typescript-eslint/no-explicit-any
//         const html = (editor as any).getHTML
//           ? (editor as any).getHTML()
//           : undefined;
//         console.log("[hydrateImages] editor.getHTML() before hydration:", html);
//       } catch (e) {
//         console.log(
//           "[hydrateImages] unable to read editor HTML before hydration",
//         );
//       }

//       const { state } = editor.view;

//       // Find image nodes with data-ref-id
//       const images: { attrs: Record<string, any>; pos: number }[] = [];
//       state.doc.descendants((node, pos) => {
//         if (node.type.name !== "image") return;
//         const imageId = node.attrs["data-ref-id"] as string | null;
//         if (imageId) images.push({ attrs: node.attrs, pos });
//       });

//       console.log(
//         "[hydrateImages] images found in doc:",
//         images.map((i) => i.attrs["data-ref-id"]),
//       );
//       if (images.length === 0) {
//         console.log("[hydrateImages] no image nodes to hydrate");
//         continue;
//       }

//       const resolved = await Promise.all(
//         images.map(async (item) => ({
//           attrs: item.attrs,
//           pos: item.pos,
//           blob: await getBlob(item.attrs["data-ref-id"] as string),
//         })),
//       );

//       const tr = editor.view.state.tr;
//       let modified = false;

//       for (const { attrs, pos, blob } of resolved) {
//         const id = attrs["data-ref-id"] as string;
//         console.log(
//           "[hydrateImages] IDB lookup for",
//           id,
//           "→",
//           blob ? "FOUND" : "NOT FOUND",
//         );
//         if (!blob) continue;

//         const oldSrc = attrs.src as string | undefined;
//         if (oldSrc?.startsWith("blob:")) URL.revokeObjectURL(oldSrc);

//         const newSrc = URL.createObjectURL(blob);
//         tr.setNodeMarkup(pos, undefined, { ...attrs, src: newSrc });
//         modified = true;
//       }

//       if (modified) {
//         editor.view.dispatch(tr);
//         console.log(
//           "[hydrateImages] dispatched transaction to set image src attributes",
//         );
//         try {
//           // eslint-disable-next-line @typescript-eslint/no-explicit-any
//           const htmlAfter = (editor as any).getHTML
//             ? (editor as any).getHTML()
//             : undefined;
//           console.log(
//             "[hydrateImages] editor.getHTML() after hydration:",
//             htmlAfter,
//           );
//         } catch (e) {
//           console.log(
//             "[hydrateImages] unable to read editor HTML after hydration",
//           );
//         }
//       } else {
//         console.log(
//           "[hydrateImages] no modifications made to the editor document",
//         );
//       }
//     } catch (err) {
//       console.error("[hydrateImages] unexpected error:", err);
//     }
//   }
// }

// NEW — hydrate images inside an HTML string that contains <img ... data-ref-id="..."> tags
export async function hydrateImagesInHTML(html: string): Promise<string> {
  if (!html) return html;

  // Prefer DOM-based parsing/mutation over string reconstruction to avoid
  // injection issues and to preserve existing attributes/styles.
  if (typeof DOMParser === "undefined") {
    console.warn(
      "[hydrateImagesInHTML] DOMParser is not available; returning HTML unchanged.",
    );
    return html;
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const images = Array.from(doc.querySelectorAll<HTMLImageElement>("img[data-ref-id]"));

  if (images.length === 0) {
    return html;
  }

  // Fetch blobs for each image in parallel.
  const blobPromises = images.map(async (img) => {
    const imageId = img.getAttribute("data-ref-id");
    if (!imageId) {
      return { img, imageId: null as string | null, blob: null as Blob | null };
    }

    try {
      const blob = await getBlob(imageId);
      return { img, imageId, blob: blob ?? null };
    } catch (e) {
      console.warn("[hydrateImagesInHTML] failed to get blob for", imageId, e);
      return { img, imageId, blob: null as Blob | null };
    }
  });

  const results = await Promise.all(blobPromises);

  for (const { img, imageId, blob } of results) {
    if (!imageId || !blob) {
      continue;
    }

    const objectUrl = URL.createObjectURL(blob);

    // Preserve existing alt text; if missing, fall back to imageId (as before).
    const existingAlt = img.getAttribute("alt") ?? imageId;

    img.setAttribute("src", objectUrl);
    img.setAttribute("alt", existingAlt);
    // Preserve previous behavior of forcing a width of 25%, but keep all
    // other attributes/styles intact.
    img.setAttribute("width", "25%");
  }

  return doc.body.innerHTML;
}
