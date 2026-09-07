import { loadTranslatedDraftIntoEditor } from "../load_translated_draft";
import { useDraftStore } from "@/store/useDraftStore";

describe("loadTranslatedDraftIntoEditor", () => {
  it("loads translated title and body from localStorage into the editors", () => {
    localStorage.setItem(
      "draft-articleContent-DeCav",
      JSON.stringify([
        { type: "es_title", content: "<p>Titulo traducido</p>" },
        { type: "es_body", content: "<p>Cuerpo traducido</p>" },
      ]),
    );

    const loadDraftIntoEditor = jest.spyOn(
      useDraftStore.getState(),
      "loadDraftIntoEditor",
    );

    loadTranslatedDraftIntoEditor("DeCav");

    expect(loadDraftIntoEditor).toHaveBeenCalledWith(
      "<p>Titulo traducido</p>",
      "<p>Cuerpo traducido</p>",
    );
  });
});
