import { StorageArticle } from "@/types/storage_item";

export function readDraftTitle(rawArticle: string): string {
  let parsed: unknown;

  try {
    parsed = JSON.parse(rawArticle);
  } catch {
    return "";
  }

  if (Array.isArray(parsed)) {
    // console.log("[readDraftTitle] parsed is an array:", parsed);
    const titleItem = parsed.find(
      (item: StorageArticle) => item?.type === "title",
    );
    //  console.log("[readDraftTitle] titleItem:", titleItem);
    return typeof titleItem?.content === "string" ? titleItem.content : "";
  }

  if (parsed !== null && typeof parsed === "object") {
    // console.log("[readDraftTitle] parsed is an object:", parsed);
    const article = Object.values(parsed);
    // console.log("[readDraftTitle] article:", article);
    const title = article.find(
      (item: StorageArticle) => item?.type === "title",
    )?.content;
    // console.log("[readDraftTitle] title:", title);
    return typeof title === "string" ? title : "";
  }

  // console.warn(
  //   "[readDraftTitle] parsed is neither an array nor an object:",
  //   parsed,
  // );
  return "";
}
