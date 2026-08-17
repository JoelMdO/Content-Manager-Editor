/**
 * @jest-environment node
 */
import fetchArticlesFromDb from "../fetch_articles_titles_fromDb";

describe("fetchArticlesFromDb", () => {
  it("uses the same-origin articles API from the browser", async () => {
    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => [],
    });
    global.fetch = fetchMock;

    await fetchArticlesFromDb();

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/articles?type=all",
      expect.objectContaining({ method: "GET" }),
    );
  });
});
