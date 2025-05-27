"server-only";

import { isValidUrl } from "./data/valid_url";

///========================================================
// Function to sanitize the input data from playbook.
///========================================================
interface sanitizeInputProps {
  title: string;
  category: string;
  tags: Array<string>;
  steps: Array<string>;
  notes: string;
  codeSnippets: Array<object>;
  references: Array<object>;
  lastUpdated: string;
  useRecord: number;
}

export function sanitizeFormPlaybook(data: sanitizeInputProps): object {
  const sanitizeString = (str: string) =>
    typeof str === "string"
      ? str.replace(/</g, "&lt;").replace(/>/g, "&gt;").trim().slice(0, 1000)
      : "";

  const sanitizeArray = (arr: any[]) =>
    Array.isArray(arr)
      ? arr.map((item) => sanitizeString(item)).filter(Boolean)
      : [];

  const sanitizeCodeSnippets = (snippets: any[]) =>
    Array.isArray(snippets)
      ? snippets
          .filter((s) => typeof s === "object" && s !== null)
          .map(({ language, code }) => ({
            language: sanitizeString(language),
            code: sanitizeString(code).slice(0, 5000), // limit large blobs
          }))
      : [];

  const sanitizeReferences = (refs: any[]) =>
    Array.isArray(refs)
      ? refs
          .filter(
            (r) => typeof r === "object" && r !== null && isValidUrl(r.url)
          )
          .map(({ label, url }) => ({
            label: sanitizeString(label),
            url: url.trim(), // assume valid after filter
          }))
      : [];
  console.log('"Data at sanitizeFormPlaybook:', data);
  console.log("data title", data.title);

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
