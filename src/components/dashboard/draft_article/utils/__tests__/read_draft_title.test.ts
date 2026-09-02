import { readDraftTitle } from "../read_draft_title";

describe("readDraftTitle", () => {
  it("reads the title from an API article object", () => {
    expect(readDraftTitle(JSON.stringify({ title: "Loaded article" }))).toBe(
      "Loaded article",
    );
  });

  it("keeps reading titles from legacy storage item arrays", () => {
    expect(
      readDraftTitle(
        JSON.stringify([
          { type: "body", content: "Body" },
          { type: "title", content: "Saved draft" },
        ]),
      ),
    ).toBe("Saved draft");
  });
});
