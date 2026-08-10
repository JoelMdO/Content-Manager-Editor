import apiRoutes from "@/services/api/api_routes";

describe("apiRoutes save", () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  it("sends saves to the editor API instead of the translation API", async () => {
    const fetchMock = jest.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          status: 200,
          message: "Playbook Data Saved Successfully",
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      ),
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
