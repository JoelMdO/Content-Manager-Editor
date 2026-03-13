import {
  CloudinaryResource,
  CloudinarySearchResponse,
} from "@/types/cloudinary_type";
import cloudinary from "../../../lib/cloudinary/cloudinary";

async function searchImageByFilename(
  filename: string,
  dbName: string
): Promise<CloudinaryResource | null> {
  try {
    // Extract descriptive part
    const filenameRegex: RegExp = /\d{2}-\d{2}-\d{2}-(.*?)\.webp$/;
    const match = filename.match(filenameRegex);

    if (match) {
      //
      const descriptivePart = match[1];

      // Clean the search term: remove spaces, special chars
      const cleanSearchTerm = descriptivePart
        .replace(/\s+/g, "_") // Replace spaces with underscores
        .replace(/[^\w-]/g, ""); // Remove special characters except underscore and dash

      //console.log("Searching Cloudinary for:", cleanSearchTerm);

      // Option 1: Search by public_id pattern
      const result: CloudinarySearchResponse = await cloudinary.search
        .expression(`folder:"${dbName}"`)
        .max_results(10)
        .execute();
      // Filter results to find exact or partial match
      const matchingResource = result.resources.find(
        (resource: CloudinaryResource) => {
          const publicId = resource.public_id;
          const filename: string = publicId.split("/").pop() || "";

          // Check if the filename contains our search term
          return filename.includes(cleanSearchTerm);
        }
      );

      if (matchingResource) {
        //console.log("Image found via folder search:", matchingResource);
        return matchingResource;
      }
      //
    }
    return null;
  } catch {
    // console.error("Error checking if image exists:", error);
    return null;
  }
}

export default searchImageByFilename;
