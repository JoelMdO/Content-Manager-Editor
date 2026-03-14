// =============================================================
// Unit tests for useDraftStore
// Key concern: loadDraftIntoEditor must write imperatively to
// the DOM without triggering a Zustand re-render.
// =============================================================

import { useDraftStore } from "../useDraftStore";
import { useEditorStore } from "../useEditorStore";

/** Helper: mount mock editor DOM nodes into the editor store */
function mountMockEditor() {
  const titleDiv = document.createElement("div");
  const bodyDiv = document.createElement("div");
  const savedTitleRef = { current: "" };
  const savedBodyRef = { current: null as string | null };

  // Create lightweight TipTap-like editor stubs with a commands.setContent API
  const titleEditorStub = {
    commands: {
      setContent: (html: string) => {
        titleDiv.innerHTML = html;
      },
    },
  } as any;

  const bodyEditorStub = {
    commands: {
      setContent: (html: string) => {
        bodyDiv.innerHTML = html;
      },
    },
    getHTML: () => bodyDiv.innerHTML,
  } as any;

  useEditorStore.setState({
    titleEditorRef: { current: titleEditorStub },
    bodyEditorRef: { current: bodyEditorStub },
    editorRefs: { current: [titleDiv, bodyDiv] },
    savedTitleRef,
    savedBodyRef,
    fileInputRef: { current: null },
  });

  return { titleDiv, bodyDiv, savedTitleRef, savedBodyRef };
}

describe("useDraftStore", () => {
  beforeEach(() => {
    useDraftStore.setState({
      DRAFT_KEY: "draft-articleContent-DeCav",
      dbName: "DeCav",
      dbIsReady: false,
      language: "en",
      text: "Without Draft Articles",
      article: null,
    });
    // Reset editor store stubs
    useEditorStore.setState({
      editorRefs: { current: [] },
      savedTitleRef: { current: "" },
      savedBodyRef: { current: null },
      fileInputRef: { current: null },
    });
  });

  // -----------------------------------------------------------
  // Scalar state setters
  // -----------------------------------------------------------
  it("setLanguage updates language to es", () => {
    useDraftStore.getState().setLanguage("es");
    expect(useDraftStore.getState().language).toBe("es");
  });

  it("setDraftKey updates DRAFT_KEY", () => {
    useDraftStore.getState().setDraftKey("draft-articleContent-Joe");
    expect(useDraftStore.getState().DRAFT_KEY).toBe("draft-articleContent-Joe");
  });

  it("setDbName updates dbName", () => {
    useDraftStore.getState().setDbName("Joe");
    expect(useDraftStore.getState().dbName).toBe("Joe");
  });

  it("setText updates the sidebar title preview", () => {
    useDraftStore.getState().setText("My new article");
    expect(useDraftStore.getState().text).toBe("My new article");
  });

  it("setArticle stores and clears a preview article", () => {
    const mock = { title: "t", content: "<p>c</p>" } as never;
    useDraftStore.getState().setArticle(mock);
    expect(useDraftStore.getState().article).toBe(mock);

    useDraftStore.getState().setArticle(null);
    expect(useDraftStore.getState().article).toBeNull();
  });

  // -----------------------------------------------------------
  // loadDraftIntoEditor — the critical imperative action
  // -----------------------------------------------------------
  describe("loadDraftIntoEditor", () => {
    it("writes title HTML to editorRefs[0].innerHTML", () => {
      const { titleDiv } = mountMockEditor();

      useDraftStore
        .getState()
        .loadDraftIntoEditor("<strong>Hello</strong>", "<p>Body</p>");

      expect(titleDiv.innerHTML).toBe("<strong>Hello</strong>");
    });

    it("writes body HTML to editorRefs[1].innerHTML", () => {
      const { bodyDiv } = mountMockEditor();

      useDraftStore
        .getState()
        .loadDraftIntoEditor(
          "Title",
          "<p>Paragraph one</p><p>Paragraph two</p><p>Paragraph three</p>",
        );

      // All three paragraphs must survive — no collapsing into one line
      expect(bodyDiv.querySelectorAll("p")).toHaveLength(3);
    });

    it("updates savedTitleRef and savedBodyRef", () => {
      const { savedTitleRef, savedBodyRef } = mountMockEditor();

      useDraftStore
        .getState()
        .loadDraftIntoEditor("Saved Title", "<p>Saved body</p>");

      expect(savedTitleRef.current).toBe("Saved Title");
      // The current implementation stores the body HTML as-provided
      // (no longer running `cleanNestedDivs` here), so assert that.
      expect(savedBodyRef.current).toBe("<p>Saved body</p>");
    });

    it("does NOT call set() — no Zustand subscriber is triggered", () => {
      const subscriber = jest.fn();
      const unsub = useDraftStore.subscribe(subscriber);

      mountMockEditor();
      useDraftStore.getState().loadDraftIntoEditor("Title", "<p>Body</p>");

      // This is the core regression guard: loading a draft must NEVER
      // cause a re-render of components subscribed to useDraftStore.
      expect(subscriber).not.toHaveBeenCalled();

      unsub();
    });

    it("handles null editor refs gracefully (no throw)", () => {
      // Simulate refs not yet mounted
      useEditorStore.setState({
        editorRefs: { current: [null, null] },
        savedTitleRef: { current: "" },
        savedBodyRef: { current: null },
        fileInputRef: { current: null },
      });

      expect(() =>
        useDraftStore.getState().loadDraftIntoEditor("Title", "<p>Body</p>"),
      ).not.toThrow();
    });
  });
});
