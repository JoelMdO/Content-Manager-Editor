const globalWithWebApis = globalThis as typeof globalThis & {
  Request?: typeof Request;
  Response?: typeof Response;
  Headers?: typeof Headers;
  FormData?: typeof FormData;
};

jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn((body: unknown) => body),
  },
}));

globalWithWebApis.Request ??= class Request {} as typeof Request;
globalWithWebApis.Response ??= class Response {
  static json(body: unknown, init?: ResponseInit) {
    return { body, ...init };
  }
} as typeof Response;
globalWithWebApis.Headers ??= class Headers {} as typeof Headers;
globalWithWebApis.FormData ??= class FormData {
  append() {}
} as typeof FormData;

const apiRoutes = require("@/services/api/api_routes").default as typeof import("@/services/api/api_routes").default;

describe("apiRoutes save", () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  it("sends saves to the editor API instead of the translation API", async () => {
    const fetchMock = jest.fn().mockResolvedValue(
      {
        json: async () => ({
          status: 200,
          message: "Playbook Data Saved Successfully",
        }),
        status: 200,
      } as Response,
    );
    global.fetch = fetchMock;

    await apiRoutes({
      type: "save",
      token: "save-token",
      JWT: undefined,
      data: { title: "Title", body: "<p>Body</p>" },
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:8000/api/save",
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer save-token",
        }),
      }),
    );
  });
});
