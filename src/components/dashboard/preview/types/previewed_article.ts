export interface AuthorInfo {
  name: string;
  bio: string;
}

export interface CDNImage {
  originalSrc: string;
  optimizedSrc: string;
  alt: string;
  caption: string;
  type: "markdown" | "html";
  position: number;
}

export interface SEOData {
  description: string;
  keywords: string[];
}
//
export interface ProcessedArticle {
  slug?: string;
  title?: string;
  section?: string;
  section_code?: string;
  author?: AuthorInfo;
  publishDate?: string;
  readTime?: number;
  views?: number;
  tags?: string[];
  featured?: boolean;
  seo?: SEOData;
  content?: string;
  rawContent?: string;
  images?: CDNImage[];
  image?: string;
  createdAt?: string;
  published?: boolean;
  updatedAt?: string;
  timeToRead?: number;
}
