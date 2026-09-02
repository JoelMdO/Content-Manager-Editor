import "server-only";
import { NextRequest, NextResponse } from "next/server";
import allowedOriginsCheck from "@/utils/allowed_origins_check";
import readLog from "../../../services/authentication/read_log";
import { sectionsCode } from "../../../constants/sections";
import { getTranslatedSection } from "@/utils/api/post/get_translated_section";
import { JWT } from "next-auth/jwt";
// import crypto from "crypto";
// import replaceImgWithSrc from "@/components/dashboard/menu/button_menu/utils/images_edit/replace_img_with_src";
// import { FormDataImageItem } from "@/components/dashboard/menu/button_menu/type/formData";
import { cleanNestedDivsServer } from "@/components/dashboard/utils/clean_content_server";
// import searchImageByFilename from "@/utils/api/post/search_image_byFileName";
import cloudinary from "../../../lib/cloudinary/cloudinary";
import replaceSrcWithImagePlaceholdersAtPost from "@/components/dashboard/menu/button_menu/utils/images_edit/replace_src_on_img_at_post";
import generateNonce from "@/utils/nonce";
import { createSignature } from "@/utils/create_signatures";
//
export async function POST(req: NextRequest): Promise<Response> {
  ///---------------------------------------------------
  /// POST (Save) to database firebase.
  ///---------------------------------------------------
  ///
  /// Variables.
  // const imageUrls: { url: string; fileId: string }[] = [];
  const formData = await req.formData();
  const dbName = formData.get("dbName") as string;
  console.log('doing POST at /api/post, dbName:"', dbName, '"');

  interface Article {
    id: string;
    title: string;
    es_title?: string;
    body: string;
    es_body?: string;
    // images?: { url: string; fileId: string }[];
    category?: string;
    version?: string;
    section?: string;
    es_section?: string;
    sectionCode?: string;
    summary?: string;
    es_summary?: string;
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

  const article: Article = {
    id: "",
    title: "",
    es_title: "",
    body: "",
    es_body: "",
    section: "",
    es_section: "",
    // images: [],
    summary: "",
    es_summary: "",
    markdownArticle: "",
    markdownEsArticle: "",
  };

  // Check if the user is authenticated
  const tokenReceived = formData.get("token") as string;
  let auth = false;

  try {
    auth = readLog(tokenReceived ?? "");
  } catch (error) {
    console.error("Token validation failed:", error);
    auth = false;
  }

  // Fallback: Check Authorization header JWT if FormData token is invalid
  if (!auth) {
    const authHeader = req.headers.get("authorization");
    if (authHeader?.startsWith("Bearer ")) {
      const jwtToken = authHeader.substring(7);
      if (jwtToken) {
        console.log("Using JWT from Authorization header as fallback");
        auth = true;
      }
    }
  }

  //

  // Upload images and update URLs
  if (auth) {
    ///================================================================
    /// SAVE IMAGE :
    ///================================================================

    // let imageFiles: FormDataImageItem[] = [];
    // //const pre_images: Array<File> = [];
    // //console.log("auth ok");

    // const files = formData.get("images");
    // console.log('files  "images"', files);
    // const filesObj = JSON.parse(files as string);
    // ////console.log('"filesObj at uploadImage"', filesObj);

    // imageFiles = filesObj as FormDataImageItem[];

    // if (imageFiles.length > 0) {
    //Filter valid file objects
    //console.log("pre_images > 0");

    const insertCloudinaryUrlsatBody = async (
      language: string,
    ): Promise<string> => {
      const imageUrlRegex = /<img[^>]+src="([^">]+)"/g;
      const bodyContent = formData.get(
        language === "en" ? "body" : "es_body",
      ) as string;

      let match: RegExpExecArray | null;
      let cleanedBody: string = "";

      // Search in English body
      while ((match = imageUrlRegex.exec(bodyContent)) !== null) {
        const imageUrl = match[1];
        const uploadFileName = imageUrl.split("/").pop() || "";
        const url = process.env.URL_IMAGES_STORE || "";

        const response = await fetch(`${url}/?image_id=${uploadFileName}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "X-Internal-Proxy-Key": process.env.PROXY_KEY || "",
          },
        });

        const data = await response.json();
        const base64Data = data.image_base64_url.base64;
        const image_id = data.image_base64_url.image_id;
        const file_name = data.image_base64_url.file_name;
        const newCloudinaryImage: Array<{ url: string; fileId: string }> = [
          { url: "", fileId: "" },
        ];

        cloudinary.uploader.upload(
          base64Data,
          {
            invalidate: true,
            resource_type: "auto",
            public_id: image_id,
            folder: dbName,
          },
          (uploadError, result) => {
            if (uploadError) {
              // Handle upload error
              return NextResponse.json({
                status: 400,
                message: `Error uploading image: ${uploadError}`,
              });
              return;
            }
            // Get public URL
            if (result?.secure_url) {
              // CLOUDINARY URL
              newCloudinaryImage[0] = {
                url: result.secure_url,
                fileId: file_name,
              };
            }
          },
        );

        const bodyWithCloudinaryUrls = replaceSrcWithImagePlaceholdersAtPost(
          bodyContent,
          newCloudinaryImage,
        );
        console.log(
          `Updated ${language} body with Cloudinary URLs:`,
          bodyWithCloudinaryUrls,
        );
        console.log(
          `==== Body with Cloudinary URLs length: ====`,
          bodyWithCloudinaryUrls.length,
        );
        cleanedBody = cleanNestedDivsServer(bodyWithCloudinaryUrls);
        console.log(`==== Cleaned ${language} body: ====`, cleanedBody);
      }
      return cleanedBody;
    };
    // imageFiles.map(async (item: FormDataImageItem) => {
    //   return new Promise<void>(async (resolve) => {
    //     // let fileUri: string = "";
    //     let uploadFileName: string = "";
    //     if (typeof item === "string") {
    //       // If item is a string, use it directly as the URL
    //       // fileUri = item;
    //       uploadFileName = item;
    //     } else {
    //       // fileUri = item.base64;
    //       uploadFileName = item.imageId;
    //     }
    ///--------------------------------------------------------
    // Search if the image URL is already in article images
    ///--------------------------------------------------------
    // const existingImage = await searchImageByFilename(
    //   uploadFileName,
    //   dbName,
    // );
    // console.log(
    //   '"📸 [Image existingImage at uploadImage":',
    //   existingImage,
    // );

    // if (existingImage) {
    //   //console.log("Image already exists, using existing URL");
    //   imageUrls.push({
    //     url: existingImage.secure_url,
    //     fileId: existingImage.public_id,
    //   });
    //   resolve();
    // } else {
    //   // Upload new image
    //   console.log("Uploading new image:", uploadFileName);
    //   ///--------------------------------------------------------
    //   // Load the image into Cloudinary
    //   ///--------------------------------------------------------
    //   ///CLOUDINARY UPLOAD
    //   // Use base64 data directly from sessionStorage
    //   const imageItem = item as FormDataImageItem;
    //   const base64Data = imageItem.base64;

    //   if (!base64Data) {
    //     console.error(
    //       "No base64 data available for image:",
    //       uploadFileName,
    //     );
    //     resolve();
    //     return;
    //   }

    //   cloudinary.uploader.upload(
    //     base64Data,
    //     {
    //       invalidate: true,
    //       resource_type: "auto",
    //       public_id: imageItem.imageId,
    //       folder: dbName,
    //     },
    //     (uploadError, result) => {
    //       if (uploadError) {
    //         // Handle upload error
    //         console.log("Error uploading image:", uploadError);
    //         resolve();
    //         return;
    //       }
    //       // Get public URL
    //       if (result?.secure_url) {
    //         // CLOUDINARY URL
    //         imageUrls.push({
    //           url: result.secure_url,
    //           fileId: result.public_id,
    //         });
    //       }
    //       resolve();
    //     },
    //   );
    // }

    // Update image URL in article content
    // If any images were uploaded, update the article's images array
    //   if (imageUrls.length > 0) {
    //     console.log('"imageUrls.length > 0 at uploadImage"');
    //     console.log('"imageUrls"', imageUrls);
    //     article.images = imageUrls; // Append image URLs to article.images
    //   }
    // });
    //     }),
    //   );
    // }
    ///================================================================
    /// SAVE　THE FULL ARTICLE to database:
    ///================================================================
    // Parse individual fields
    const titleData = formData.get("title") as string;
    const titleObj = JSON.parse(titleData);
    const esTitleData = formData.get("es_title") as string;
    const esTitleObj = JSON.parse(esTitleData);
    const idData = formData.get("id") as string;
    const idObj = JSON.parse(idData);
    // const articleData = formData.get("body") as string;
    // const bodyObj = JSON.parse(articleData);
    // const esArticleData = formData.get("es_body") as string;
    // const esBodyObj = JSON.parse(esArticleData);
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
    // const markdownArticleData = formData.get("markdown") as string;
    // const markdownArticleObj = JSON.parse(markdownArticleData);
    // const markdownEsArticleData = formData.get("es-markdown") as string;
    // const markdownEsArticleObj = JSON.parse(markdownEsArticleData);

    //
    article.id = idObj;
    article.title = titleObj;
    article.es_title = esTitleObj;
    // article.body = bodyObj;
    // article.es_body = esBodyObj;
    // article.images = imageUrls;
    article.section = sectionObj;
    article.es_section = esSectionObj;
    article.summary = summaryObj;
    article.es_summary = esSummaryObj;
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
    article.body = await insertCloudinaryUrlsatBody("en");
    article.es_body = await insertCloudinaryUrlsatBody("es");
    console.log("body after replace image", article.body);
    console.log("es_body after replace image", article.es_body);
    // const articlesBodies = [article.body, article.es_body];
    // let articlesReplaced: (string | undefined)[] = [];
    // ////console.log("articlesBodie", article.body);
    // if (images.length > 0) {
    //   articlesReplaced = articlesBodies.map((body, index) => {
    //     if (body) {
    //       return replaceImgWithSrc(
    //         body,
    //         images,
    //         "post",
    //         index === 0 ? "en" : "es",
    //       );
    //     }
    //     return body;
    //   });
    // } else {
    //   articlesReplaced = articlesBodies;
    // }

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
    // //console.log(
    //   '"articleReplaced at post after replaceImgWithSrc:"',
    //   articleReplaced
    // );

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
    // //console.log("markdownContent", markdownContent[0]);
    // debugger;
    // article.markdownArticle = markdownContent[0];
    // article.markdownEsArticle = markdownContent[1];
    ////console.log("article.markdownArticle", article.markdownArticle);
    // ///--------------------------------------------------------
    // // HTML articles
    // ///--------------------------------------------------------
    // article.body = cleanedBody[0]!;
    // article.esBody = cleanedBody[1]!;
    // article.body = updatedArticlesBodies[0];
    // article.esBody = updatedArticlesBodies[1];
    //
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
    const id = article.id;

    // Validate required fields
    if (!id || !article.title || !article.es_title) {
      return NextResponse.json({
        status: 400,
        message: "Missing required fields: id, title, or es_title",
        data: { id, title: article.title, es_title: article.es_title },
      });
    }
    const newId = id.replace(/\s+/g, "-").replace(/\./g, "");
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

    // const likes = {
    //   likes: 0,
    // };

    ///--------------------------------------------------------
    // Check on token expiration
    ///--------------------------------------------------------

    // try {
    //   //TODO add new DB.
    //   // const dbRef = db.ref(`articles/${newId}`);
    //   // await dbRef.set(articleDataForDb);
    // } catch (e) {
    //   console.log("Error saving article to database:", JSON.stringify(e));
    //   console.error(e);
    //   return NextResponse.json({
    //     status: 500,
    //     message: "Error saving article to database",
    //     error: e instanceof Error ? e.message : "Unknown database error",
    //   });
    // }

    // try {
    //   //TODO add new DB. LIKES
    //   // const dbLikes = db.ref(`likes/${newId}`);
    //   // await dbLikes.set(likes);
    // } catch (e) {
    //   return NextResponse.json({
    //     status: 500,
    //     message: "Error saving likes to database",
    //     error: e instanceof Error ? e.message : "Unknown database error",
    //   });
    // }

    // const body = JSON.stringify({
    //   title: article.title,
    //   slug: newId,
    // });

    // const secret = process.env.CMS_SECRET_KEY!;
    // const signature = crypto
    //   .createHmac("sha256", secret!)
    //   .update(JSON.stringify({
    //     title: article.title,
    //     slug: newId,
    //   }))
    //   .digest("hex");
    //console.log("url preboarding", api_call_url);

    ///--------------------------------------------------------
    // Call CMS to update with urls from Cloudinary and Metadata.
    ///--------------------------------------------------------
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
        esMetadata: esMetadata,
      }),
    });
    //console.log("response api", response);
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

      const timestamp = Math.floor(Date.now() / 1000).toString();
      const nonce = generateNonce();
      const signature = createSignature(timestamp, nonce, article.id);

      const decavResponse = await fetch(api_call_url, {
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
      message: "Data not saved successfully",
    });
  }
}
