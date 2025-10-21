import { ProcessedArticle } from "@/components/dashboard/preview/types/previewed_article";

export interface StorageItem {
  type: string;
  content: string | null;
  // Add other fields if needed
}

export type StorageItemOrNull = null | ProcessedArticle;
