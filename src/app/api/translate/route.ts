import jwt from "jsonwebtoken";
import readLog from "@/services/authentication/read_log";
import allowedOriginsCheck from "@/utils/allowed_origins_check";
import replaceSrcWithImagePlaceholders from "@/utils/dashboard/images_edit/replace_src_on_img";
import { forEach } from "lodash";
import { NextRequest, NextResponse } from "next/server";
import https from "https";
import { getToken, JWT } from "next-auth/jwt";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/nextauth/auth";

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
  const tokenReceived = formData.get("token") as string;
  const auth = readLog(tokenReceived ?? "");

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
            resolve();
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

    console.log("title:", title);
    console.log("body:", body);
    console.log("section:", section);
    console.log("images:", images);

    try {
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

      // //
      // // Example Ollama prompt for translation
      // VER PREV const aiPrompt = `Translate the following text to Spanish: Title{ ${title} } Body{ ${body} } Section{ ${section} }`;
      const url = process.env.SERVER_URL;

      ///--------------------------------------------------------
      // Get the Google access token from next-auth
      ///--------------------------------------------------------

      const authHeader = request.headers.get("authorization");
      const tokenG: JWT | string | undefined | null = authHeader?.split(" ")[1];

      if (!tokenG) {
        return NextResponse.json({ status: 401, error: "Unauthorized" });
      }
      console.log("token:", tokenG);

      const newUrl = `${url}${request.url?.replace("/ai", "") || ""}`;
      // TESTING newUrl: https://localhost:443/ai/ask/askhttp://localhost:8000/api/translate
      // TESTING const newUrl = `https://localhost:443/ask/ask`;
      // TESTING  console.log("newUrl:", newUrl);
      // TESTING const agent = new https.Agent({
      // TESTING rejectUnauthorized: false, // Accept self-signed certificates //TODO delete this line in production
      // TESTING });
      //
      //console.log("aiPrompt:", aiPrompt);
      // TESTING process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";

      // TESTING const fetch = (await import("node-fetch")).default;
      const response = await fetch(`${newUrl}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${tokenG}`,
          "Content-Type": "application/json",
          "X-Request-Type": "translation",
          "X-Service": "cms-translate",
          "X-Source-DB": dbName,
        },
        body: JSON.stringify({
          // model: process.env.AI_MODEL,
          // prompt: aiPrompt,
          // stream: false,
          // source_service: "cms",
          // request_type: "translation",
          title: `${title}`,
          body: `${body}`,
          section: `${section}`,
          target_language: `Spanish`,
        }),
        // TESTING agent: agent,
      });
      // //
      console.log("response:", response);

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error:", errorText);

        return NextResponse.json({
          status: 200,
          error: `API returned ${response.status}: ${errorText}`,
        });
      }

      const data = await response.json();
      console.log("Response from AI:", data);
      // const data = {
      //   translated_text: {
      //     title: "Artículo de Prueba",
      //     body: '<div>Hola a todos! Hoy vamos a explorar un concepto fascinante: la entanglement cuántica.<span font-style="bold">La entanglement.</span><div>Es un fenómeno en el que dos o más partículas se unen de manera que compartan su mismo destino, independientemente de la distancia a la que estén separadas.</div></div><br /><div>Esta idea podría parecer un poco compleja al principio, pero vamos a desglosarla paso a paso. Nuestro objetivo es entender cómo funciona esta increíble conexión y sus posibles implicaciones para las tecnologías del futuro, desde ordenadores super-rápidos hasta nuevas formas de comunicación segura.</div><br /><div>Esta idea podría parecer un poco compleja al principio, pero vamos a desglosarla paso a paso. Nuestro objetivo es entender cómo funciona esta increíble conexión y sus posibles implicaciones para las tecnologías del futuro, desde ordenadores super-rápidos hasta nuevas formas de comunicación segura.</div>',
      //     section: "Reglas importantes:",
      //   },
      //   success: true,
      //   model_used: "llama3.2",
      // };

      return NextResponse.json({
        status: 200,
        message: "Data translated successfully",
        body: data,
      });
    } catch (error) {
      console.error("Error:", error);
      return NextResponse.json({
        status: 500,
        error: "Failed to translate article",
      });
    }
  }
}
