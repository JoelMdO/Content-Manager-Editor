// =============================================================
// Unit tests for useEditorStore
// =============================================================

import { useEditorStore } from "../useEditorStore";

describe("useEditorStore", () => {
  beforeEach(() => {
    // Reset reactive state between tests
    useEditorStore.setState({
      isPlaceHolderTitle: true,
      isPlaceHolderArticle: true,
      isMarkdownText: false,
    });
  });

  it("initialises with both placeholders shown", () => {
    const { isPlaceHolderTitle, isPlaceHolderArticle } =
      useEditorStore.getState();
    expect(isPlaceHolderTitle).toBe(true);
    expect(isPlaceHolderArticle).toBe(true);
  });

  it("setPlaceHolderTitle(false) hides the title placeholder", () => {
    useEditorStore.getState().setPlaceHolderTitle(false);
    expect(useEditorStore.getState().isPlaceHolderTitle).toBe(false);
  });

  it("setPlaceHolderArticle(false) hides the body placeholder", () => {
    useEditorStore.getState().setPlaceHolderArticle(false);
    expect(useEditorStore.getState().isPlaceHolderArticle).toBe(false);
  });

  it("setIsMarkdownText toggles markdown mode on and off", () => {
    useEditorStore.getState().setIsMarkdownText(true);
    expect(useEditorStore.getState().isMarkdownText).toBe(true);

    useEditorStore.getState().setIsMarkdownText(false);
    expect(useEditorStore.getState().isMarkdownText).toBe(false);
  });

  it("initRefs replaces the default stub refs with real ref objects", () => {
    const mockTitleRef = { current: "saved title" };
    const mockBodyRef = { current: "<p>saved body</p>" };
    const mockFileRef = { current: null as HTMLInputElement | null };

    useEditorStore.getState().initRefs({
      savedTitleRef: mockTitleRef,
      savedBodyRef: mockBodyRef,
      fileInputRef: mockFileRef,
    });

    const state = useEditorStore.getState();
    // Verify the exact same object references were stored
    expect(state.savedTitleRef).toBe(mockTitleRef);
    expect(state.savedBodyRef).toBe(mockBodyRef);
  });

  it("ref mutations do NOT trigger store subscribers", () => {
    const subscriber = jest.fn();
    const unsub = useEditorStore.subscribe(subscriber);

    // Mutate .current directly — this must be invisible to Zustand
    useEditorStore.getState().editorRefs.current.push(null);

    expect(subscriber).not.toHaveBeenCalled();
    unsub();
  });
});
