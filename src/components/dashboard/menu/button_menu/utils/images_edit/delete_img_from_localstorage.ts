import { deleteBlob } from "@/lib/imageStore/imageStore";
import { ImageItem } from "@/types/image_item";

export function deleteImageFromLocalStorageIndexDB(
  imageIdToRemove: string,
  dbName: string,
) {
  const key = `draft-articleContent-${dbName}`;
  console.log("Deleting image from localStorage", {
    imageIdToRemove,
    dbName,
    key,
  });
  const stored = localStorage.getItem(key);
  if (!stored) return;

  const content = JSON.parse(stored);
  const imageToDelete = content.filter(
    (item: ImageItem) => item.imageId === imageIdToRemove,
  );
  console.log("Image to delete from localStorage", { imageToDelete });
  if (!imageToDelete) return;
  const filtered = content.filter(
    (item: ImageItem) => item.imageId !== imageIdToRemove,
  );
  console.log("Filtered content after deletion", { filtered });
  localStorage.setItem(key, JSON.stringify(filtered));

  deleteBlob(imageIdToRemove);
}
