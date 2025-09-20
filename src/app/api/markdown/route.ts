import { NextRequest, NextResponse } from "next/server";
import HTMLToMarkdownConverter, {
  HtmlToMarkdownOptions,
} from "@/services/api/html_to_markdown";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    //
    console.log("body at api/markdown", body);
    console.log('"type of body at api/markdown"', typeof body);

    //
    if (!body || typeof body !== "string") {
      return NextResponse.json(
        { error: "Invalid input: HTML is required" },
        { status: 400 }
      );
    }
    //
    console.log("body at api/markdown", body);
    //
    const options = {
      preserveWhitespace: false, // Clean up extra whitespace
      includeImageAlt: true, // Include alt text for images
      preserveImageDimensions: true, // Keep image dimensions as comments
      convertTables: true, // Convert HTML tables to markdown
      preserveLineBreaks: true, // Keep line breaks as they are
    } as HtmlToMarkdownOptions;

    const converter = new HTMLToMarkdownConverter();
    const markdown = converter.convert({ html: body, options });
    console.log("markdown at api/markdown", markdown);

    return NextResponse.json({
      status: 200,
      message: "Markdown converted successfully",
      body: markdown,
    });
  } catch (error) {
    console.error("Error converting HTML to Markdown:", error);
    return NextResponse.json({
      status: 500,
      messge: "Failed to convert HTML to Markdown",
    });
  }
}
