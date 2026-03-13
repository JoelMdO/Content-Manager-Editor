// =============================================================
// useUIStore — owns dialog open/close state, dialog refs,
// section selection, preview mode, screen size, auto-save time.
// =============================================================

// CHANGE LOG
// Changed by : Copilot
// Date       : 2026-03-11
// Reason     : Extract UI-only state from MenuContext into a focused store
//              so UI interactions don't cause editor or draft components
//              to re-render unnecessarily.
// Impact     : Components using isSummary, openDialogNoSection, previewReady,
//              selectedSection etc. must read from useUIStore instead of
//              MenuContext. Dialog refs are stable objects owned by the store;
//              initDialogRefs() mutates their .current values rather than
//              replacing the objects so that components already holding a
//              reference to the stub are never desynchronised.
// Changed by : Copilot
// Date       : 2026-03-13
// Reason     : initDialogRefs previously called set(refs), replacing the
//              stored ref objects entirely. Any component that rendered with
//              the stub as its ref prop would not reattach unless it
//              re-rendered with the new value, causing ref desynchronization.
//              Fix: keep the stable stub objects; only mutate .current.
// Impact     : initDialogRefs no longer causes store subscribers to re-render.

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
  stylesDialogRef: Ref<HTMLDialogElement | null>;

  // Actions
  initDialogRefs: (refs: {
    dialogRef: Ref<HTMLDialogElement | null>;
    sectionsDialogRef: Ref<HTMLDialogElement | null>;
    summaryDialogRef: Ref<HTMLDialogElement | null>;
    stylesDialogRef: Ref<HTMLDialogElement | null>;
  }) => void;
  setIsMediumScreen: (v: boolean) => void;
  setSelectedSection: (v: string) => void;
  setOpenDialogNoSection: (v: boolean) => void;
  setIsSummary: (v: boolean) => void;
  setSummaryContent: (v: string) => void;
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
  setLastAutoSave: (v) => set({ lastAutoSave: v }),
}));
