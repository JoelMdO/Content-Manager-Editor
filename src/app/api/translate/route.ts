import readLog from "@/services/authentication/read_log";
import allowedOriginsCheck from "@/utils/allowed_origins_check";
import { NextRequest, NextResponse } from "next/server";
import { JWT } from "next-auth/jwt";
import { fetchLlm } from "@/lib/api/llm_fetch";

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

  const authHeader = request.headers.get("authorization");

  const tokenReceived: string | JWT | undefined = authHeader?.split(" ")[1];
  console.log("tokenReceived at api/translate", tokenReceived);
  // const auth = readLog(tokenReceived ?? "");
  console.log("api/translate authentication", {
    hasAuthorization: Boolean(tokenReceived),
    // valid: auth,
  });

  // Upload images and update URLs
  if (tokenReceived) {
    console.log("AUTH OK AT API/TRANSLATE");
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
    const body = article.article;
    const section = article.section;

    const newUrl = process.env.TRANSLATE_URL;
    //
    // process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0"; //TODO delete this line in production

    try {
      const response = await fetchLlm(`${newUrl}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${tokenReceived}`,
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
          status: 500,
          error: `API returned ${response.status}: ${errorText}`,
        });
      }
      //console.log("response", response);

      const data = await response.json();
      //console.log("data translated:", data);
      //

      return NextResponse.json({
        status: 200,
        message: "Data translated successfully",
        body: data,
      });
    } catch {
      // console.error("Error:", error);
      return NextResponse.json({
        status: 500,
        error: "Failed to translate article",
      });
    }
  }
}
