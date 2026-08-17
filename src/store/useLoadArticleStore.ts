import { create } from "zustand";

interface LoadArticleState {
  loadArticleReady: boolean;
  isLoading: boolean;

  setLoadArticleReady: (v: boolean) => void;
  setLoading: (v: boolean) => void;
}

export const useLoadArticleStore = create<LoadArticleState>((set) => ({
  loadArticleReady: false,
  isLoading: false,

  setLoadArticleReady: (v) => set({ loadArticleReady: v }),
  setLoading: (v) => set({ isLoading: v }),
}));
