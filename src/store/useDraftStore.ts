// =============================================================
// useDraftStore — owns draft identity (DRAFT_KEY, dbName),
// language, title preview text, the loaded preview article,
// and the critical loadDraftIntoEditor imperative action.
//
// KEY DESIGN: loadDraftIntoEditor calls TipTap commands.setContent()
// on the title and body editor instances retrieved from useEditorStore.
// It is called ONCE from the user's click action — never from
// a useEffect dependency array — eliminating the re-render
// cascade that caused paragraph collapse in previous attempts.
// =============================================================

// CHANGE LOG
// Changed by : Copilot
// Date       : 2026-03-11
// Reason     : Replace MenuContext draft state + eliminate the reactive
//              useEffect([isDraftArticleButtonClicked,...]) pattern that
//              caused editor innerHTML overwrite on unrelated re-renders.
// Impact     : DraftArticle component and handle_click.ts must call
//              useDraftStore.getState().loadDraftIntoEditor() instead of
//              setDraftArticleButtonClicked(). dashboard/page.tsx no longer
//              needs isDraftArticleButtonClicked / setDraftArticleButtonClicked.

import { create } from "zustand";
import type {
  ProcessedArticle,
  CDNImage,
} from "@/components/dashboard/preview/types/previewed_article";
//import { cleanNestedDivs } from "@/components/dashboard/utils/clean_content";
import { useEditorStore } from "./useEditorStore";
import { hydrateImagesInHTML } from "@/lib/imageStore/hydrateImages";
import DOMPurify from "dompurify";

// ORIGINAL — replaced by: added `syncFromSession` action
// interface DraftState {
//   DRAFT_KEY: string;
//   dbName: string;
//   dbIsReady: boolean;
//   language: "en" | "es";
//   /** Title text displayed in the sidebar DraftArticle component */
//   text: string;
//   /** Non-null when a preview article has been loaded for display */
//   article: ProcessedArticle | null;
//
//   // Actions
//   setDraftKey: (key: string) => void;
//   setDbName: (name: string) => void;
//   setDbIsReady: (ready: boolean) => void;
//   setLanguage: (lang: "en" | "es") => void;
//   setText: (text: string) => void;
//   setArticle: (article: ProcessedArticle | null) => void;
//
//   /**
//    * IMPERATIVE — sets editor DOM content directly without going through
//    * React state or useEffect. Call this from user-triggered actions only
//    * (e.g. clicking the draft button). Never put this inside a useEffect.
//    *
//    * @param title  HTML string for the title editor div
//    * @param body   HTML string for the body editor div (already hydrated)
//    */
//   loadDraftIntoEditor: (title: string, body: string) => void;
// }

// UPDATED — added syncFromSession to allow syncing Zustand from sessionStorage
interface DraftState {
  DRAFT_KEY: string;
  dbName: string;
  dbIsReady: boolean;
  language: "en" | "es";
  /** Title text displayed in the sidebar DraftArticle component */
  text: string;
  /** Non-null when a preview article has been loaded for display */
  article: ProcessedArticle | null;

  // Actions
  setDraftKey: (key: string) => void;
  setDbName: (name: string) => void;
  setDbIsReady: (ready: boolean) => void;
  setLanguage: (lang: "en" | "es") => void;
  setText: (text: string) => void;
  setArticle: (article: ProcessedArticle | null) => void;

  /**
   * IMPERATIVE — sets editor DOM content directly without going through
   * React state or useEffect. Call this from user-triggered actions only
   * (e.g. clicking the draft button). Never put this inside a useEffect.
   *
   * @param title  HTML string for the title editor div
   * @param body   HTML string for the body editor div (already hydrated)
   */
  loadDraftIntoEditor: (title: string, body: string) => void;

  /**
   * Read `articleContent-${dbName}` from sessionStorage and update the
   * Zustand draft state (`language`, `text`, `article`) accordingly.
   * This is intended to be called after code that writes translations to
   * sessionStorage (for example, after `translateToSpanish`).
   */
  // REMOVED
  //syncFromSession: (dbName: string) => Promise<ProcessedArticle | null>;
}

export const useDraftStore = create<DraftState>((set) => ({
  DRAFT_KEY: "draft-articleContent-DeCav",
  dbName: "DeCav",
  dbIsReady: false,
  language: "en",
  text: "Without Draft Articles",
  article: null,

  setDraftKey: (key) => set({ DRAFT_KEY: key }),
  setDbName: (name) => set({ dbName: name }),
  setDbIsReady: (ready) => set({ dbIsReady: ready }),
  setLanguage: (lang) => set({ language: lang }),
  setText: (text) => {
    const newText = DOMPurify.sanitize(text, { ALLOWED_TAGS: ["#text"] });
    set({ text: newText });
  },
  setArticle: (article) => set({ article }),

  // ORIGINAL — replaced by UPDATED version below
  // syncFromSession: (dbName) => {
  //   try {
  //     const key = `articleContent-${dbName}`;
  //     const raw = sessionStorage.getItem(key) || "[]";
  //     const items: { type: string; content?: string }[] = JSON.parse(raw);
  //
  //     // Prefer translated items if present (es-title / es-body)
  //     const esTitle = items.find((i) => i.type === "es-title");
  //     const titleItem = items.find((i) => i.type === "title");
  //     const esBody = items.find((i) => i.type === "es-body");
  //     const bodyItem = items.find((i) => i.type === "body");
  //
  //     let lang: "en" | "es" = "en";
  //     let titleText = "";
  //
  //     if (esTitle && esTitle.content) {
  //       lang = "es";
  //       titleText = esTitle.content;
  //     } else if (titleItem && titleItem.content) {
  //       titleText = titleItem.content;
  //     }
  //
  //     // Sanitize title to plain text for the sidebar preview
  //     const sanitized = DOMPurify.sanitize(titleText, { ALLOWED_TAGS: ["#text"] });
  //
  //     // Update simple state values; we do not attempt to reconstruct a
  //     // full ProcessedArticle here — consumers can load the session data
  //     // directly if they need richer info.
  //     set({ language: lang, text: sanitized, article: null });
  //   } catch (e) {
  //     console.warn("[useDraftStore.syncFromSession] failed to parse session data:", e);
  //   }
  // },

  // UPDATED — sync sessionStorage into Zustand and also update the
  // editor saved refs and TipTap editors so translated content appears
  // immediately in the editor UI.

  // UPDATED REMOVED.
  // syncFromSession: async (dbName) => {
  //   try {
  //     console.log("[syncFromSession] called for db:", dbName);
  //     const key = `articleContent-${dbName}`;
  //     const raw = sessionStorage.getItem(key) || "[]";
  //     const items: { type: string; content?: string }[] = JSON.parse(raw);

  //     // Pick translated content when available, fall back to original
  //     const esTitle = items.find((i) => i.type === "es-title");
  //     const titleItem = items.find((i) => i.type === "title");
  //     const esBody = items.find((i) => i.type === "es-body");
  //     const bodyItem = items.find((i) => i.type === "body");

  //     let lang: "en" | "es" = "en";
  //     const titleHtml =
  //       esTitle && esTitle.content ? esTitle.content : titleItem?.content || "";
  //     const bodyHtml =
  //       esBody && esBody.content ? esBody.content : bodyItem?.content || "";

  //     if (esTitle) lang = "es";

  //     // Sanitize title to plain text for the sidebar preview
  //     const sanitized = DOMPurify.sanitize(titleHtml, {
  //       ALLOWED_TAGS: ["#text"],
  //     });

  //     // Update saved refs used by autosave/session write so future saves
  //     // include the translated content.
  //     const { titleEditorRef, bodyEditorRef, savedTitleRef, savedBodyRef } =
  //       useEditorStore.getState();

  //     savedTitleRef.current = titleHtml;
  //     // set a preliminary raw body; final hydrated body will be set below
  //     savedBodyRef.current = bodyHtml;

  //     // Immediately update preview text and language so UI reacts quickly.
  //     set({ language: lang, text: sanitized });

  //     try {
  //       // Reuse image replacement logic from preview utils
  //       // eslint-disable-next-line @typescript-eslint/no-var-requires
  //       const replaceImgWithSrc =
  //         require("@/components/dashboard/menu/button_menu/utils/images_edit/replace_img_with_src").default;

  //       const images = items.filter(
  //         (item) => item.type && item.type.startsWith("image"),
  //       );

  //       console.log(
  //         "[syncFromSession] image items from session:",
  //         images.map((i) => ({
  //           type: i.type,
  //           imageId: (i as any).imageId || (i as any).fileId || null,
  //         })),
  //       );

  //       const updatedTagArticleBody = replaceImgWithSrc(
  //         bodyHtml as string,
  //         images,
  //         "html",
  //       );
  //       console.log(
  //         "[syncFromSession] after replaceImgWithSrc — contains <img>?:",
  //         /<img/i.test(updatedTagArticleBody),
  //       );

  //       // Replace <img data-ref-id> placeholders with blob: URLs from IDB
  //       let hydratedBody = updatedTagArticleBody;
  //       try {
  //         hydratedBody = await hydrateImagesInHTML(updatedTagArticleBody);
  //         console.log(
  //           "[syncFromSession] hydrateImagesInHTML result — contains <img>?:",
  //           /<img/i.test(hydratedBody),
  //         );
  //         // show first img tag snippet for inspection
  //         const firstImgMatch = hydratedBody.match(/<img[^>]*>/i);
  //         if (firstImgMatch)
  //           console.log(
  //             "[syncFromSession] first <img> tag after hydration:",
  //             firstImgMatch[0],
  //           );
  //       } catch (e) {
  //         console.warn(
  //           "[useDraftStore.syncFromSession] hydrateImagesInHTML failed:",
  //           e,
  //         );
  //       }

  //       // Update refs and editor content with the hydrated HTML (body already hydrated)
  //       savedBodyRef.current = hydratedBody;
  //       try {
  //         titleEditorRef.current?.commands.setContent(titleHtml, {
  //           emitUpdate: false,
  //         });
  //         bodyEditorRef.current?.commands.setContent(hydratedBody, {
  //           emitUpdate: false,
  //         });
  //         console.log("[syncFromSession] setContent called on editors");
  //       } catch (e) {
  //         console.warn(
  //           "[useDraftStore.syncFromSession] failed to set editor content:",
  //           e,
  //         );
  //       }

  //       const mappedImages: CDNImage[] = images.map(
  //         (img: any, idx: number) => ({
  //           originalSrc: img.url || img.blobUrl || img.base64 || "",
  //           optimizedSrc: img.url || img.blobUrl || img.base64 || "",
  //           alt: (img.imageId || img.fileId || img.id || "") as string,
  //           caption: (img.imageId || img.fileId || "") as string,
  //           type: "html",
  //           position: idx,
  //         }),
  //       );

  //       const processed: ProcessedArticle = {
  //         title: titleHtml || "Untitled",
  //         content: hydratedBody,
  //         rawContent: bodyHtml,
  //         images: mappedImages,
  //       };

  //       // Finally update the article in the store so previews get the rich object
  //       set({ article: processed });
  //       return processed;
  //     } catch (e) {
  //       console.warn(
  //         "[useDraftStore.syncFromSession] failed to build ProcessedArticle:",
  //         e,
  //       );
  //       return null;
  //     }
  //   } catch (e) {
  //     console.warn(
  //       "[useDraftStore.syncFromSession] failed to parse session data:",
  //       e,
  //     );
  //     return null;
  //   }
  // },
  // CHANGE LOG
  // Changed by : Copilot
  // Date       : 2026-03-13
  // Reason     : Extend `syncFromSession` to update `savedTitleRef`/`savedBodyRef`
  //              and set TipTap editor content so translations appear
  //              immediately in the editor UI.
  // Impact     : Calls `commands.setContent` on editor instances; consumers
  //              depending on `article` should reconstruct `ProcessedArticle` if needed.

  loadDraftIntoEditor: (title, body) => {
    const { titleEditorRef, bodyEditorRef, savedTitleRef, savedBodyRef } =
      useEditorStore.getState();

    //const cleanBody = cleanNestedDivs(body);
    //console.log("cleanBody after cleanNestedDivs:", cleanBody);

    // Update the persistent refs so autosave and session-writes stay current
    savedTitleRef.current = title;
    //savedBodyRef.current = cleanBody;
    //UPDATE
    savedBodyRef.current = body;

    // ORIGINAL — immediate call (could run before setContent applied):
    //hydrateImages([titleEditorRef.current, bodyEditorRef.current]);

    // Use TipTap commands to set content — no direct DOM mutation
    titleEditorRef.current?.commands.setContent(title, { emitUpdate: false });
    bodyEditorRef.current?.commands.setContent(body, {
      emitUpdate: false,
    });

    // Phase 5: replace stale blob: URLs with fresh ones from IndexedDB.
    // Pass editor instances so hydrateImages can update the ProseMirror
    // document state (not just the DOM) via setNodeMarkup transactions.
    // NOTE: TipTap's `setContent` may not have applied the transaction to
    // the editor state synchronously in all environments. Defer
    // `hydrateImages` to the next animation frame so the newly-set content
    // is visible to the document traversal.
    // UPDATED — defer to next frame to ensure editor state contains the
    // newly-inserted nodes before hydrating their `src` attributes.
    // requestAnimationFrame(() => {
    //   hydrateImages([titleEditorRef.current, bodyEditorRef.current]).then(
    //     () => {
    //       try {
    //         // After hydration, replace the small transparent placeholder
    //         // data-URL in the editor HTML before persisting so drafts do not
    //         // store large or opaque placeholder strings.
    //         // Use the same transparent pixel constant as in handle_click.
    //         const TRANSPARENT_PIXEL =
    //           "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
    //         // eslint-disable-next-line @typescript-eslint/no-explicit-any
    //         const html = (bodyEditorRef.current as any)?.getHTML?.();
    //         if (html) {
    //           const cleaned = html.replace(
    //             new RegExp(TRANSPARENT_PIXEL, "g"),
    //             "",
    //           );
    //           const DRAFT_KEY = useDraftStore.getState().DRAFT_KEY;
    //           const dbName = useDraftStore.getState().dbName;
    //           // Save cleaned body to localStorage draft key so drafts do not
    //           // persist the placeholder data-URL.
    //           try {
    //             const stored = localStorage.getItem(DRAFT_KEY);
    //             const storedArticle: { type: string; content?: string }[] =
    //               JSON.parse(stored || "[]");
    //             const updated = storedArticle.filter((i) => i.type !== "body");
    //             updated.push({
    //               type: "body",
    //               content: cleanNestedDivs(cleaned),
    //             });
    //             localStorage.setItem(DRAFT_KEY, JSON.stringify(updated));
    //             // Also update sessionStorage articleContent so editors relying on
    //             // session data get the cleaned version.
    //             const sessionKey = `articleContent-${dbName}`;
    //             sessionStorage.setItem(sessionKey, JSON.stringify(updated));
    //           } catch (e) {
    //             // Non-fatal
    //             console.warn(
    //               "[loadDraftIntoEditor] failed to persist cleaned draft:",
    //               e,
    //             );
    //           }
    //         }
    //       } catch (e) {
    //         console.warn(
    //           "[loadDraftIntoEditor] post-hydration cleanup failed:",
    //           e,
    //         );
    //       }
    //     },
    //   );
    // });
  },
}));
