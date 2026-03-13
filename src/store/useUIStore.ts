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
//              MenuContext. dashboard/page.tsx hands over dialog refs via
//              initDialogRefs() on mount.

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

  // Dialog refs — set once from dashboard/page.tsx on mount
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

export const useUIStore = create<UIState>((set) => ({
  isMediumScreen: false,
  selectedSection: "Select category",
  openDialogNoSection: false,
  isSummary: false,
  summaryContent: "",
  isView: false,
  previewReady: false,
  isLoadingPreview: false,
  lastAutoSave: null,

  // Stub refs — replaced by initDialogRefs() before any dialog is shown
  dialogRef: { current: null },
  sectionsDialogRef: { current: null },
  summaryDialogRef: { current: null },
  stylesDialogRef: { current: null },

  initDialogRefs: (refs) => set(refs),
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
