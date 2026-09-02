import { create } from "zustand";

interface LoadArticleState {
  loadArticleReady: boolean;
  isLoading: boolean;
  dbIsReady: boolean;

  setLoadArticleReady: (v: boolean) => void;
  setDbIsReady: (v: boolean) => void;
  setLoading: (v: boolean) => void;
}

export const useLoadArticleStore = create<LoadArticleState>((set) => ({
  loadArticleReady: false,
  isLoading: false,
  dbIsReady: false,

  setLoadArticleReady: (v) => set({ loadArticleReady: v }),
  setDbIsReady: (v) => set({ dbIsReady: v }),
  setLoading: (v) => set({ isLoading: v }),
}));
