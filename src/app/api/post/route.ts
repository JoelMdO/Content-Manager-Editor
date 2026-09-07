import "server-only";
import { NextRequest, NextResponse } from "next/server";
import allowedOriginsCheck from "@/utils/allowed_origins_check";
import readLog from "../../../services/authentication/read_log";
import { sectionsCode } from "../../../constants/sections";
import { getTranslatedSection } from "@/utils/api/post/get_translated_section";
import generateNonce from "@/utils/nonce";
import { createSignature } from "@/utils/create_signatures";
import { Article } from "@/types/articleType";
import { insertCloudinaryUrlsatBody } from "@/utils/api/post/insert_cloudinaryUrlsAtBody";
//
export async function POST(req: NextRequest): Promise<Response> {
  ///---------------------------------------------------
  /// POST (Save) to database firebase.
  ///---------------------------------------------------
  ///
  /// Variables.
  const formData = await req.formData();
  console.log("formData at api/POST", formData);
  const response_1 = allowedOriginsCheck(req);

  if (response_1!.status == 403) {
    return NextResponse.json(
      { status: 403, message: "Origin not allowed" },
      { status: 403 },
    );
  }

  // Check if the user is authenticated
  const authHeader = req.headers.get("authorization");
  console.log("api/post authHeader:", authHeader);
  const tokenReceived: string | undefined = authHeader?.split(" ")[1];
  console.log("api/post tokenReceived:", tokenReceived);
  const auth = readLog(tokenReceived ?? "");

  console.log("api/post authentication", {
    hasAuthorization: Boolean(tokenReceived),
    valid: auth,
  });

  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (auth) {
    const dbName = formData.get("dbName") as string;
    console.log('doing POST at /api/post, dbName:"', dbName, '"');
    const article: Article = {} as Article;
    console.log("AUTH OK POST");
    ///================================================================
    /// UPDATE THE ARTICLE WITH CLOUDINARY URLS AND SAVE TO CMS:
    ///================================================================
    // Parse individual fields
    const titleData = formData.get("title") as string;
    const titleObj = JSON.parse(titleData);
    const esTitleData = formData.get("es_title") as string;
    const esTitleObj = JSON.parse(esTitleData);
    const bodyData = formData.get("body") as string;
    const bodyObj = JSON.parse(bodyData);
    const esBodyData = formData.get("es_body") as string;
    const esBodyObj = JSON.parse(esBodyData);
    const idData = formData.get("id") as string;
    const idObj = JSON.parse(idData);
    const dbNameData = formData.get("dbName") as string;
    const dbNameObj = JSON.parse(dbNameData);
    const sectionData = formData.get("section") as string;
    const sectionObj = JSON.parse(sectionData);
    const esSectionData = formData.get("es_section") as string;
    const esSectionObj = JSON.parse(esSectionData);
    const esSummaryData = formData.get("es_summary") as string;
    const esSummaryObj = JSON.parse(esSummaryData);
    const summaryData = formData.get("summary") as string;
    const summaryObj = JSON.parse(summaryData);
    const imagesData = formData.get("images") as string;
    const imagesObj = JSON.parse(imagesData);

    //
    article.id = idObj;
    article.title = titleObj;
    article.es_title = esTitleObj;
    article.body = bodyObj;
    article.section = sectionObj;
    article.es_section = esSectionObj;
    article.es_body = esBodyObj;
    article.summary = summaryObj;
    article.es_summary = esSummaryObj;
    article.images = imagesObj;
    console.log('"article at post before replace image:"', article);
    console.log("articles title and es_title", article.title, article.es_title);
    console.log("articles body and es_body", article.body, article.es_body);
    console.log(
      "articles section and esSection",
      article.section,
      article.es_section,
    );
    console.log(
      "articles summary and esSummary",
      article.summary,
      article.es_summary,
    );

    // SAVE in db.
    // const images = article.images;
    const section = article.section;
    // console.log('article images after cloudinary upload:"', images);
    console.log("body before replace image", article.body);

    //
    // log("article before replaceSrcWithImagePlaceholdersAtPost");
    //------------------------------------------
    // Purpose: Replace image src attributes in article bodies with placeholders and assign the updated strings back.
    //------------------------------------------
    const bodyResponse = await insertCloudinaryUrlsatBody(
      "en",
      article.body,
      dbNameObj,
    );
    article.body = bodyResponse.message;
    const esBodyResponse = await insertCloudinaryUrlsatBody(
      "es",
      article.es_body,
      dbNameObj,
    );
    article.es_body = esBodyResponse.message;
    console.log("body after replace image", bodyResponse.message);
    console.log("es_body after replace image", esBodyResponse.message);

    if (
      bodyResponse.message === "Image loading error" ||
      esBodyResponse.message === "Image loading error"
    ) {
      return NextResponse.json({
        status: 400,
        message: "Image loading error",
        data: "Image loading error",
      });
    }
    //
    ///--------------------------------------------------------
    // Find Category and Section Code
    ///--------------------------------------------------------

    const sectionCode = sectionsCode[dbNameObj].find(
      (item) => item.label === section,
    );

    ///--------------------------------------------------------
    // Find the correct section for spanish
    ///--------------------------------------------------------
    const esSection = getTranslatedSection({
      db: dbNameObj,
      langFrom: "en",
      langTo: "es",
      value: section,
    });

    ///--------------------------------------------------------
    // Select the correct database to save the article
    ///--------------------------------------------------------
    //
    // let db: Database;
    // const { database } = initializeFirebaseAdminDeCav();
    let author: string;
    let tags: string[] = [];
    let tags_es: string[] = [];
    let api_call_url: string;
    // //
    if (dbNameObj === "DeCav") {
      // db = database;
      author = process.env.AUTHOR_DECAV || "Default Author";
      tags = ["Aviation", "DecodingAviation", "DeCav"];
      tags_es = ["Aviación", "DecodingAviation", "DeCav"];
      api_call_url = process.env.URL_API_DECAV || "";
    } else {
      // db = adminDB as unknown as Database;
      author = process.env.AUTHOR || "Default Author";
      tags = ["Software Engineering", "Joel Montes de Oca Lopez", "AI"];
      tags_es = [
        "Desarrollo de Software",
        "Joel Montes de Oca Lopez",
        "Inteligencia Artificial",
      ];
      api_call_url = process.env.URL_API_JOE || "";
    }
    ///--------------------------------------------------------
    // Obtain id
    ///--------------------------------------------------------
    const id = article.id;

    // Validate required fields
    if (!id || !article.title || !article.es_title) {
      return NextResponse.json({
        status: 400,
        message: "Missing required fields: id, title, or es_title",
        data: { id, title: article.title, es_title: article.es_title },
      });
    }
    const newId = id
      .replace(/<p\b[^>]*>(.*?)<\/p>/gi, "$1")
      .replace(/<[^>]*>/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/\./g, "");
    // /--------------------------------------------------------
    // Create Metadata Object
    // /--------------------------------------------------------
    const metadata = {
      title: article.title,
      description: article.summary,
      author: author,
      date: new Date().toISOString(),
      tags: tags,
      category: sectionCode?.code,
      slug: newId,
      section: section,
      section_code: sectionCode?.code,
      published: true,
      version: "1.0",
    };
    const esMetadata = {
      title: article.es_title,
      description: article.es_summary,
      author: author,
      date: new Date().toISOString(),
      tags: tags_es,
      category: sectionCode?.code,
      slug: newId,
      section: esSection,
      section_code: sectionCode?.code,
      published: true,
      version: "1.0",
    };

    const articleDataForDb = {
      // en: article.markdownArticle,
      // es: article.markdownEsArticle,
      en_html: article.body || "",
      es_html: article.es_body || "",
      metadata: metadata,
      esMetadata: esMetadata,
    };
    //
    console.log("articleDataForDb to be saved:", articleDataForDb);

    // Validate that we have article content
    if (!article.body || !article.es_body) {
      return NextResponse.json({
        status: 400,
        message: "Missing article body content",
        data: {
          hasBody: !!article.body,
          hasEsBody: !!article.es_body,
        },
      });
    }

    ///--------------------------------------------------------
    // Call CMS to update with urls from Cloudinary and Metadata.
    ///--------------------------------------------------------
    console.log("Calling CMS to update with URLs from Cloudinary and Metadata");
    console.log("API call URL:", api_call_url);

    // const newUrl = api_call_url.replace(/\/$/, "");

    const response = await fetch(api_call_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Internal-Proxy-Key": process.env.PROXY_KEY || "",
      },
      body: JSON.stringify({
        article_id: article.id,
        title: article.title,
        es_title: article.es_title,
        status: "published",
        body: article.body,
        es_body: article.es_body,
        section: section || "",
        es_section: esSection || "",
        summary: article.summary || "",
        es_summary: article.es_summary || "",
        metadata: metadata,
        es_metadata: esMetadata,
      }),
    });
    console.log("response CMS at API/POSTs", response);
    //
    if (response.status !== 200) {
      const errorText = await response.text();
      return NextResponse.json({
        status: response.status,
        message: "Error saving data",
        error: errorText,
      });
    } else {
      ///--------------------------------------------------------
      // Call DecodingAviation api/articles to update Blog.
      ///--------------------------------------------------------

      const decodingAviationUrl = process.env.URL_API_DECAV || "";
      const timestamp = Math.floor(Date.now() / 1000).toString();
      const nonce = generateNonce();
      const signature = createSignature(timestamp, nonce, article.id);

      const decavResponse = await fetch(decodingAviationUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Editor-Key-Id": process.env.EDITOR_SECRET_KEY_ID || "",
          "X-Editor-Timestamp": timestamp,
          "X-Editor-Nonce": nonce,
          "X-Editor-Signature": signature,
        },
        body: JSON.stringify({
          note: "Article published",
        }),
      });

      if (decavResponse.status !== 200) {
        const errorText = await decavResponse.text();
        return NextResponse.json({
          status: decavResponse.status,
          message: "Error updating DecodingAviation API",
          error: errorText,
        });
      } else {
        return NextResponse.json({
          status: 200,
          message: "Data saved successfully",
        });
      }
    }
  } else {
    return NextResponse.json({
      status: 422,
      message: "Data not POSTED successfully",
    });
  }
}
