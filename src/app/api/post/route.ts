import "server-only";
import { database } from "../../../../firebaseMain";
import { databaseDecav } from "../../../../firebaseDecav";
import { Database, set, ref, update } from "firebase/database";
import { NextRequest, NextResponse } from "next/server";
import cloudinary from "../../../lib/cloudinary/cloudinary";
import replaceSrcWithImagePlaceholders from "../../../components/dashboard/menu/button_menu/utils/images_edit/replace_src_on_img";
import allowedOriginsCheck from "@/utils/allowed_origins_check";
import readLog from "../../../services/authentication/read_log";
import { convertHtmlToMarkdown } from "@/services/api/html_to_markdown";
import { sectionsCode } from "../../../constants/sections";
import { getTranslatedSection } from "@/utils/api/post/get_translated_section";

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
      console.log("imageFiles found:", imageFiles);

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
                  console.log("Error uploading image:", uploadError);

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
    console.log("body at save article:", article.body);
    console.log("title at save article:", article.title);
    let images = article.images;
    let section = article.section;
    //
    console.log("article.images:", article.images);

    //------------------------------------------
    // Purpose: Replace image src attributes in article bodies with placeholders and assign the updated strings back.
    //------------------------------------------
    const articlesBodies = [article.body, article.esBody];
    const updatedArticlesBodies = articlesBodies.map((body) =>
      replaceSrcWithImagePlaceholders(body!, images)
    );
    article.body = updatedArticlesBodies[0];
    article.esBody = updatedArticlesBodies[1];

    console.log("articlesBodies english:", updatedArticlesBodies[0]);
    console.log("articlesBodies spanish:", updatedArticlesBodies[1]);
    //
    ///--------------------------------------------------------
    // Find Category and Section Code
    ///--------------------------------------------------------
    console.log("section before retrieve the code :", section);
    console.log("dbNameObj:", dbNameObj);

    const sectionCode = sectionsCode[dbNameObj].find(
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

    console.log("Translated value:", esSection);
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
    console.log("markdownContentEN:", markdownContent[0]);
    console.log("markdownContentES:", markdownContent[1]);
    ///--------------------------------------------------------
    // Select the correct database to save the article
    ///--------------------------------------------------------
    //
    let db: Database;
    let author: string;
    let tags: string[] = [];
    let tags_es: string[] = [];
    let api_call_url: string;
    //
    if (dbNameObj === "DeCav") {
      db = databaseDecav;
      author = process.env.AUTHOR_DECAV || "Default Author";
      tags = ["Aviation", "DecodingAviation", "DeCav"];
      tags_es = ["Aviación", "DecodingAviation", "DeCav"];
      api_call_url = process.env.URL_API_DECAV || "";
    } else {
      db = database;
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
    const articleDataForDb = {
      // [id]: {
      en: markdownContent[0],
      es: markdownContent[1],
      metadata: metadata,
      esMetadata: esMetadata,
      //},
    };
    console.log("articleData:", articleDataForDb);
    // //

    const articlesMenu = {
      // [id]: {
      en: {
        published: true,
        resume: markdownContent.slice(0, 150),
        title: article.title,
      },
      es: {
        published: true,
        resume: markdownContent.slice(0, 150),
        title: article.esTitle,
      },
      section: section,
      esSection: esSection,
      section_code: sectionCode,
      slug: article.id,
      //},
    };
    //
    console.log("articlesMenu:", articlesMenu);

    const likes = {
      // [id]: {
      likes: 0,
      //},
    };
    //
    console.log("likes:", likes);

    //
    try {
      const dbRef = ref(db, `articles/${article.id}`);
      await set(dbRef, articleDataForDb);
      //
      const dbRefMenu = ref(db, `articles_menu/${article.id}`);
      await set(dbRefMenu, articlesMenu);
      //
      const dbLikes = ref(db, `likes/${article.id}`);
      await set(dbLikes, likes);
      //
      await fetch(api_call_url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-cms-secret": process.env.CMS_SECRET_KEY!,
        },
        body: JSON.stringify({
          title: article.title,
          description: metadata.description,
          slug: article.id,
          section_code: sectionCode,
          section: article.section,
          content_en: markdownContent[0],
          content_es: markdownContent[1],
          tags: tags.join(", "),
        }),
      });

      return NextResponse.json({
        status: 200,
        message: "Data saved successfully",
        // body: body,
      });
    } catch (error) {
      const parse = JSON.stringify(error);
      return NextResponse.json({
        status: 500,
        message: "Error saving data ",
        error: parse,
      });
    }
  } else {
    return NextResponse.json({
      status: 422,
      message: "Data not saved successfully",
    });
  }
}
