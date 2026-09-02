import { ArticleItem } from "@/types/storage_item";
import { handleClear } from "../../button_menu/utils/handler_clear";

interface FetchArticlesFromDbParams {
  article_title?: string;
  type?: string;
}

const fetchArticlesFromDb = async ({
  article_title,
  type,
}: FetchArticlesFromDbParams = {}): Promise<ArticleItem[]> => {
  const controller = new AbortController();
  const params = article_title
    ? new URLSearchParams({ title: article_title })
    : new URLSearchParams({ type: "all" });

  const response = await fetch(`/api/articles?${params.toString()}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    signal: controller.signal,
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch articles from the database, error: ${response.statusText}`,
    );
  }

  const articles = await response.json();
  console.log("Fetched articles from DB:", articles);
  console.log("Fetched articles from DB (TYPE):", typeof articles);

  if (articles && typeof window !== "undefined") {
    const dbName = sessionStorage.getItem("db");
    console.log("Type of dbName:", typeof dbName, "Value of dbName:", dbName);
    if (type === "single" && dbName) {
      handleClear();
      console.log("Storing single article in localStorage for dbName:", dbName);
      const newArticle = Object.entries(articles as ArticleItem[]).map(
        ([key, article]: [string, ArticleItem]) => ({
          type: key,
          content: article,
        }),
      );
      console.log(
        "New article array to be stored in localStorage:",
        newArticle,
      );
      localStorage.setItem(
        `draft-articleContent-${dbName}`,
        JSON.stringify(newArticle),
      );
    }
  }

  return articles;
};

export default fetchArticlesFromDb;
