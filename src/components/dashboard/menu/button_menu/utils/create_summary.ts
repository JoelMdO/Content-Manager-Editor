import callHub from "@/services/api/call_hub";
import getFirstWords from "./get_first_wrods";
import { StorageItem } from "@/types/storage_item";

const createSummary = async ({ language }: { language: string }) => {
  //
  const db = sessionStorage.getItem("db");
  const article = sessionStorage.getItem(`articleContent-${db}`);
  const articleLocal = localStorage.getItem(`draft-articleContent-${db}`);
  const articleJson = JSON.parse(article || "{}");
  const articleLocalJson = JSON.parse(articleLocal || "{}");
  let title: string = "";
  let body: string = "";
  //
  //console.log("at CreateSummary, language:", language);

  switch (language) {
    case "es":
      title = articleLocalJson.find(
        (item: StorageItem) => item.type === "es-title"
      ).content;
      body = articleLocalJson.find(
        (item: StorageItem) => item.type === "es-body"
      ).content;
      break;
    default:
      title = articleJson.find(
        (item: StorageItem) => item.type === "title"
      ).content;
      body = articleJson.find(
        (item: StorageItem) => item.type === "body"
      ).content;
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
    //Store summary in sessionStorage and localStorage
    articleJson.push({ type: `${summaryLan}summary`, content: summary });
    sessionStorage.setItem(`articleContent-${db}`, JSON.stringify(articleJson));
    articleLocalJson.push({ type: `${summaryLan}summary`, content: summary });
    localStorage.setItem(
      `draft-articleContent-${db}`,
      JSON.stringify(articleLocalJson)
    );
  }
  return response;
};
export default createSummary;
