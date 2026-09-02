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
  articleStored: boolean; // New state to track if an article is stored

  // Actions
  setDraftKey: (key: string) => void;
  setDbName: (name: string) => void;
  setDbIsReady: (ready: boolean) => void;
  setLanguage: (lang: "en" | "es") => void;
  setText: (text: string) => void;
  setArticle: (article: ProcessedArticle | null) => void;
  setArticleStored: (stored: boolean) => void; // New action to set articleStored

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
  articleStored: false,
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
  setArticleStored: (stored) => set({ articleStored: stored }),

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
    console.log("[loadDraftIntoEditor] saved refs updated:", {
      savedTitleRef: savedTitleRef.current,
      savedBodyRef: savedBodyRef.current,
    });
    // ORIGINAL — immediate call (could run before setContent applied):
    //hydrateImages([titleEditorRef.current, bodyEditorRef.current]);

    // Use TipTap commands to set content — no direct DOM mutation
    titleEditorRef.current?.commands.setContent(title, { emitUpdate: false });
    bodyEditorRef.current?.commands.setContent(body, {
      emitUpdate: false,
    });

    // Restore image blobs after the draft HTML has been placed in TipTap.
    // The hydrator preserves data-ref-id and replaces stale blob URLs with a
    // fresh URL created from the IndexedDB blob.
    void hydrateImagesInHTML(body).then((hydratedBody) => {
      savedBodyRef.current = hydratedBody;
      bodyEditorRef.current?.commands.setContent(hydratedBody, {
        emitUpdate: false,
      });
    });
  },
}));
