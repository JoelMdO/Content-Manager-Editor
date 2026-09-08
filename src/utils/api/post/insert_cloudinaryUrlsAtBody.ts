import cloudinary from "../../../lib/cloudinary/cloudinary";
import { NextResponse } from "next/server";
import replaceSrcWithImagePlaceholdersAtPost from "@/components/dashboard/menu/button_menu/utils/images_edit/replace_src_on_img_at_post";
import { cleanNestedDivsServer } from "@/components/dashboard/utils/clean_content_server";
import { CloudinaryImage } from "@/types/cloudinary_type";

export const insertCloudinaryUrlsatBody = async (
  language: string,
  // formData: FormData,
  bodyContent: string | undefined,
  dbName: string,
): Promise<{ status: string; message: string }> => {
  const imageUrlRegex = /<img[^>]+src="([^">]+)"/g;
  const imageUrlRegexCloudinaryMatch =
    /<img\b[^>]*\bsrc=(["'])(https:\/\/res\.cloudinary\.com\/[^"']+)\1[^>]*>/gi;
  // const bodyContent = formData.get(
  //   language === "en" ? "body" : "es_body",
  // ) as string;

  let match: RegExpExecArray | null;
  let cleanedBody: string = "";
  let updatedBodyContent = bodyContent!;
  const prematch = imageUrlRegexCloudinaryMatch.exec(bodyContent!);
  if (prematch) {
    console.log("/// Found Cloudinary image in body: ///", prematch[2]);
    return { status: "200", message: bodyContent! };
  }

  // Search in English body
  while ((match = imageUrlRegex.exec(bodyContent!)) !== null) {
    const imageUrl = match[1];
    const uploadFileName = imageUrl.split("/").pop() || "";
    const url = process.env.URL_IMAGES_STORE || "";

    const response = await fetch(
      `${url}?image_url=${encodeURIComponent(imageUrl)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-Internal-Proxy-Key": process.env.PROXY_KEY || "",
        },
      },
    );

    console.log("Fetching image from internal store:", {
      imageUrl,
      uploadFileName,
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      return {
        status: "400",
        message: `Failed to fetch image from internal store: ${response.status}${errorText ? ` - ${errorText}` : ""}`,
      };
    }

    const data = await response.json();
    console.log("Response from internal store:", data);

    // const base64 = await toBase64(data.image_base64_url.file_url);
    // const base64Data = base64;
    // console.log(
    //   "Base64 data for Cloudinary upload:",
    //   data.image_base64_url.base64,
    // );
    const base64Data = data.image_base64_url?.base64;
    const image_id = data.image_base64_url?.image_id;
    const file_name = data.image_base64_url?.file_name;
    let newCloudinaryImage: { url: string; fileId: string } = {
      url: "",
      fileId: "",
    };

    const newImageUrl: CloudinaryImage = await new Promise<CloudinaryImage>(
      (resolve: (value: CloudinaryImage) => void, reject) => {
        cloudinary.uploader.upload(
          base64Data,
          {
            invalidate: true,
            resource_type: "auto",
            public_id: image_id,
            folder: dbName,
          },
          (uploadError, result) => {
            if (uploadError || !result) {
              // Handle upload error
              reject(uploadError ?? new Error("No upload result returned"));
              return;
            }
            resolve(result as unknown as CloudinaryImage); // Resolve the promise with the result
          },
        );
      },
    );

    newCloudinaryImage = {
      url: newImageUrl?.secure_url as string,
      fileId: file_name,
    };

    console.log("New Cloudinary image:", newCloudinaryImage);

    const bodyWithCloudinaryUrls = replaceSrcWithImagePlaceholdersAtPost(
      updatedBodyContent,
      newCloudinaryImage,
    );
    updatedBodyContent = bodyWithCloudinaryUrls;
    console.log(
      `Updated ${language} body with Cloudinary URLs:`,
      bodyWithCloudinaryUrls,
    );

    cleanedBody = cleanNestedDivsServer(bodyWithCloudinaryUrls);
    console.log(`==== Cleaned ${language} body: ====`, cleanedBody);
  }
  return { status: "200", message: cleanedBody };
};
