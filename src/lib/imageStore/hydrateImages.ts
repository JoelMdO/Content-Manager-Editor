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

    try {
      const { state } = editor.view;

      // Gather image nodes that have a data-ref-id attribute
      const imageNodes: { attrs: Record<string, any>; pos: number }[] = [];
      state.doc.descendants((node, pos) => {
        if (node.type.name !== "image") return;
        const imageId = node.attrs["data-ref-id"] as string | null;
        if (imageId) imageNodes.push({ attrs: node.attrs, pos });
      });

      if (imageNodes.length === 0) continue;

      // Fetch blobs for each image in parallel
      const resolved = await Promise.all(
        imageNodes.map(async (item) => ({
          attrs: item.attrs,
          pos: item.pos,
          blob: await getBlob(item.attrs["data-ref-id"] as string),
        })),
      );

      const tr = editor.view.state.tr;
      let modified = false;

      for (const { attrs, pos, blob } of resolved) {
        const id = attrs["data-ref-id"] as string;
        if (!blob) continue;

        const oldSrc = attrs.src as string | undefined;
        if (oldSrc?.startsWith("blob:")) URL.revokeObjectURL(oldSrc);

        const newSrc = URL.createObjectURL(blob);
        tr.setNodeMarkup(pos, undefined, { ...attrs, src: newSrc });
        modified = true;
      }

      if (modified) {
        editor.view.dispatch(tr);
      }
    } catch (err) {
      console.error("[hydrateImages] unexpected error:", err);
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
  const images = Array.from(
    doc.querySelectorAll<HTMLImageElement>("img[data-ref-id]"),
  );

  if (images.length === 0) {
    return html;
  }

  // Fetch blobs for each image in parallel. Try direct lookup first, then
  // attempt a few common normalizations (non-breaking spaces → plain space,
  // trimming, collapsing multiple spaces) in case the `data-ref-id` was
  // altered by the translation roundtrip.
  const blobPromises = images.map(async (img) => {
    const rawId = img.getAttribute("data-ref-id");
    if (!rawId) {
      return { img, imageId: null as string | null, blob: null as Blob | null };
    }

    const tryIds = [rawId];

    const normalize = (s: string) =>
      s
        .replace(/\u00A0|\u202F/g, " ") // NBSP / narrow NBSP → space
        .replace(/\s+/g, " ")
        .trim();

    const normalized = normalize(rawId);
    if (normalized !== rawId) tryIds.push(normalized);

    // Some filenames / ids may have multiple dots or invisible chars — try a
    // trimmed/dot-normalized variant as a last resort.
    const dotNormalized = normalized.replace(/\.{2,}/g, ".").trim();
    if (dotNormalized !== normalized) tryIds.push(dotNormalized);

    for (const id of tryIds) {
      try {
        const blob = await getBlob(id);
        if (blob) return { img, imageId: id, blob };
      } catch (e) {
        console.warn("[hydrateImagesInHTML] lookup error for", id, e);
      }
    }

    console.debug(
      "[hydrateImagesInHTML] no blob found for any id variants:",
      tryIds,
    );
    return { img, imageId: rawId, blob: null as Blob | null };
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
