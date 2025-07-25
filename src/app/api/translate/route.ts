import jwt from "jsonwebtoken";
import readLog from "@/services/authentication/read_log";
import allowedOriginsCheck from "@/utils/allowed_origins_check";
import replaceSrcWithImagePlaceholders from "@/utils/dashboard/images_edit/replace_src_on_img";
import { forEach } from "lodash";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  //
  /// Variables.
  const imageUrls: { url: string }[] = [];
  const formData = await request.formData();
  const dbName = formData.get("dbName") as string;
  console.log("at api translate");

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
  const authHeader = request.headers.get("authorization");

  const tokenReceived: string | undefined = authHeader?.split(" ")[1];

  const auth = readLog(tokenReceived ?? "");

  //

  // Upload images and update URLs
  if (auth) {
    ///================================================================
    /// SAVE IMAGE :
    ///================================================================
    console.log("auth approved");

    let pre_images: Array<File> = [];
    const article: Article = {
      id: "",
      title: "",
      article: "",
      images: [],
    };
    const imageFiles: File[] = [];
    let fileName: string = "";

    for (const key of formData.keys()) {
      console.log("images with key", key);

      if (key.startsWith("image")) {
        const fileData = formData.get(key);
        if (fileData instanceof Blob) {
          fileName = fileData.name || key;

          // Convert to File
          const file = new File([fileData], fileName, { type: fileData.type });
          console.log("File created:", file);

          imageFiles.push(file);
        } else {
          const fileData = formData.get(key);
          imageFiles.push(fileData as File);
        }
      }
    }

    if (imageFiles.length > 0) {
      //Filter valid file objects
      console.log("Valid image files found:", imageFiles);
      pre_images = imageFiles.filter(
        (value): value is File => value instanceof File
      );

      await Promise.all(
        pre_images.map(async (item: File) => {
          return new Promise<void>(async (resolve) => {
            ///CLOUDINARY UPLOAD
            //Convert to a buffer stream
            const mimeType = item.type;
            const fileUri = "data:" + mimeType;
            // Get create a place holder for the image URL
            let urlCloudinary: string | undefined = "";
            urlCloudinary = fileUri ? fileUri : "";
            console.log("URL image:", urlCloudinary);

            imageUrls.push({ url: urlCloudinary! });
          });
        })
      ); //     // Update image URL in article content
      // If any images were uploaded, update the article's images array
      if (imageUrls.length > 0) {
        article.images = imageUrls; // Append image URLs to article.images
      }
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
    const sectionData = formData.get("section") as string;
    const sectionObj = JSON.parse(sectionData);
    //
    article.id = idObj;
    article.title = titleObj;
    article.article = bodyObj;
    article.images = imageUrls;
    article.section = sectionObj;
    //

    // SAVE in db.
    const id = article.id;
    const title = article.title;
    let body = article.article;
    let images = article.images;
    let section = article.section;
    //
    console.log("title:", title);
    console.log("body:", body);
    console.log("section:", section);
    console.log("images:", images);

    try {
      // const arrayData = [images, bold, italic];
      const arrayData = [images];
      forEach(arrayData, (value) => {
        if (Array.isArray(value) && value.length === 0) {
          if (value === images) {
            images = [{ url: "nil" }];
          }
        }
      });
      // Replace src of the each image with the corresponded url:
      body = replaceSrcWithImagePlaceholders(body, images);
      console.log("body after replaceSrcWithImagePlaceholders:", body);

      //
      // Example Ollama prompt for translation
      const aiPrompt = `Translate the following text to Spanish: Title{ ${title} } Body{ ${body} } Section{ ${section} }`;
      const url = process.env.SERVER_URL;
      const key = process.env.KEY_AI;
      const token = jwt.sign({ role: "admin" }, key!, { expiresIn: "1h" });
      //
      const newUrl = `${url}${request.url?.replace("/api/ask", "") || ""}`;
      //
      console.log("aiPrompt:", aiPrompt);
      debugger;
      const response = await fetch(`${newUrl}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: process.env.AI_MODEL,
          prompt: aiPrompt,
          stream: false,
        }),
      });
      //
      const data = await response.json();
      return NextResponse.json(data);
    } catch (error) {
      console.error("Error:", error);
      return NextResponse.json({ error: "Failed to translate article" });
    }
  }
}
