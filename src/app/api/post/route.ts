import "server-only";
import { database } from "../../../../firebaseMain";
import { databaseDecav } from "../../../../firebaseDecav";
import { ref, update, set } from "firebase/database";
import { NextRequest, NextResponse } from "next/server";
import cloudinary from "../../../lib/cloudinary/cloudinary";
import { forEach } from "lodash";
import replaceSrcWithImagePlaceholders from "../../../utils/dashboard/images_edit/replace_src_on_img";
import allowedOriginsCheck from "@/utils/allowed_origins_check";
import readLog from "../../../services/authentication/read_log";

export async function POST(req: NextRequest): Promise<Response> {
  ///---------------------------------------------------
  /// POST (Save) to database firebase.
  ///---------------------------------------------------
  ///
  /// Variables.
  const imageUrls: { url: string }[] = [];
  console.log("type of req POST", typeof req);
  console.log("req at POST:", req);
  console.log("Content-Type:", req.headers.get("content-type"));
  const formData = await req.formData();
  const dbName = formData.get("dbName") as string;
  interface Article {
    id: string;
    title: string;
    article: string;
    italic: string[];
    bold: string[];
    images?: { url: string }[];
  }
  //
  // {Validate request origin
  const response = allowedOriginsCheck(req);
  console.log("response at allowedorigincheck", response);

  if (response!.status == 403) {
    return NextResponse.json({
      status: 403,
      message: "Origin not allowed",
    });
  }
  //

  // Check if the user is authenticated
  const authHeader = req.headers.get("authorization");
  console.log('"Authorization header at /save/route.ts:', authHeader);

  const tokenReceived: string | undefined = authHeader?.split(" ")[1];
  console.log('"Token received at /save/route.ts:', tokenReceived);

  const auth = readLog(tokenReceived ?? "");
  console.log('"Auth at /save/route.ts:', auth);

  //

  // Upload images and update URLs
  if (auth) {
    ///================================================================
    /// SAVE IMAGE :
    ///================================================================
    let pre_images: Array<File> = [];
    let article: Article = {
      id: "",
      title: "",
      article: "",
      italic: [],
      bold: [],
      images: [],
    };
    const imageFiles: File[] = [];
    let fileName: string = "";

    for (const key of formData.keys()) {
      if (key.startsWith("image")) {
        const fileData = formData.get(key);
        if (fileData instanceof Blob) {
          fileName = fileData.name || key;
          console.log("fileName", fileName);

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
      console.log("files more than 0");

      pre_images = imageFiles.filter(
        (value): value is File => value instanceof File
      );

      await Promise.all(
        pre_images.map(async (item: File) => {
          return new Promise<void>(async (resolve, reject) => {
            ///CLOUDINARY UPLOAD
            //Convert to a buffer stream
            const fileBuffer = await item.arrayBuffer();
            const mimeType = item.type;
            const encoding = "base64";
            const base64Data = Buffer.from(fileBuffer).toString("base64");
            const fileUri =
              "data:" + mimeType + ";" + encoding + "," + base64Data;
            const uploadStream = cloudinary.uploader.upload(
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
                  });
                }
                // Get public URL
                if (result?.secure_url) {
                  // CLOUDINARY URL
                  let urlCloudinary: string | undefined = "";
                  urlCloudinary = result?.secure_url;
                  console.log(
                    "Cloudinary URL at /save/route.ts:",
                    urlCloudinary
                  );

                  imageUrls.push({ url: urlCloudinary! });
                }
                resolve();
              }
            ); //     // Update image URL in article content
            // If any images were uploaded, update the article's images array
            if (imageUrls.length > 0) {
              console.log('"Image URLs at /save/route.ts:', imageUrls);

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
    console.log('"Title data at /save/route.ts:', titleData);

    const titleObj = JSON.parse(titleData);
    console.log('"Title object at /save/route.ts:', titleObj);

    // const titleContent = titleObj.content;
    // console.log('"Title content at /save/route.ts:', titleContent);

    const idData = formData.get("id") as string;
    const idObj = JSON.parse(idData);
    // const idContent = idObj.content;
    const articleData = formData.get("article") as string;

    const bodyObj = JSON.parse(articleData);
    // const bodyContent = bodyObj.content;

    const italicData = formData.get("italic") as string;
    const italicObj = JSON.parse(italicData);
    // const italicContent = italicObj.content;

    const boldData = formData.get("bold") as string;
    const boldObj = JSON.parse(boldData);
    // const boldContent = boldObj.content;

    const dbNameData = formData.get("dbName") as string;
    const dbNameObj = JSON.parse(dbNameData);
    // const dbNameContent = dbNameObj.content;

    //
    article.id = idObj;
    article.title = titleObj;
    article.article = bodyObj;
    article.images = imageUrls;
    article.bold = boldObj;
    article.italic = italicObj;

    // SAVE in db.
    const id = article.id;
    const title = article.title;
    let body = article.article;
    let images = article.images;
    let bold = article.bold;
    let italic = article.italic;
    //

    try {
      const arrayData = [images, bold, italic];
      forEach(arrayData, (value) => {
        if (Array.isArray(value) && value.length === 0) {
          if (value === images) {
            images = [{ url: "nil" }];
          } else if (value === bold) {
            bold = ["nil"];
          } else {
            italic = ["nil"];
          }
        }
      });
      // Replace src of the each image with the corresponded url:
      body = replaceSrcWithImagePlaceholders(body, images);
      // Convert images, bold and italic to object
      function toFirebaseObject(array: any) {
        return array.reduce((obj: any, value: any, index: number) => {
          obj[index] = value;
          return obj;
        }, {});
      }

      const imagesAsObject = toFirebaseObject(images);
      const boldAsObject = toFirebaseObject(bold);
      const italicAsObject = toFirebaseObject(italic);

      const articleData = {
        id: id,
        title: title,
        body: body,
        italic: italicAsObject,
        bold: boldAsObject,
        images: imagesAsObject,
      };
      //
      console.log("article Data at post/route.ts:", articleData);

      // const articleDataJson = JSON.stringify(articleData);
      let db: any;
      if (dbNameObj === "DeCav") {
        db = databaseDecav;
      } else {
        db = database;
      }
      try {
        const dbRef = ref(db, `articles/${id}`);
        await set(dbRef, articleData);

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
