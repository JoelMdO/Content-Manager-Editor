// =============================================================
// useUIStore — owns dialog open/close state, dialog refs,
// section selection, preview mode, screen size, auto-save time.
// =============================================================

// CHANGE LOG
// Changed by : Joel Montes de Oca
// Date       : 2026-08-20
// Reason     : Added summarySelectorRef and isSummarySelector to the UI store.
// Impact     : Summary button will now open the summary selector dialog instead of the summary dialog.

import { create } from "zustand";

type Ref<T> = { current: T };

interface UIState {
  // Screen
  isMediumScreen: boolean;

  // Section selector
  selectedSection: string;

  // Dialogs — open state
  openDialogNoSection: boolean;
  isSummary: boolean;
  isSummarySelector: boolean;
  summaryContent: string;
  isView: boolean;
  previewReady: boolean;
  isLoadingPreview: boolean;

  // Auto-save timestamp shown in sidebar
  lastAutoSave: Date | null;

  // Dialog refs — stable objects; .current is set by React (via ref={storeRef}
  // in child components). Use initDialogRefs() only when external code needs to
  // populate .current directly (e.g. forwarding a ref from outside the tree).
  dialogRef: Ref<HTMLDialogElement | null>;
  sectionsDialogRef: Ref<HTMLDialogElement | null>;
  summaryDialogRef: Ref<HTMLDialogElement | null>;
  summarySelectorRef: Ref<HTMLDialogElement | null>;
  stylesDialogRef: Ref<HTMLDialogElement | null>;

  // Actions
  initDialogRefs: (refs: {
    dialogRef: Ref<HTMLDialogElement | null>;
    sectionsDialogRef: Ref<HTMLDialogElement | null>;
    summaryDialogRef: Ref<HTMLDialogElement | null>;
    summarySelectorRef: Ref<HTMLDialogElement | null>;
    stylesDialogRef: Ref<HTMLDialogElement | null>;
  }) => void;
  setIsMediumScreen: (v: boolean) => void;
  setSelectedSection: (v: string) => void;
  setOpenDialogNoSection: (v: boolean) => void;
  setIsSummary: (v: boolean) => void;
  setSummaryContent: (v: string) => void;
  setIsSummarySelector: (v: boolean) => void;
  setIsView: (v: boolean) => void;
  setPreviewReady: (v: boolean) => void;
  setIsLoadingPreview: (v: boolean) => void;
  setLastAutoSave: (v: Date | null) => void;
}

export const useUIStore = create<UIState>((set, get) => ({
  isMediumScreen: false,
  selectedSection: "Select category",
  openDialogNoSection: false,
  isSummary: false,
  isSummarySelector: false,
  summaryContent: "",
  isView: false,
  previewReady: false,
  isLoadingPreview: false,
  lastAutoSave: null,

  // Stable stub refs — never replaced, only .current is mutated by React
  // (via ref={storeRef} in child components) or via initDialogRefs().
  dialogRef: { current: null },
  sectionsDialogRef: { current: null },
  summaryDialogRef: { current: null },
  summarySelectorRef: { current: null },
  stylesDialogRef: { current: null },

  // Keep the stable ref objects; only update .current so that components
  // already holding a reference to the stub are never desynchronised.
  //
  // NOTE: This intentionally bypasses Zustand's set() / reactivity system.
  // Ref objects are mutable containers by design — their .current value
  // changing should NOT trigger re-renders (that is the entire contract of
  // React refs). Using set() here would replace the object identity, forcing
  // every subscriber to re-render with a new ref, which is exactly the
  // desynchronisation problem we are solving. Only pass non-null elements;
  // null values are ignored to preserve any .current already assigned by React.
  initDialogRefs: (refs) => {
    const state = get();
    if (refs.dialogRef.current !== null)
      state.dialogRef.current = refs.dialogRef.current;
    if (refs.sectionsDialogRef.current !== null)
      state.sectionsDialogRef.current = refs.sectionsDialogRef.current;
    if (refs.summaryDialogRef.current !== null)
      state.summaryDialogRef.current = refs.summaryDialogRef.current;
    if (refs.summarySelectorRef.current !== null)
      state.summarySelectorRef.current = refs.summarySelectorRef.current;
    if (refs.stylesDialogRef.current !== null)
      state.stylesDialogRef.current = refs.stylesDialogRef.current;
  },
  setIsMediumScreen: (v) => set({ isMediumScreen: v }),
  setSelectedSection: (v) => set({ selectedSection: v }),
  setOpenDialogNoSection: (v) => set({ openDialogNoSection: v }),
  setIsSummary: (v) => set({ isSummary: v }),
  setSummaryContent: (v) => set({ summaryContent: v }),
  setIsView: (v) => set({ isView: v }),
  setPreviewReady: (v) => set({ previewReady: v }),
  setIsLoadingPreview: (v) => set({ isLoadingPreview: v }),
  setIsSummarySelector: (v) => set({ isSummarySelector: v }),
  setLastAutoSave: (v) => set({ lastAutoSave: v }),
}));
