import callHub from "../call_hub";

describe("callHub", () => {
  it("returns a useful message when the proxy rejects an oversized image", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      status: 413,
      json: async () => {
        throw new Error("Unexpected token <");
      },
    });

    const response = await callHub("clean-image", new Blob(["image"]));

    expect(response).toEqual({
      status: 413,
      message:
        "Image upload was rejected because it exceeds the server's upload limit. Please try a smaller image or contact the administrator.",
    });
  });
});
