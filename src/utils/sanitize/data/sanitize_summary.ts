import { dataType } from "@/types/dataType";

// Decode common HTML entities and remove dangerous tags while preserving line breaks
const decodeAndClean = (text: string): string => {
  if (typeof text !== "string") return text;

  const decoded = text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");

  // Remove script/style/iframe/object tags and their content
  const withoutDanger = decoded
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
    .replace(/<iframe[\s\S]*?>[\s\S]*?<\/iframe>/gi, "")
    .replace(/<object[\s\S]*?>[\s\S]*?<\/object>/gi, "");

  // Keep <br> as newlines, remove other tags but keep their inner text
  const withLineBreaks = withoutDanger.replace(/<br\s*\/?\s*>/gi, "\n");
  const stripped = withLineBreaks.replace(/<[^>]+>/g, "");

  // collapse multiple newlines
  return stripped.replace(/\n{3,}/g, "\n\n").trim();
};

export const sanitizeSummary = (data: dataType): dataType => {
  // Narrow to object with title/body if possible
  if (!data || typeof data !== "object") return data;

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const title = (data as any).title;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const body = (data as any).body;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const language = (data as any).language;

  return {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    title: typeof title === "string" ? decodeAndClean(title) : title,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    body: typeof body === "string" ? decodeAndClean(body) : body,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    language: typeof language === "string" ? language.toLowerCase() : language,
  } as dataType;
};

// Sanitize a single item like { type, content, lan }
export const sanitizeItem = <
  T extends { type?: string; content?: any; lan?: string }
>(
  item: T
): T => {
  if (!item || typeof item.content !== "string") return item;
  const cleaned = decodeAndClean(item.content as string);
  return { ...item, content: cleaned } as T;
};

// Update an articleContent array stored in sessionStorage safely.
export const updateSessionArticleContent = (
  dbName: string | null,
  newItem: { type: string; content: string; lan?: string }
) => {
  if (!dbName) return;
  const key = `articleContent-${dbName}`;
  const raw = sessionStorage.getItem(key);
  let arr: any[] = [];
  try {
    arr = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(arr)) arr = [];
  } catch (e) {
    arr = [];
  }

  const idx = arr.findIndex((it: any) => {
    if (!it) return false;
    if (it.type !== newItem.type) return false;
    if (newItem.lan) return it.lan === newItem.lan;
    return true;
  });

  if (idx >= 0) {
    arr[idx] = { ...arr[idx], content: newItem.content };
  } else {
    arr.push(newItem);
  }

  sessionStorage.setItem(key, JSON.stringify(arr));
};

export default sanitizeSummary;
