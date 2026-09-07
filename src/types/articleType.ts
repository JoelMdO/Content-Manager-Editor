export interface Article {
  id: string;
  title: string;
  es_title?: string;
  body: string;
  es_body?: string;
  category?: string;
  version?: string;
  section?: string;
  es_section?: string;
  sectionCode?: string;
  summary?: string;
  es_summary?: string;
  markdownArticle?: string;
  markdownEsArticle?: string;
  images?: string[]; // Array of image URLs or paths
  metadata?: metadata;
  es_metadata?: metadata;
  created_at?: string;
  updated_at?: string;
  published_at?: string;
}

type metadata = {
  title: string;
  description: string;
  author: string;
  date: string;
  tags: string[];
  category?: string;
  slug: string;
  section?: string;
  section_code?: string;
  published: boolean;
  version: string;
};
