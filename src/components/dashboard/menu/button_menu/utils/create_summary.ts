import callHub from "@/services/api/call_hub";
import getFirstWords from "./get_first_wrods";
import { StorageArticle } from "@/types/storage_item";
export const summaryController = new AbortController();

const createSummary = async ({
  language,
  article,
}: {
  language: string;
  article: StorageArticle[];
}) => {
  //
  // const db = sessionStorage.getItem("db");
  // const articleLocal = localStorage.getItem(`draft-articleContent-${db}`);
  // const articleLocalJson = article.length > 0 ? article : JSON.parse(articleLocal || "[]");
  let title: string = "";
  let body: string = "";

  //
  console.log("at CreateSummary, language:", language);

  switch (language) {
    case "es":
      title =
        article.find((item: StorageArticle) => item.type === "es_title")
          ?.content || "";
      body =
        article.find((item: StorageArticle) => item.type === "es_body")
          ?.content || "";
      break;
    default:
      title =
        article.find((item: StorageArticle) => item.type === "title")
          ?.content || "";
      body =
        article.find((item: StorageArticle) => item.type === "body")?.content ||
        "";
      break;
  }
  //
  console.log("at CreateSummary, title:", title);
  console.log("at CreateSummary, body:", body);
  const response = await callHub(
    "summary",
    {
      title: title,
      body: getFirstWords(body),
      language: language,
    },
    summaryController.signal,
  );
  //
  console.log("at CreateSummary, response:", response);
  if (response.status === 200) {
    const summaryLan = language === "es" ? "es_" : "";
    const summary =
      typeof response.body === "string"
        ? (response.body ?? "No summary generated.")
        : "No summary generated.";
    console.log("at CreateSummary, summary:", summary);
    const summaryKey = `${summaryLan}summary`;
    console.log("at CreateSummary, summaryKey:", summaryKey);
    const updatedArticle = article.filter(
      (item: StorageArticle) => item.type !== summaryKey,
    );
    console.log("at CreateSummary, updatedArticle:", updatedArticle);
    const db = sessionStorage.getItem("db");
    console.log("at CreateSummary, db:", db);
    updatedArticle.push({ type: summaryKey, content: summary });
    console.log("at CreateSummary, updatedArticle after push:", updatedArticle);
    localStorage.setItem(
      `draft-articleContent-${db}`,
      JSON.stringify(updatedArticle),
    );
  }
  return response;
};
export default createSummary;
