import summaryButtonClicked from "../summary_button_clicked";

describe("summaryButtonClicked", () => {
  it("logs the storage parsing error when the draft is invalid JSON", async () => {
    sessionStorage.setItem("db", "DeCav");
    localStorage.setItem("draft-articleContent-DeCav", "invalid-json");
    const consoleError = jest
      .spyOn(console, "error")
      .mockImplementation(() => undefined);

    const result = await summaryButtonClicked({});

    expect(result.status).toBe(500);
    expect(consoleError).toHaveBeenCalledWith(
      "Error in summaryButtonClicked:",
      expect.any(SyntaxError),
    );

    consoleError.mockRestore();
  });
});