import { useDraftStore } from "@/store/useDraftStore";
import { StorageArticle } from "@/types/storage_item";

export const loadTranslatedDraftIntoEditor = (dbName: string): void => {
  let articleContent: StorageArticle[] = [];

  try {
    articleContent = JSON.parse(
      localStorage.getItem(`draft-articleContent-${dbName}`) || "[]",
    ) as StorageArticle[];
  } catch {
    articleContent = [];
  }

  const title =
    articleContent.find((item) => item.type === "es_title")?.content ?? "";
  const body =
    articleContent.find((item) => item.type === "es_body")?.content ?? "";

  useDraftStore.getState().loadDraftIntoEditor(title, body);
};
