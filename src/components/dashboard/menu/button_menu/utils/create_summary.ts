import callHub from "@/services/api/call_hub";
import getFirstWords from "./get_first_wrods";
import { StorageItem } from "@/types/storage_item";

const createSummary = async ({ language }: { language: string }) => {
  //
  const db = sessionStorage.getItem("db");
  const articleLocal = localStorage.getItem(`draft-articleContent-${db}`);
  const articleLocalJson = JSON.parse(articleLocal || "[]");
  let title: string = "";
  let body: string = "";
  //
  //console.log("at CreateSummary, language:", language);

  switch (language) {
    case "es":
      title = articleLocalJson.find(
        (item: StorageItem) => item.type === "es-title"
      )?.content || "";
      body = articleLocalJson.find(
        (item: StorageItem) => item.type === "es-body"
      )?.content || "";
      break;
    default:
      title = articleLocalJson.find(
        (item: StorageItem) => item.type === "title"
      )?.content || "";
      body = articleLocalJson.find(
        (item: StorageItem) => item.type === "body"
      )?.content || "";
      break;
  }
  //
  const response = await callHub("summary", {
    title: title,
    body: getFirstWords(body),
    language: language,
  });
  //
  if (response.status === 200) {
    const summaryLan = language === "es" ? "es-" : "";
    const summary = (response.body as StorageItem) || "";
    const summaryKey = `${summaryLan}summary`;
    const updatedArticle = articleLocalJson.filter(
      (item: StorageItem) => item.type !== summaryKey,
    );
    updatedArticle.push({ type: summaryKey, content: summary });
    localStorage.setItem(
      `draft-articleContent-${db}`,
      JSON.stringify(updatedArticle)
    );
  }
  return response;
};
export default createSummary;
