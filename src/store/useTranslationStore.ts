// =============================================================
// useTranslationStore — owns translation and summary loading
// state. Isolated so that translation progress updates don't
// cause editor or UI components to re-render.
// =============================================================

// CHANGE LOG
// Changed by : Copilot
// Date       : 2026-03-11
// Reason     : Extract translation/summary state from MenuContext into its
//              own store so translation spinner state changes don't cascade
//              to unrelated components.
// Impact     : Components using isTranslating / translationReady must switch
//              to useTranslationStore. The translate and summary API route
//              handlers must call useTranslationStore.getState() setters.

import { create } from "zustand";

interface TranslationState {
  translationReady: boolean;
  isTranslating: boolean;

  setTranslationReady: (v: boolean) => void;
  setTranslating: (v: boolean) => void;
}

export const useTranslationStore = create<TranslationState>((set) => ({
  translationReady: false,
  isTranslating: false,

  setTranslationReady: (v) => set({ translationReady: v }),
  setTranslating: (v) => set({ isTranslating: v }),
}));
