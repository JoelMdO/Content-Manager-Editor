import { ContentProcessor } from "../processor";

jest.mock("@/lib/imageStore/hydrateImages", () => ({
  hydrateImagesInHTML: jest.fn(async (s: string) => s + "--hydrated"),
}));

jest.mock("../../../utils/clean_content", () => ({
  cleanNestedDivs: (s: string) => s.replace(/<div>|<\/div>/g, ""),
}));

describe("ContentProcessor", () => {
  it("cleans HTML and hydrates images", async () => {
    const p = new ContentProcessor();
    const input = "<div>hello</div>";
    const out = await p.processHtml(input);
    expect(out).toBe("hello--hydrated");
  });

  it("returns cleaned HTML when hydration fails", async () => {
    const mock = require("@/lib/imageStore/hydrateImages");
    mock.hydrateImagesInHTML.mockImplementationOnce(async () => {
      throw new Error("fail");
    });
    const p = new ContentProcessor();
    const input = "<div>world</div>";
    const out = await p.processHtml(input);
    expect(out).toBe("world");
  });
});
