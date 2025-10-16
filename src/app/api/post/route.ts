import "server-only";
import { NextRequest, NextResponse } from "next/server";
import cloudinary from "../../../lib/cloudinary/cloudinary";
import allowedOriginsCheck from "@/utils/allowed_origins_check";
import readLog from "../../../services/authentication/read_log";
import { sectionsCode } from "../../../constants/sections";
import { getTranslatedSection } from "@/utils/api/post/get_translated_section";
import { JWT } from "next-auth/jwt";
import crypto from "crypto";
import { Database } from "firebase-admin/lib/database/database";
import { initializeFirebaseAdmin } from "../../../services/db/firebase_admin_DeCav";
import { adminDB } from "../../../services/db/firebase-admin";
import replaceImgWithSrc from "@/components/dashboard/menu/button_menu/utils/images_edit/replace_img_with_src";
import { convertHtmlToMarkdown } from "@/services/api/html_to_markdown";
import { FormDataImageItem } from "@/components/dashboard/menu/button_menu/type/formData";
import { cleanNestedDivsServer } from "@/components/dashboard/utils/clean_content_server";
import { language } from "gray-matter";
//
async function searchImageByFilename(
  filename: string,
  dbName: string
): Promise<any | null> {
  try {
    // Extract descriptive part
    const filenameRegex = /\d{2}-\d{2}-\d{2}-(.*?)\.webp$/;
    const match = filename.match(filenameRegex);

    if (match) {
      //
      let descriptivePart = match[1];

      // Clean the search term: remove spaces, special chars
      const cleanSearchTerm = descriptivePart
        .replace(/\s+/g, "_") // Replace spaces with underscores
        .replace(/[^\w-]/g, ""); // Remove special characters except underscore and dash

      console.log("Searching Cloudinary for:", cleanSearchTerm);
      let result;
      // Option 1: Search by public_id pattern
      result = await cloudinary.search
        .expression(`folder:"${dbName}"`)
        .max_results(10)
        .execute();
      // Filter results to find exact or partial match
      const matchingResource = result.resources.find((resource: any) => {
        const publicId = resource.public_id;
        const filename = publicId.split("/").pop() || "";

        // Check if the filename contains our search term
        return filename.includes(cleanSearchTerm);
      });

      if (matchingResource) {
        console.log("Image found via folder search:", matchingResource);
        return matchingResource;
      }
      //
    }
    return null;
  } catch (error) {
    console.error("Error checking if image exists:", error);
    return null;
  }
}

//
export async function POST(req: NextRequest): Promise<Response> {
  ///---------------------------------------------------
  /// POST (Save) to database firebase.
  ///---------------------------------------------------
  ///
  /// Variables.
  const imageUrls: { url: string; fileId: string }[] = [];
  const formData = await req.formData();
  const dbName = formData.get("dbName") as string;
  console.log('doing POST at /api/post, dbName:"', dbName, '"');

  interface Article {
    id: string;
    title: string;
    esTitle?: string;
    body: string;
    esBody?: string;
    images?: { url: string; fileId: string }[];
    category?: string;
    version?: string;
    section?: string;
    esSection?: string;
    sectionCode?: string;
    summary?: string;
    esSummary?: string;
    markdownArticle?: string;
    markdownEsArticle?: string;
  }
  //
  // {Validate request origin
  const response = allowedOriginsCheck(req);

  if (response!.status == 403) {
    return NextResponse.json({
      status: 403,
      message: "Origin not allowed",
    });
  }
  //
  let pre_images: Array<File | string> = [];
  const article: Article = {
    id: "",
    title: "",
    esTitle: "",
    body: "",
    esBody: "",
    section: "",
    esSection: "",
    images: [],
    summary: "",
    esSummary: "",
    markdownArticle: "",
    markdownEsArticle: "",
  };

  // Check if the user is authenticated
  const tokenReceived = formData.get("token") as string;
  const auth = readLog(tokenReceived ?? "");

  //

  // Upload images and update URLs
  if (auth) {
    ///================================================================
    /// SAVE IMAGE :
    ///================================================================

    let imageFiles: FormDataImageItem[] = [];
    let fileName: string = "";
    console.log("auth ok");

    // for (const key of formData.keys()) {
    //   if (key.startsWith("image")) {
    //     const fileData = formData.get(key);
    //     console.log('"fileData with image prefix"');

    //     if (typeof fileData === "string") {
    //       imageFiles.push(fileData);
    //     } else if (fileData instanceof Blob) {
    //       fileName = fileData.name || key;

    //       // Convert to File
    //       const file = new File([fileData], fileName, { type: fileData.type });
    //       imageFiles.push(file);
    //     } else {
    //       const fileData = formData.get(key);
    //       imageFiles.push(fileData as File);
    //     }
    //   }
    // }
    // for (const key of formData.keys()) {
    //   if (key.startsWith("images")) {
    const files = formData.get("images");
    //console.log('files type of "images"', typeof files);
    const filesObj = JSON.parse(files as string);
    //console.log('"filesObj at uploadImage"', filesObj);

    // if (Array.isArray(files)) {
    //   console.log("images are arrays at uploadImage");
    imageFiles = filesObj as FormDataImageItem[];
    //   console.log("imageFiles at uploadImage", imageFiles);
    //   imageFiles = files as FormDataImageItem[];
    // } else {
    //   console.log("images are NOT arrays at uploadImage");
    //   imageFiles = [];
    // }

    //}
    //}

    if (imageFiles.length > 0) {
      //Filter valid file objects

      // pre_images = imageFiles.filter(
      //   (value): value is File => value instanceof File
      // );
      // pre_images = imageFiles;
      console.log("pre_images > 0");
      await Promise.all(
        imageFiles.map(async (item: FormDataImageItem) => {
          return new Promise<void>(async (resolve) => {
            let fileUri: string = "";
            let uploadFileName: string = "";
            if (typeof item === "string") {
              // If item is a string, use it directly as the URL
              fileUri = item;
              uploadFileName = item;
            } else {
              fileUri = item.base64;
              uploadFileName = item.imageId;
            }
            ///--------------------------------------------------------
            // Search if the image URL is already in article images
            ///--------------------------------------------------------
            const existingImage = await searchImageByFilename(
              uploadFileName,
              dbName
            );
            console.log('"existingImage at uploadImage":', existingImage);

            if (existingImage) {
              console.log("Image already exists, using existing URL");
              imageUrls.push({
                url: existingImage.secure_url,
                fileId: existingImage.public_id,
              });
            } else {
              // Upload new image
              console.log("Uploading new image:", uploadFileName);
              ///--------------------------------------------------------
              // Load the image into Cloudinary
              ///--------------------------------------------------------
            }
            resolve();

            // Update image URL in article content
            // If any images were uploaded, update the article's images array
            if (imageUrls.length > 0) {
              console.log('"imageUrls.length > 0 at uploadImage"');
              console.log('"imageUrls"', imageUrls);
              article.images = imageUrls; // Append image URLs to article.images
            }
          });
        })
      );
    }
    ///================================================================
    /// SAVE　THE FULL ARTICLE to database:
    ///================================================================
    // Parse individual fields
    const titleData = formData.get("title") as string;
    const titleObj = JSON.parse(titleData);
    const esTitleData = formData.get("es-title") as string;
    const esTitleObj = JSON.parse(esTitleData);
    const idData = formData.get("id") as string;
    const idObj = JSON.parse(idData);
    const articleData = formData.get("body") as string;
    const bodyObj = JSON.parse(articleData);
    const esArticleData = formData.get("es-body") as string;
    const esBodyObj = JSON.parse(esArticleData);
    const dbNameData = formData.get("dbName") as string;
    const dbNameObj = JSON.parse(dbNameData);
    const sectionData = formData.get("section") as string;
    const sectionObj = JSON.parse(sectionData);
    const esSectionData = formData.get("es-section") as string;
    const esSectionObj = JSON.parse(esSectionData);
    const esSummaryData = formData.get("es-summary") as string;
    const esSummaryObj = JSON.parse(esSummaryData);
    const summaryData = formData.get("summary") as string;
    const summaryObj = JSON.parse(summaryData);
    // const markdownArticleData = formData.get("markdown") as string;
    // const markdownArticleObj = JSON.parse(markdownArticleData);
    // const markdownEsArticleData = formData.get("es-markdown") as string;
    // const markdownEsArticleObj = JSON.parse(markdownEsArticleData);

    //
    article.id = idObj;
    article.title = titleObj;
    article.esTitle = esTitleObj;
    article.body = bodyObj;
    article.esBody = esBodyObj;
    article.images = imageUrls;
    article.section = sectionObj;
    article.esSection = esSectionObj;
    article.summary = summaryObj;
    article.esSummary = esSummaryObj;
    // article.markdownArticle = markdownArticleObj;
    // article.markdownEsArticle = markdownEsArticleObj;

    // SAVE in db.
    let images = article.images;
    let section = article.section;
    //console.log('article images after cloudinary upload:"', images);

    //
    // log("article before replaceSrcWithImagePlaceholdersAtPost");
    //------------------------------------------
    // Purpose: Replace image src attributes in article bodies with placeholders and assign the updated strings back.
    //------------------------------------------

    const articlesBodies = [article.body, article.esBody];
    //console.log("articlesBodie", article.body);
    const articlesReplaced = articlesBodies.map((body, index) => {
      if (body) {
        return replaceImgWithSrc(
          body,
          images,
          "post",
          index === 0 ? "en" : "es"
        );
      }
      return body;
    });

    // article.body = articlesReplaced[0]!;
    // article.esBody = articlesReplaced[1]!;
    //
    //
    // const articleReplaced = replaceImgWithSrc(
    //   article.body!,
    //   images,
    //   "post",
    //   "en"
    // );
    // const articleESReplaced = replaceImgWithSrc(
    //   article.esBody!,
    //   images,
    //   "post",
    //   "es"
    // );
    // console.log(
    //   '"articleReplaced at post after replaceImgWithSrc:"',
    //   articleReplaced
    // );
    const cleanedBody = articlesReplaced.map((body) =>
      body ? cleanNestedDivsServer(body) : body
    );
    // Clean nested divs
    // article.body = cleanNestedDivsServer(articleReplaced);
    // article.esBody = cleanNestedDivsServer(articleESReplaced[1]);
    // console.log(
    //   'article after replaceSrcWithImagePlaceholdersAtPost:"',
    //   article.body
    // );

    // console.log(
    //   'article after replaceSrcWithImagePlaceholdersAtPost:"',
    //   updatedArticlesBodies[0]
    // );
    // console.log("updatedArticlesBodies", article.body);
    // debugger;
    //
    ///--------------------------------------------------------
    // Find Category and Section Code
    ///--------------------------------------------------------

    let sectionCode = sectionsCode[dbNameObj].find(
      (item) => item.label === section
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
    // Convert HTML to Markdown
    ///--------------------------------------------------------
    // const newArticles = [article.body, article.esBody];
    //------------------------------------------
    // Purpose: Convert HTML bodies to Markdown, including the title at the top of each body.
    //------------------------------------------
    // const titles = [article.title, article.esTitle];
    // Combine title and body for each language, then convert to Markdown
    // const markdownContent = newArticles.map((body, idx) =>
    //   convertHtmlToMarkdown(
    //     `<h1>${titles[idx]}</h1>\n${body}`,
    //     {
    //       preserveWhitespace: false, // Clean up extra whitespace
    //       includeImageAlt: true, // Include alt text for images
    //       preserveImageDimensions: true, // Keep image dimensions as comments
    //       convertTables: true, // Convert HTML tables to markdown
    //       preserveLineBreaks: true, // Keep line breaks as they are
    //     },
    //     "post"
    //   )
    // );
    // console.log("markdownContent", markdownContent[0]);
    // debugger;
    // article.markdownArticle = markdownContent[0];
    // article.markdownEsArticle = markdownContent[1];
    //console.log("article.markdownArticle", article.markdownArticle);
    // ///--------------------------------------------------------
    // // HTML articles
    // ///--------------------------------------------------------
    article.body = cleanedBody[0]!;
    article.esBody = cleanedBody[1]!;
    // article.body = updatedArticlesBodies[0];
    // article.esBody = updatedArticlesBodies[1];
    //
    ///--------------------------------------------------------
    // Select the correct database to save the article
    ///--------------------------------------------------------
    //
    let db: Database | Database;
    const { database } = initializeFirebaseAdmin();
    let author: string;
    let tags: string[] = [];
    let tags_es: string[] = [];
    let api_call_url: string;
    //
    if (dbNameObj === "DeCav") {
      db = database;
      author = process.env.AUTHOR_DECAV || "Default Author";
      tags = ["Aviation", "DecodingAviation", "DeCav"];
      tags_es = ["Aviación", "DecodingAviation", "DeCav"];
      api_call_url = process.env.URL_API_DECAV || "";
    } else {
      db = adminDB as unknown as Database;
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
    // Obten Token
    ///--------------------------------------------------------
    const authHeader = req.headers.get("authorization");

    const tokenG: JWT | string | undefined | null = authHeader?.split(" ")[1];

    if (!tokenG) {
      return NextResponse.json({ status: 401, error: "Unauthorized" });
    }
    ///--------------------------------------------------------
    // Obtain id
    ///--------------------------------------------------------
    let id = article.id;

    // Validate required fields
    if (!id || !article.title || !article.esTitle) {
      return NextResponse.json({
        status: 400,
        message: "Missing required fields: id, title, or esTitle",
        data: { id, title: article.title, esTitle: article.esTitle },
      });
    }
    let newId = id.replace(/\s+/g, "-").replace(/\./g, "");
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
      title: article.esTitle,
      description: article.esSummary,
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
      en_html: article.body,
      es_html: article.esBody,
      metadata: metadata,
      esMetadata: esMetadata,
    };

    const likes = {
      likes: 0,
    };
    // //
    // // const articleDataForDb = articleDataMocksForDb;
    // // const newId = articleDataMocksForDb.metadata.slug;
    // //console.log("articleDataForDb", articleDataForDb);

    // //
    try {
      const dbRef = db.ref(`articles/${newId}`);
      await dbRef.set(articleDataForDb);
    } catch (e) {
      return NextResponse.json({
        status: 500,
        message: "Error saving article to database",
        error: e instanceof Error ? e.message : "Unknown database error",
      });
    }

    try {
      const dbLikes = db.ref(`likes/${newId}`);
      await dbLikes.set(likes);
    } catch (e) {
      return NextResponse.json({
        status: 500,
        message: "Error saving article to database",
        error: e instanceof Error ? e.message : "Unknown database error",
      });
    }
    // //
    // //
    const body = JSON.stringify({
      title: article.title,
      slug: newId,
    });

    const secret = process.env.CMS_SECRET_KEY!;
    const signature = crypto
      .createHmac("sha256", secret!)
      .update(body)
      .digest("hex");
    console.log("url preboarding", api_call_url);

    const response = await fetch(api_call_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-cms-secret": process.env.CMS_SECRET_KEY!,
        "x-leg": signature,
        Authorization: `Bearer ${tokenG}`,
      },
      body: body,
    });
    console.log("response api", response);
    //
    if (response.status !== 200) {
      const errorText = await response.text();
      return NextResponse.json({
        status: response.status,
        message: "Error saving data",
        error: errorText,
      });
    }
    return NextResponse.json({
      status: 200,
      message: "Data saved successfully",
    });
  } else {
    return NextResponse.json({
      status: 422,
      message: "Data not saved successfully",
    });
  }
}
