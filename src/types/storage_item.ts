import { ProcessedArticle } from "@/components/dashboard/preview/types/previewed_article";

export type StorageArticle = {
  type: string;
  content?: string;
  imageId?: string;
  fileName?: string;
  blobUrl?: string;
  base64?: string;
};

export type ArticleItem = {
  article_id?: string;
  title?: string;
  body?: string;
  imageId?: string;
  fileName?: string;
  blobUrl?: string;
  base64?: string;
  created_at?: string;
  es_body?: string;
  es_section?: string;
  es_summary?: string;
  es_title?: string;
  id?: string;
  images?: string[];
  published_at?: string | null;
  section?: string;
  status?: string;
  summary?: string;
  updated_at?: string;
};

export type SummaryStorage = {
  summary?: string;
  es_summary?: string;
};

export type ArticleItemOrNull = null | ProcessedArticle;
