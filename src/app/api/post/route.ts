import "server-only";
import { database } from "../../../../firebaseMain";
import { databaseDecav } from "../../../../firebaseDecav";
import { Database, ref, set, update } from "firebase/database";
import { NextRequest, NextResponse } from "next/server";
import cloudinary from "../../../lib/cloudinary/cloudinary";
import { forEach } from "lodash";
import replaceSrcWithImagePlaceholders from "../../../components/dashboard/menu/button_menu/utils/images_edit/replace_src_on_img";
import allowedOriginsCheck from "@/utils/allowed_origins_check";
import readLog from "../../../services/authentication/read_log";
import { convertHtmlToMarkdown } from "@/services/api/html_to_markdown";
import { sectionsCode } from "../../../constants/sections";

export async function POST(req: NextRequest): Promise<Response> {
  ///---------------------------------------------------
  /// POST (Save) to database firebase.
  ///---------------------------------------------------
  ///
  /// Variables.
  const imageUrls: { url: string }[] = [];
  const formData = await req.formData();
  const dbName = formData.get("dbName") as string;
  console.log("doing POST");

  interface Article {
    id: string;
    title: string;
    esTitle?: string;
    body: string;
    esBody?: string;
    images?: { url: string }[];
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

                  imageUrls.push({ url: urlCloudinary! });
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
    // let section = article.section;
    //

    // try {
    //   // const arrayData = [images, bold, italic];
    //   const arrayData = [images];
    //   forEach(arrayData, (value) => {
    //     if (Array.isArray(value) && value.length === 0) {
    //       if (value === images) {
    //         images = [{ url: "nil" }];
    //       }
    //     }
    //   });
    // Replace src of the each image with the corresponded url:
    console.log("article.images:", article.images);

    const articlesBodies = [article.body, article.esBody];
    articlesBodies.forEach((article) => {
      replaceSrcWithImagePlaceholders(article!, images);
    });
    //
    console.log("articlesBodies english:", articlesBodies[0]);
    console.log("articlesBodies spanish:", articlesBodies[1]);
    //
    ///--------------------------------------------------------
    // Find Category and Section Code
    ///--------------------------------------------------------
    // const category = sectionsCode[dbNameObj].find(
    //   (item) => item.label === section
    // );
    // ///--------------------------------------------------------
    // // Convert HTML to Markdown
    // ///--------------------------------------------------------
    // const markdownContent = convertHtmlToMarkdown(body, {
    //   preserveWhitespace: false, // Clean up extra whitespace
    //   includeImageAlt: true, // Include alt text for images
    //   preserveImageDimensions: true, // Keep image dimensions as comments
    //   convertTables: true, // Convert HTML tables to markdown
    //   preserveLineBreaks: true, // Keep line breaks as they are
    // });
    // //
    // console.log("markdownContent:", markdownContent);
    // ///--------------------------------------------------------
    // // Select the correct database to save the article
    // ///--------------------------------------------------------
    // //
    // let db: Database;
    // let author: string;
    // //
    // if (dbNameObj === "DeCav") {
    //   db = databaseDecav;
    //   author = process.env.AUTHOR_DECAV || "Default Author";
    // } else {
    //   db = database;
    //   author = process.env.AUTHOR || "Default Author";
    // }
    // ///--------------------------------------------------------
    // // Create Metadata Object
    // ///--------------------------------------------------------
    // const metadata = {
    //   author: author,
    //   category: category,
    //   date: new Date().toISOString(),
    //   description: markdownContent.slice(0, 150), // Get first 150 chars as description
    //   published: true,
    //   tags: [],
    //   title: title,
    // };
    // //
    // const articleData = {
    //   id: id,
    //   en: articlesBodies[0],
    //   es: articlesBodies[1],
    //   metadata: metadata,
    // };
    // //
    // ///--------------------------------------------------------
    // // Obtain section code
    // ///--------------------------------------------------------
    // let sectionCode: string = "";
    // if (section && sectionsCode.hasOwnProperty(dbNameObj)) {
    //   sectionCode =
    //     sectionsCode[dbNameObj].find(
    //       (sectionCode) => sectionCode.label === section
    //     )?.code || "";
    // }
    // //
    // const articlesMenu = {
    //   id: id,
    //   en: {
    //     published: true,
    //     resume: markdownContent.slice(0, 150),
    //     title: title,
    //   }, //TODO to english
    //   es: {
    //     published: true,
    //     resume: markdownContent.slice(0, 150),
    //     title: title,
    //   }, //TODO to spanish
    //   section: section,
    //   section_code: sectionCode,
    //   slug: id,
    // };
    // //
    // const likes = {
    //   id: id,
    //   likes: 0,
    // };
    //
    // try {
    //   const dbRef = ref(db, `articles/${id}`);
    //   await set(dbRef, articleData);
    //   //
    //   const dbRefMenu = ref(db, `articles_menu/${id}`);
    //   await set(dbRefMenu, articlesMenu);
    //   //
    //   const dbLikes = ref(db, `likes/${id}`);
    //   await update(dbLikes, likes);
    //   //
    return NextResponse.json({
      status: 200,
      message: "Data saved successfully",
      // body: body,
    });
    // } catch (error) {
    //   return NextResponse.json({
    //     status: 500,
    //     message: "Error saving data ",
    //     error,
    //   });
    // }
    // } catch (error) {
    //   return NextResponse.json({
    //     status: 500,
    //     message: `Error processing request. ${error}`,
    //   });
    // }
  } else {
    return NextResponse.json({
      status: 422,
      message: "Data not saved successfully",
    });
  }
}
