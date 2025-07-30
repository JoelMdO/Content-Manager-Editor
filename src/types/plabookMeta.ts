import { Reference } from "./references";
import { CodeSnippet } from "./codesnippet";

export interface PlaybookMeta {
  id?: string;
  title: string;
  category: string;
  tags: string[];
  notes: string;
  lastUpdated?: string;
  steps?: string[];
  codeSnippets?: CodeSnippet[];
  references?: Reference[];
  body?: string;
  section?: string;
}
