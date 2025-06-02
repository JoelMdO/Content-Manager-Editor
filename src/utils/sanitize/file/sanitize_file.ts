"server-only";
import sanitizeHtml from "sanitize-html";
import { isValidImage } from "./valid_image";

///========================================================
// Function to sanitize the images.
///========================================================
export async function sanitizeFile(
  file: File
): Promise<{ status: number; message: string }> {
  const allowedTypes = ["image/png", "image/jpeg", "image/gif"];
  const maxSize = 500 * 1024; // 5kB limit
  try {
    if (!allowedTypes.includes(file.type)) {
      return { status: 205, message: "Invalid file type" };
    }
    if (file.size > maxSize) {
      return { status: 205, message: "File too large" };
    }
    // Sanitize the filename (avoid script injection via filename)
    const sanitizedFileName = sanitizeHtml(file.name, {
      allowedTags: [],
      allowedAttributes: {},
    });

    if (sanitizedFileName !== file.name) {
      return { status: 400, message: "Invalid file name" };
    }

    // Ensure it's a valid image by reading its bytes
    const buffer = await file.arrayBuffer(); // Convert File to binary data
    const uint8Array = new Uint8Array(buffer);

    // Basic check: Make sure the file starts with valid image headers
    if (!isValidImage(uint8Array)) {
      return { status: 400, message: "Invalid image content" };
    }
  } catch (error) {
    return { status: 500, message: `Error processing file, ${error}` };
  }

  return { status: 200, message: "File valid" };
}
