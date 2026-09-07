/**
 * @jest-environment node
 */
import { expect } from "@jest/globals";
import { GET } from "@/app/api/articles/route";

describe("GET /api/articles", () => {
  beforeEach(() => {
    process.env.URL_API_DECAV = "http://cms:8000/api/articles";
    process.env.PROXY_KEY = "test-proxy-key";
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ items: [] }),
      text: async () => JSON.stringify({ items: [] }),
    } as any);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("forwards the request to the CMS endpoint on the server and preserves the query string", async () => {
    const req = new Request("http://localhost:8000/api/articles?type=all");

    const res = await GET(req);
    const json = await res.json();

    expect(global.fetch).toHaveBeenCalledWith(
      "http://cms:8000/api/articles?type=all",
      expect.objectContaining({
        method: "GET",
        headers: expect.objectContaining({
          "X-Internal-Proxy-Key": "test-proxy-key",
        }),
      }),
    );
    expect(res.status).toBe(200);
    expect(json).toEqual({ items: [] });
  });
});
