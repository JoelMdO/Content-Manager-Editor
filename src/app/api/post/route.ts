import "server-only";
<<<<<<< HEAD
=======
import { database } from "../../../../firebaseMain";
import { databaseDecav } from "../../../../firebaseDecav";
// import { set, ref, update } from "firebase/database";
>>>>>>> 1295580d32457ddac461590b78b05994a943dd08
import { NextRequest, NextResponse } from "next/server";
import cloudinary from "../../../lib/cloudinary/cloudinary";
import replaceSrcWithImagePlaceholders from "../../../components/dashboard/menu/button_menu/utils/images_edit/replace_src_on_img";
import allowedOriginsCheck from "@/utils/allowed_origins_check";
import readLog from "../../../services/authentication/read_log";
import { convertHtmlToMarkdown } from "@/services/api/html_to_markdown";
import { sectionsCode } from "../../../constants/sections";
import { getTranslatedSection } from "@/utils/api/post/get_translated_section";
import { JWT } from "next-auth/jwt";
import crypto from "crypto";
import { Database } from "firebase-admin/lib/database/database";
import { initializeFirebaseAdmin } from "../../../../firebase_admin_DeCav";
import { adminDB } from "../../../../firebase-admin";

export async function POST(req: NextRequest): Promise<Response> {
  ///---------------------------------------------------
  /// POST (Save) to database firebase.
  ///---------------------------------------------------
  ///
  /// Variables.
  const imageUrls: { url: string; fileId: string }[] = [];
  const formData = await req.formData();
  const dbName = formData.get("dbName") as string;
  console.log("doing POST");

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
  let pre_images: Array<File> = [];
  const article: Article = {
    id: "",
    title: "",
    esTitle: "",
    body: "",
    esBody: "",
    section: "",
    esSection: "",
    images: [],
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

    const imageFiles: File[] = [];
    let fileName: string = "";

    for (const key of formData.keys()) {
      if (key.startsWith("image")) {
        const fileData = formData.get(key);
        if (fileData instanceof Blob) {
          fileName = fileData.name || key;

          // Convert to File
          const file = new File([fileData], fileName, { type: fileData.type });
          imageFiles.push(file);
        } else {
          const fileData = formData.get(key);
          imageFiles.push(fileData as File);
        }
      }
    }

    if (imageFiles.length > 0) {
      //Filter valid file objects
      // console.log("imageFiles found:", imageFiles);

      pre_images = imageFiles.filter(
        (value): value is File => value instanceof File
      );

      await Promise.all(
        pre_images.map(async (item: File) => {
          return new Promise<void>(async (resolve) => {
            ///CLOUDINARY UPLOAD
            //Convert to a buffer stream
            const fileBuffer = await item.arrayBuffer();
            const mimeType = item.type;
            const encoding = "base64";
            const base64Data = Buffer.from(fileBuffer).toString("base64");
            const fileUri =
              "data:" + mimeType + ";" + encoding + "," + base64Data;
            cloudinary.uploader.upload(
              fileUri,
              {
                invalidate: true,
                resource_type: "auto",
                filename_override: fileName,
                folder: dbName,
                use_filename: true,
              },
              (uploadError, result) => {
                if (uploadError) {
                  // Handle upload error
<<<<<<< HEAD
=======
                  console.log("Error uploading image:", uploadError);
>>>>>>> 1295580d32457ddac461590b78b05994a943dd08

                  return NextResponse.json({
                    status: 500,
                    message: "Error uploading image. No URL.",
                    uploadError,
                  });
                }
                // Get public URL
                if (result?.secure_url) {
                  // CLOUDINARY URL
                  let urlCloudinary: string | undefined = "";
                  urlCloudinary = result?.secure_url;

                  imageUrls.push({ url: urlCloudinary!, fileId: fileName });
                }
                resolve();
              }
            ); //     // Update image URL in article content
            // If any images were uploaded, update the article's images array
            if (imageUrls.length > 0) {
              console.log("images length >0");

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
    //
    article.id = idObj;
    article.title = titleObj;
    article.esTitle = esTitleObj;
    article.body = bodyObj;
    article.esBody = esBodyObj;
    article.images = imageUrls;
    article.section = sectionObj;
    article.esSection = esSectionObj;

    // SAVE in db.
<<<<<<< HEAD
    let images = article.images;
    let section = article.section;
    //

    //------------------------------------------
    // Purpose: Replace image src attributes in article bodies with placeholders and assign the updated strings back.
    //------------------------------------------

    const articlesBodies = [article.body, article.esBody];
    console.log("articlesBodie", article.body);

    const updatedArticlesBodies = articlesBodies.map((body) =>
      replaceSrcWithImagePlaceholders(body!, images)
    );
    article.body = updatedArticlesBodies[0];
    article.esBody = updatedArticlesBodies[1];
    console.log("updatedArticlesBodies", updatedArticlesBodies[0]);

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
    const newArticles = [updatedArticlesBodies[0], updatedArticlesBodies[1]];
    //------------------------------------------
    // Purpose: Convert HTML bodies to Markdown, including the title at the top of each body.
    //------------------------------------------
    const titles = [article.title, article.esTitle];
    // Combine title and body for each language, then convert to Markdown
    const markdownContent = newArticles.map((body, idx) =>
      convertHtmlToMarkdown(`<h1>${titles[idx]}</h1>\n${body}`, {
        preserveWhitespace: false, // Clean up extra whitespace
        includeImageAlt: true, // Include alt text for images
        preserveImageDimensions: true, // Keep image dimensions as comments
        convertTables: true, // Convert HTML tables to markdown
        preserveLineBreaks: true, // Keep line breaks as they are
      })
    );
    console.log("markdownContent", markdownContent[0]);

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
    // Create a summary of the article content for description
    ///--------------------------------------------------------
    const authHeader = req.headers.get("authorization");

    const tokenG: JWT | string | undefined | null = authHeader?.split(" ")[1];

    if (!tokenG) {
      return NextResponse.json({ status: 401, error: "Unauthorized" });
    }
    const newUrl = process.env.RESUME_URL;
    console.log("newUrl", newUrl);

    //
    process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0"; //TODO delete this line in production

    const resumeResponse = await fetch(`${newUrl}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tokenG}`,
        "Content-Type": "application/json",
        "X-Request-Type": "translation",
        "X-Service": "cms-translate",
        "X-Source-DB": dbName,
      },
      body: JSON.stringify({
        article: article.body,
        esArticle: article.esBody,
      }),
    });
    console.log("response", resumeResponse);

    if (!resumeResponse.ok) {
      const errorText = await resumeResponse.text();

      return NextResponse.json({
        status: 500,
        error: `API returned ${resumeResponse.status}: ${errorText}`,
      });
    }

    const resume = await resumeResponse.json();
    article.body = resume.article;
    article.esBody = resume.esArticle;
    //   console.log("resume", resume);
    if (article.body && article.body.length >= 180) {
      article.body = article.body.slice(0, 180);
    }
    if (article.esBody && article.esBody.length >= 180) {
      article.esBody = article.esBody.slice(0, 180);
    }
    // } catch (error) {
    //   console.log("error", error);
    //}
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
    ///--------------------------------------------------------
    // Create Metadata Object
    ///--------------------------------------------------------
    const metadata = {
      title: article.title,
      description: article.body,
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
      description: article.esBody,
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
    //

    //

    const articleDataForDb = {
=======
    //console.log("body at save article:", article.body);
    //console.log("title at save article:", article.title);
    let images = article.images;
    let section = article.section;
    //
    //console.log("article.images:", article.images);

    //------------------------------------------
    // Purpose: Replace image src attributes in article bodies with placeholders and assign the updated strings back.
    //------------------------------------------
    //console.log("english article", article.body);
    //console.log("spanish article", article.esBody);

    const articlesBodies = [article.body, article.esBody];
    const updatedArticlesBodies = articlesBodies.map((body) =>
      replaceSrcWithImagePlaceholders(body!, images)
    );
    article.body = updatedArticlesBodies[0];
    article.esBody = updatedArticlesBodies[1];

    //console.log("articlesBodies english:", updatedArticlesBodies[0]);
    //console.log("articlesBodies spanish:", updatedArticlesBodies[1]);
    //
    ///--------------------------------------------------------
    // Find Category and Section Code
    ///--------------------------------------------------------
    //console.log("section before retrieve the code :", section);
    //console.log("dbNameObj:", dbNameObj);

    let sectionCode = sectionsCode[dbNameObj].find(
      (item) => item.label === section
    );
    console.log("Section found:", sectionCode);

    ///--------------------------------------------------------
    // Find the correct section for spanish
    ///--------------------------------------------------------
    const esSection = getTranslatedSection({
      db: dbNameObj,
      langFrom: "en",
      langTo: "es",
      value: section,
    });

    //console.log("Translated value:", esSection);
    ///--------------------------------------------------------
    // Convert HTML to Markdown
    ///--------------------------------------------------------
    const newArticles = [updatedArticlesBodies[0], updatedArticlesBodies[1]];
    //------------------------------------------
    // Purpose: Convert HTML bodies to Markdown, including the title at the top of each body.
    //------------------------------------------
    const titles = [article.title, article.esTitle];
    // Combine title and body for each language, then convert to Markdown
    const markdownContent = newArticles.map((body, idx) =>
      convertHtmlToMarkdown(`<h1>${titles[idx]}</h1>\n${body}`, {
        preserveWhitespace: false, // Clean up extra whitespace
        includeImageAlt: true, // Include alt text for images
        preserveImageDimensions: true, // Keep image dimensions as comments
        convertTables: true, // Convert HTML tables to markdown
        preserveLineBreaks: true, // Keep line breaks as they are
      })
    );
    //
    //console.log("markdownContentEN:", markdownContent[0]);
    //console.log("markdownContentES:", markdownContent[1]);
    ///--------------------------------------------------------
    // Select the correct database to save the article
    ///--------------------------------------------------------
    //
    let db: Database | Database;
    const { auth, database } = initializeFirebaseAdmin();
    console.log("auth", auth);
    console.log("database", database);
    let author: string;
    let tags: string[] = [];
    let tags_es: string[] = [];
    let api_call_url: string;
    //
    if (dbNameObj === "DeCav") {
      // db = databaseDecav;
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

    console.log("Selected database:", dbNameObj);
    console.log("Database instance:", db ? "Connected" : "Not connected");
    ///--------------------------------------------------------
    // Create Metadata Object
    ///--------------------------------------------------------
    const metadata = {
      title: article.title,
      description: markdownContent[0].slice(0, 150), // Get first 150 chars as description
      author: author,
      date: new Date().toISOString(),
      tags: tags,
      category: sectionCode,
      published: true,
      version: "1.0",
    };
    const esMetadata = {
      title: article.esTitle,
      description: markdownContent[1].slice(0, 150), // Get first 150 chars as description
      author: author,
      date: new Date().toISOString(),
      tags: tags_es,
      category: sectionCode,
      published: true,
      version: "1.0",
    };
    //

    //
    let id = article.id;

    // Validate required fields
    if (!id || !article.title || !article.esTitle) {
      return NextResponse.json({
        status: 400,
        message: "Missing required fields: id, title, or esTitle",
        data: { id, title: article.title, esTitle: article.esTitle },
      });
    }

    const articleDataForDb = {
      // [id]: {
>>>>>>> 1295580d32457ddac461590b78b05994a943dd08
      en: markdownContent[0],
      es: markdownContent[1],
      metadata: metadata,
      esMetadata: esMetadata,
<<<<<<< HEAD
    };
    //
    const likes = {
      likes: 0,
    };
    //
    console.log("articleDataForDb", articleDataForDb);

    //
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

=======
      //},
    };
    console.log("articleData structure validated:", {
      hasEn: !!articleDataForDb.en,
      hasEs: !!articleDataForDb.es,
      hasMetadata: !!articleDataForDb.metadata,
      hasEsMetadata: !!articleDataForDb.esMetadata,
      enLength: articleDataForDb.en?.length || 0,
      esLength: articleDataForDb.es?.length || 0,
    });
    // //

    const articlesMenu = {
      // [id]: {
      en: {
        published: true,
        resume: markdownContent[0].slice(0, 150), // Fix: use markdownContent[0] for English
        title: article.title,
      },
      es: {
        published: true,
        resume: markdownContent[1].slice(0, 150), // Fix: use markdownContent[1] for Spanish
        title: article.esTitle,
      },
      section: section,
      esSection: esSection,
      section_code: sectionCode,
      slug: article.id,
      //},
    };
    //
    //console.log("articlesMenu:", articlesMenu);

    const likes = {
      // [id]: {
      likes: 0,
      //},
    };
    //
    //console.log("likes:", likes);

    //
    //try {
    // console.log("Attempting to save article with ID:", article.id);
    // console.log("Database reference path:", `articles/${article.id}`);
    // console.log(
    //   "Data structure to save:",
    //   JSON.stringify(articleDataForDb, null, 2)
    // );
    let newId = id.replace(/\s+/g, "-").replace(/\./g, "");

    try {
      const dbRef = db.ref(`articles/${newId}`);
      const response = await dbRef.set(articleDataForDb);

      console.log("Article saved successfully, response:", response);
    } catch (e) {
      console.log("Error saving articles:");
      console.log(
        "Error message:",
        e instanceof Error ? e.message : "Unknown error"
      );
      console.log(
        "Error stack:",
        e instanceof Error ? e.stack : "No stack trace"
      );
      console.log("Error code:", (e as any)?.code || "No error code");
      console.log("Full error object:", e);

      // return NextResponse.json({
      //   status: 500,
      //   message: "Error saving article to database",
      //   error: e instanceof Error ? e.message : "Unknown database error",
      // });
    }
    //
    try {
      const dbRefMenu = db.ref(`articles_menu/${newId}`);
      await dbRefMenu.set(articlesMenu);
    } catch (e) {
      console.log("Error saving articles menu:");
      console.log(
        "Error message:",
        e instanceof Error ? e.message : "Unknown error"
      );
      console.log(
        "Error stack:",
        e instanceof Error ? e.stack : "No stack trace"
      );
      console.log("Error code:", (e as any)?.code || "No error code");
      console.log("Full error object:", e);
    }
    //
>>>>>>> 1295580d32457ddac461590b78b05994a943dd08
    try {
      const dbLikes = db.ref(`likes/${newId}`);
      await dbLikes.set(likes);
    } catch (e) {
<<<<<<< HEAD
      return NextResponse.json({
        status: 500,
        message: "Error saving article to database",
        error: e instanceof Error ? e.message : "Unknown database error",
      });
    }
    //
    //
=======
      console.log("Error saving likes:");
      console.log(
        "Error message:",
        e instanceof Error ? e.message : "Unknown error"
      );
      console.log(
        "Error stack:",
        e instanceof Error ? e.stack : "No stack trace"
      );
      console.log("Error code:", (e as any)?.code || "No error code");
      console.log("Full error object:", e);
    }
    //
    const authHeader = req.headers.get("authorization");
    //console.log("authHeader:", authHeader);

    const tokenG: JWT | string | undefined | null = authHeader?.split(" ")[1];
    //console.log("tokenG:", tokenG);
    //
    ///--------------------------------------------------------
    // HMAC API Call to save the article
    ///--------------------------------------------------------
>>>>>>> 1295580d32457ddac461590b78b05994a943dd08
    const body = JSON.stringify({
      title: article.title,
      slug: newId,
    });
<<<<<<< HEAD
=======
    console.log("body before preboarding call:", body);
>>>>>>> 1295580d32457ddac461590b78b05994a943dd08

    const secret = process.env.CMS_SECRET_KEY!;
    const signature = crypto
      .createHmac("sha256", secret!)
      .update(body)
      .digest("hex");
<<<<<<< HEAD
    console.log("url preboarding", api_call_url);
=======
>>>>>>> 1295580d32457ddac461590b78b05994a943dd08

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
<<<<<<< HEAD
    console.log("response api", response);
    //
    if (response.status !== 200) {
      const errorText = await response.text();
=======

    console.log("response status:", response.status);
    console.log("response", response);

    //
    if (response.status !== 200) {
      const errorText = await response.text();
      console.error("Error response from API:", errorText);
>>>>>>> 1295580d32457ddac461590b78b05994a943dd08
      return NextResponse.json({
        status: response.status,
        message: "Error saving data",
        error: errorText,
      });
    }
    return NextResponse.json({
      status: 200,
      message: "Data saved successfully",
<<<<<<< HEAD
    });
    //
=======
      // body: body,
    });
    // } catch (error) {
    //   const parse = JSON.stringify(error);
    //   console.log("Error saving data:", parse);

    //   return NextResponse.json({
    //     status: 500,
    //     message: "Error saving data ",
    //     error: parse,
    //   });
    // }
>>>>>>> 1295580d32457ddac461590b78b05994a943dd08
  } else {
    return NextResponse.json({
      status: 422,
      message: "Data not saved successfully",
    });
  }
}
