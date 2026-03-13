// =============================================================
// Unit tests for useTranslationStore
// =============================================================

import { useTranslationStore } from "../useTranslationStore";

describe("useTranslationStore", () => {
  beforeEach(() => {
    useTranslationStore.setState({
      translationReady: false,
      isTranslating: false,
    });
  });

  it("initialises with both flags false", () => {
    const { translationReady, isTranslating } = useTranslationStore.getState();
    expect(translationReady).toBe(false);
    expect(isTranslating).toBe(false);
  });

  it("setTranslating(true) shows the translation spinner", () => {
    useTranslationStore.getState().setTranslating(true);
    expect(useTranslationStore.getState().isTranslating).toBe(true);
  });

  it("setTranslating(false) hides the spinner", () => {
    useTranslationStore.setState({ isTranslating: true });
    useTranslationStore.getState().setTranslating(false);
    expect(useTranslationStore.getState().isTranslating).toBe(false);
  });

  it("setTranslationReady(true) signals translated draft is available", () => {
    useTranslationStore.getState().setTranslationReady(true);
    expect(useTranslationStore.getState().translationReady).toBe(true);
  });

  it("setTranslationReady reset after translation is consumed", () => {
    useTranslationStore.setState({ translationReady: true });
    useTranslationStore.getState().setTranslationReady(false);
    expect(useTranslationStore.getState().translationReady).toBe(false);
  });

  it("translating and ready are independent flags", () => {
    useTranslationStore.getState().setTranslating(true);
    useTranslationStore.getState().setTranslationReady(true);

    const s = useTranslationStore.getState();
    expect(s.isTranslating).toBe(true);
    expect(s.translationReady).toBe(true);

    useTranslationStore.getState().setTranslating(false);
    expect(useTranslationStore.getState().translationReady).toBe(true); // unchanged
  });
});
