import callHub from "./call_hub";

export async function convertHtmlToMarkdownAPI(html: string) {
  try {
    //console.log('"html to convertHtmlToMarkdownAPI":', html);

    const response = await callHub("markdown", html);

    if (!response.status || response.status !== 200) {
      throw new Error("Failed to convert HTML to Markdown");
    }

    if (response.status === 200) {
      const data = response.body;
      return {
        status: 200,
        message: "Markdown converted successfully",
        body: data,
      };
    }
  } catch (error) {
    // console.error("Error converting HTML to Markdown:", error);
    return {
      status: 500,
      message: "Failed to convert HTML to Markdown",
      error: error,
    };
  }
}
