import "server-only";
import { database } from "../../../../firebaseMain";
import { databaseDecav } from "../../../../firebaseDecav";
import { Database, ref, set, update } from "firebase/database";
import { NextRequest, NextResponse } from "next/server";
import cloudinary from "../../../lib/cloudinary/cloudinary";
import { forEach } from "lodash";
import replaceSrcWithImagePlaceholders from "../../../utils/dashboard/images_edit/replace_src_on_img";
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

  interface Article {
    id: string;
    title: string;
    article: string;
    // italic: string[];
    // bold: string[];
    images?: { url: string }[];
    category?: string;
    version?: string;
    section?: string;
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

  // Check if the user is authenticated
  const authHeader = req.headers.get("authorization");

  const tokenReceived: string | undefined = authHeader?.split(" ")[1];

  const auth = readLog(tokenReceived ?? "");

  //

  // Upload images and update URLs
  if (auth) {
    ///================================================================
    /// SAVE IMAGE :
    ///================================================================

    let pre_images: Array<File> = [];
    const article: Article = {
      id: "",
      title: "",
      article: "",
      // italic: [],
      // bold: [],
      images: [],
    };
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
    const idData = formData.get("id") as string;
    const idObj = JSON.parse(idData);
    const articleData = formData.get("article") as string;
    const bodyObj = JSON.parse(articleData);
    // const italicData = formData.get("italic") as string;
    // const italicObj = JSON.parse(italicData);
    // const boldData = formData.get("bold") as string;
    // const boldObj = JSON.parse(boldData);
    const dbNameData = formData.get("dbName") as string;
    const dbNameObj = JSON.parse(dbNameData);
    // // TODO check
    // const categoryData = formData.get("category") as string;
    // const categoryObj = JSON.parse(categoryData);
    // const versionData = formData.get("version") as string;
    // const versionObj = JSON.parse(versionData);
    const sectionData = formData.get("section") as string;
    const sectionObj = JSON.parse(sectionData);
    //
    article.id = idObj;
    article.title = titleObj;
    article.article = bodyObj;
    article.images = imageUrls;
    // article.bold = boldObj;
    // article.italic = italicObj;
    // article.category = categoryObj;
    // article.version = versionObj;
    article.section = sectionObj;
    //

    // SAVE in db.
    const id = article.id;
    const title = article.title;
    let body = article.article;
    let images = article.images;
    // let bold = article.bold;
    // let italic = article.italic;
    // let category = article.category;
    // let version = article.version;
    let section = article.section;
    //

    try {
      // const arrayData = [images, bold, italic];
      const arrayData = [images];
      forEach(arrayData, (value) => {
        if (Array.isArray(value) && value.length === 0) {
          if (value === images) {
            images = [{ url: "nil" }];
            // } else if (value === bold) {
            //   bold = ["nil"];
            // } else {
            //   italic = ["nil"];
          }
        }
      });
      // Replace src of the each image with the corresponded url:
      body = replaceSrcWithImagePlaceholders(body, images);
      // Convert images, bold and italic to object
      // function toFirebaseObject<T extends string | { url: string }>(
      //   array: T[]
      // ): Record<number, T> {
      //   return array.reduce(
      //     (obj: Record<number, T>, value: T, index: number) => {
      //       obj[index] = value;
      //       return obj;
      //     },
      //     {}
      //   );
      // }

      // const imagesAsObject = toFirebaseObject(images);
      // const boldAsObject = toFirebaseObject(bold);
      // const italicAsObject = toFirebaseObject(italic);
      //
      ///--------------------------------------------------------
      // Find Category and Section Code
      ///--------------------------------------------------------
      const category = sectionsCode[dbNameObj].find(
        (item) => item.label === section
      );
      ///--------------------------------------------------------
      // Convert HTML to Markdown
      ///--------------------------------------------------------
      const markdownContent = convertHtmlToMarkdown(body, {
        preserveWhitespace: false, // Clean up extra whitespace
        includeImageAlt: true, // Include alt text for images
        preserveImageDimensions: true, // Keep image dimensions as comments
        convertTables: true, // Convert HTML tables to markdown
        preserveLineBreaks: true, // Keep line breaks as they are
      });
      //
      console.log("markdownContent:", markdownContent);
      ///--------------------------------------------------------
      // Select the correct database to save the article
      ///--------------------------------------------------------
      //
      let db: Database;
      let author: string;
      //
      if (dbNameObj === "DeCav") {
        db = databaseDecav;
        author = process.env.AUTHOR_DECAV || "Default Author";
      } else {
        db = database;
        author = process.env.AUTHOR || "Default Author";
      }
      ///--------------------------------------------------------
      // Create Metadata Object
      ///--------------------------------------------------------
      const metadata = {
        author: author,
        category: category,
        date: new Date().toISOString(),
        description: markdownContent.slice(0, 150), // Get first 150 chars as description
        published: true,
        tags: [],
        title: title,
      };
      //
      const articleData = {
        id: id,
        en: markdownContent, //TODO to english
        es: markdownContent, //TODO to spanish
        metadata: metadata,
      };
      //
      ///--------------------------------------------------------
      // Obtain section code
      ///--------------------------------------------------------
      let sectionCode: string = "";
      if (section && sectionsCode.hasOwnProperty(dbNameObj)) {
        sectionCode =
          sectionsCode[dbNameObj].find(
            (sectionCode) => sectionCode.label === section
          )?.code || "";
      }
      //
      const articlesMenu = {
        id: id,
        en: {
          published: true,
          resume: markdownContent.slice(0, 150),
          title: title,
        }, //TODO to english
        es: {
          published: true,
          resume: markdownContent.slice(0, 150),
          title: title,
        }, //TODO to spanish
        section: section,
        section_code: sectionCode,
        slug: id,
      };
      //
      const likes = {
        id: id,
        likes: 0,
      };
      // const articleData = {
      //   id: id,
      //   title: title,
      //   body: body,
      //   italic: italicAsObject,
      //   bold: boldAsObject,
      //   images: imagesAsObject,
      // };
      try {
        const dbRef = ref(db, `articles/${id}`);
        await set(dbRef, articleData);
        //
        const dbRefMenu = ref(db, `articles_menu/${id}`);
        await set(dbRefMenu, articlesMenu);
        //
        const dbLikes = ref(db, `likes/${id}`);
        await update(dbLikes, likes);
        //
        return NextResponse.json({
          status: 200,
          message: "Data saved successfully",
          body: body,
        });
      } catch (error) {
        return NextResponse.json({
          status: 500,
          message: "Error saving data ",
          error,
        });
      }
    } catch (error) {
      return NextResponse.json({
        status: 500,
        message: `Error processing request. ${error}`,
      });
    }
  } else {
    return NextResponse.json({
      status: 422,
      message: "Data not saved successfully",
    });
  }
}
