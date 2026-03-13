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
import type { ProcessedArticle } from "@/components/dashboard/preview/types/previewed_article";
//import { cleanNestedDivs } from "@/components/dashboard/utils/clean_content";
import { useEditorStore } from "./useEditorStore";
//import { hydrateImages } from "@/lib/imageStore/hydrateImages";
import DOMPurify from "dompurify";

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
