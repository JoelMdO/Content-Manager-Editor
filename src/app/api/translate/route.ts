import readLog from "@/services/authentication/read_log";
import allowedOriginsCheck from "@/utils/allowed_origins_check";
import { NextRequest, NextResponse } from "next/server";
import { JWT } from "next-auth/jwt";

export async function POST(request: NextRequest) {
  //
  /// Variables.
  const imageUrls: { url: string }[] = [];
  const formData = await request.formData();
  const dbName = formData.get("dbName") as string;

  interface Article {
    id: string;
    title: string;
    article: string;
    images?: { url: string }[];
    section?: string;
  }
  //
  // {Validate request origin
  const response = allowedOriginsCheck(request);

  if (response!.status == 403) {
    return NextResponse.json({
      status: 403,
      message: "Origin not allowed",
    });
  }
  //

  // Check if the user is authenticated
  const tokenReceived = formData.get("token") as string;
  const auth = readLog(tokenReceived ?? "");

  // Upload images and update URLs
  if (auth) {
    ///================================================================
    /// SAVE IMAGE :
    ///================================================================
    const article: Article = {
      id: "",
      title: "",
      article: "",
      images: [],
    };

    ///================================================================
    /// SAVE　THE FULL ARTICLE to database:
    ///================================================================
    // Parse individual fields
    const titleData = formData.get("title") as string;
    const titleObj = JSON.parse(titleData);
    const articleData = formData.get("body") as string;
    const bodyObj = JSON.parse(articleData);
    const sectionData = formData.get("section") as string;
    const sectionObj = JSON.parse(sectionData);
    //
    article.title = titleObj;
    article.article = bodyObj;
    article.images = imageUrls;
    article.section = sectionObj;
    //
    const title = article.title;
    let body = article.article;
    let section = article.section;

    ///--------------------------------------------------------
    // Get the Google access token from next-auth
    ///--------------------------------------------------------

    const authHeader = request.headers.get("authorization");

    const tokenG: JWT | string | undefined | null = authHeader?.split(" ")[1];

    if (!tokenG) {
      return NextResponse.json({ status: 401, error: "Unauthorized" });
    }
    const newUrl = process.env.SERVER_URL;
    //
    process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0"; //TODO delete this line in production

    try {
      const response = await fetch(`${newUrl}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${tokenG}`,
          "Content-Type": "application/json",
          "X-Request-Type": "translation",
          "X-Service": "cms-translate",
          "X-Source-DB": dbName,
        },
        body: JSON.stringify({
          title: `${title}`,
          body: `${body}`,
          section: `${section}`,
          target_language: `Spanish`,
        }),
      });
      // //

      if (!response.ok) {
        const errorText = await response.text();

        return NextResponse.json({
          status: 200,
          error: `API returned ${response.status}: ${errorText}`,
        });
      }

      const data = await response.json();
      //

      return NextResponse.json({
        status: 200,
        message: "Data translated successfully",
        body: data,
      });
    } catch (error) {
      console.error("Error:", error);
      return NextResponse.json({
        status: 500,
        error: "Failed to translate article",
      });
    }
  }
}
