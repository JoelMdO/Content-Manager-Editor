// =============================================================
// useEditorStore — owns TipTap editor instances, string caches,
// placeholder state, and markdown mode.
//
// TipTap editors are stored as plain mutable ref objects so that
// mutations to .current do NOT trigger re-renders in subscribers.
// Components that need reactive TipTap state (e.g. isActive checks)
// should subscribe to TipTap's own state via editor.isActive().
// =============================================================

// CHANGE LOG
// Changed by : Copilot
// Date       : 2026-03-11 (TipTap migration)
// Reason     : Migrate from raw contentEditable DOM refs to TipTap editor
//              instances. `editorRefs` (array of HTMLDivElements) is replaced
//              by `titleEditorRef` and `bodyEditorRef` (TipTap Editor objects).
//              `editorRefs` is kept as an empty stub so that legacy ButtonProps
//              consumers that still reference it don't break at runtime — those
//              consumers will be progressively updated.
// Impact     : dashboard_editor.tsx, useDraftStore, handler_clear,
//              upload_image, font_style_buttons, handle_font_change, and
//              insert_link all now use titleEditorRef / bodyEditorRef.

import { create } from "zustand";
import type { Editor } from "@tiptap/core";

// Minimal mutable ref shape — compatible with React.MutableRefObject<T>
type Ref<T> = { current: T };

interface EditorState {
  // TipTap editor instances — stored as mutable refs (no re-render on set)
  titleEditorRef: Ref<Editor | null>;
  bodyEditorRef: Ref<Editor | null>;

  // Legacy DOM ref stub — kept for ButtonProps backward compat; not populated.
  editorRefs: Ref<(HTMLDivElement | null)[]>;

  // String caches — updated by autosave & loadDraftIntoEditor
  savedTitleRef: Ref<string>;
  savedBodyRef: Ref<string | null>;
  fileInputRef: Ref<HTMLInputElement | null>;

  // Reactive state
  isPlaceHolderTitle: boolean;
  isPlaceHolderArticle: boolean;
  isMarkdownText: boolean;

  // Actions
  /** Called once from dashboard/page.tsx on mount to hand over the React refs. */
  initRefs: (refs: {
    savedTitleRef: Ref<string>;
    savedBodyRef: Ref<string | null>;
    fileInputRef: Ref<HTMLInputElement | null>;
  }) => void;
  setPlaceHolderTitle: (value: boolean) => void;
  setPlaceHolderArticle: (value: boolean) => void;
  setIsMarkdownText: (value: boolean) => void;
}

export const useEditorStore = create<EditorState>(() => ({
  // TipTap editor stubs — replaced imperatively by dashboard_editor.tsx on mount
  titleEditorRef: { current: null },
  bodyEditorRef: { current: null },

  // Legacy DOM ref stub (unused after TipTap migration)
  editorRefs: { current: [] },

  // String cache stubs — replaced by initRefs() before any component renders
  savedTitleRef: { current: "" },
  savedBodyRef: { current: null },
  fileInputRef: { current: null },

  isPlaceHolderTitle: true,
  isPlaceHolderArticle: true,
  isMarkdownText: false,

  initRefs: (refs) => useEditorStore.setState((s) => ({ ...s, ...refs })),
  setPlaceHolderTitle: (value) =>
    useEditorStore.setState({ isPlaceHolderTitle: value }),
  setPlaceHolderArticle: (value) =>
    useEditorStore.setState({ isPlaceHolderArticle: value }),
  setIsMarkdownText: (value) =>
    useEditorStore.setState({ isMarkdownText: value }),
}));
