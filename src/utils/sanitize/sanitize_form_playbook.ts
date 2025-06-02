"server-only";
import { isValidUrl } from "./data/valid_url";
import { PlaybookMetaWithUseRecord } from "@/types/plabookMeta_with_useRecord";
import { CodeSnippet } from "@/types/codesnippet";
import { Reference } from "@/types/references";

///========================================================
// Function to sanitize the input data from playbook.
///========================================================

export function sanitizeFormPlaybook(data: PlaybookMetaWithUseRecord): {
  status: number;
  message: PlaybookMetaWithUseRecord;
} {
  const sanitizeString = (str: string | undefined) =>
    typeof str === "string"
      ? str.replace(/</g, "&lt;").replace(/>/g, "&gt;").trim().slice(0, 1000)
      : "";

  const sanitizeArray = (arr: Array<string> | undefined) =>
    Array.isArray(arr)
      ? arr.map((item) => sanitizeString(item)).filter(Boolean)
      : [];

  const sanitizeCodeSnippets = (snippets: CodeSnippet[] | undefined) =>
    Array.isArray(snippets)
      ? snippets
          .filter((s) => typeof s === "object" && s !== null)
          .map(({ language, code }) => ({
            language: sanitizeString(language),
            code: sanitizeString(code).slice(0, 5000), // limit large blobs
          }))
      : [];

  const sanitizeReferences = (references: Reference[] | undefined) =>
    Array.isArray(references)
      ? references
          .filter(
            (r) => typeof r === "object" && r !== null && isValidUrl(r.link)
          )
          .map(({ title, link }) => ({
            title: sanitizeString(title),
            link: link.trim(), // assume valid after filter
          }))
      : [];

  return {
    status: 200,
    message: {
      title: sanitizeString(data.title),
      category: sanitizeString(data.category),
      tags: sanitizeArray(data.tags),
      steps: sanitizeArray(data.steps),
      notes: sanitizeString(data.notes),
      codeSnippets: sanitizeCodeSnippets(data.codeSnippets),
      references: sanitizeReferences(data.references),
      lastUpdated: sanitizeString(data.lastUpdated),
      useRecord: typeof data.useRecord === "number" ? data.useRecord : null,
    },
  };
}
