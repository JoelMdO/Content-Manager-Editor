import "server-only";
import { NextRequest, NextResponse } from "next/server";
import uploadImagesToCMS from "@/utils/api/save/upload_images_to_CMS";
import allowedOriginsCheck from "@/utils/allowed_origins_check";
import readLog from "@/services/authentication/read_log";
import replaceImgWithSrc from "@/components/dashboard/menu/button_menu/utils/images_edit/replace_img_with_src";
import { ImageData } from "@/utils/api/save/upload_images_to_CMS";

export async function POST(req: NextRequest): Promise<Response> {
  console.error("[SAVE_ROUTE_V4] entered", req.url);
  // {Validate request origin
  try {
    const data = await req.json();
    console.log("data at api/save", data);
    const response = allowedOriginsCheck(req);

    if (response!.status == 403) {
      return NextResponse.json(
        { status: 403, message: "Origin not allowed" },
        { status: 403 },
      );
    }
    //

    // Check if the user is authenticated
    const authHeader = req.headers.get("authorization");

    const tokenReceived: string | undefined = authHeader?.split(" ")[1];

    const auth = readLog(tokenReceived ?? "");
    console.log("api/save authentication", {
      hasAuthorization: Boolean(tokenReceived),
      valid: auth,
    });

    //
    if (auth) {
      // Parse the request body
      console.log("AUTH OK");
      const {
        title,
        body,
        images = [],
        section,
        es_title,
        es_body,
        summary,
        es_summary,
        es_section,
      } = data;
      console.log("title at api/save", title);
      console.log("body at api/save", body);
      console.log("images at api/save", images);
      console.log("section at api/save", section);
      //Retieve the image URLs from the req and upload them to the CMS /images.

      let imageUrls: { url: string; fileId: string }[] = [];
      let updatedBody;
      let updatedEsBody;

      const imagesCheckBase64Empty = images.filter(
        (image: ImageData) =>
          image.type.startsWith("image") && image.base64 !== "",
      );
      const imagesCheckText =
        images === "Body has the images already" ? [images] : images;

      console.log(
        "Without images check",
        imagesCheckBase64Empty.length === 0 ||
          imagesCheckText[0] === "Body has the images already",
      );

      if (
        imagesCheckBase64Empty.length === 0 ||
        imagesCheckText[0] === "Body has the images already"
      ) {
        console.log("No new images to upload, using existing body content");
        updatedBody = body;
        updatedEsBody = es_body;
      } else {
        imageUrls = (await uploadImagesToCMS(images)).map(
          (image: { url: string; image_id: string }) => ({
            url: image.url,
            fileId: image.image_id,
          }),
        );
        console.log("imageUrls at api/save", imageUrls);
        // Update the body content with the uploaded image URLs
        updatedBody = replaceImgWithSrc(body, imageUrls, "save", "en");
        updatedEsBody = replaceImgWithSrc(es_body, imageUrls, "save", "es");
        console.log("updatedBody at api/save", updatedBody);
      }

      // Call the CMS article endpoint
      const configuredApiUrl =
        process.env.URL_API_DECAV || process.env.URL_API_JOE || "";
      const api_call_url = configuredApiUrl.replace(/\/$/, "") + "/";

      if (!configuredApiUrl) {
        throw new Error("CMS article endpoint is not configured");
      }

      console.log("api/save calling CMS article endpoint", {
        configuredApiUrl,
        api_call_url,
      });

      const response = await fetch(api_call_url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Internal-Proxy-Key": process.env.PROXY_KEY || "",
        },
        body: JSON.stringify({
          article_id: title + Date.now(),
          title: title,
          es_title: es_title,
          status: "draft",
          body: updatedBody,
          es_body: updatedEsBody,
          section: section || "",
          es_section: es_section || "",
          summary: summary || "",
          es_summary: es_summary || "",
          // images: [],
        }),
      });
      console.log("api/save downstream RESPONSE", {
        url: api_call_url,
        status: response.status,
        ok: response.ok,
      });
      const responseText = await response.text();
      let downstreamBody: unknown = responseText;
      try {
        downstreamBody = responseText ? JSON.parse(responseText) : null;
      } catch {
        // Preserve non-JSON CMS/proxy responses for diagnostics.
      }

      console.log("api/save downstream RESPONSE", {
        url: api_call_url,
        status: response.status,
        ok: response.ok,
        body: downstreamBody,
      });

      if (!response.ok) {
        return NextResponse.json(
          {
            status: response.status,
            message: "CMS save failed",
            body: downstreamBody,
          },
          { status: response.status },
        );
      }

      return NextResponse.json(
        {
          status: response.status,
          message: "Article saved successfully",
          downstreamStatus: response.status,
          body: downstreamBody,
        },
        { status: response.status },
      );
    } else {
      return NextResponse.json(
        { status: 401, message: "Reauthentication failed" },
        { status: 401 },
      );
    }
  } catch (error) {
    console.error("[SAVE_ROUTE_V4] downstream request failed", error);
    return NextResponse.json(
      {
        status: 500,
        message: `Internal Server Error: ${error}`,
      },
      { status: 500 },
    );
  }
}
