import { handleClear } from "../../button_menu/utils/handler_clear";

interface FetchArticlesFromDbParams {
  article_title?: string;
}
const fetchArticlesFromDb = async ({
  article_title,
}: FetchArticlesFromDbParams = {}) => {
  console.log(
    "Fetching articles from DB at FETCHARTICLECONTENT...",
    article_title,
  );
  const controller = new AbortController();
  const params = article_title
    ? new URLSearchParams({ title: article_title })
    : new URLSearchParams({ type: "all" });

  // This function runs in the browser. Docker service names such as `proxy`
  // are only resolvable from containers, so use the same-origin Next.js API.
  const configuredApiUrl = `/api/articles?${params.toString()}`;

  console.log("API call URL:", configuredApiUrl); // Log the API call URL for debugging

  const response = await fetch(`${configuredApiUrl}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    signal: controller.signal,
  });
  console.log("Response from fetchArticlesFromDb:", response); // Log the response for debugging
  if (!response.ok) {
    throw new Error(
      `Failed to fetch articles from the database, error: ${response.statusText}`,
    );
  }

  const article = await response.json();

  if (article) {
    // Delete the localstorage db and indexdb.
    handleClear();
  }

  console.log("Fetched articles from DB at FETCHARTICLECONTENT:", article); // Log the fetched article for debugging
  return article;

  controller.abort(); // Abort the fetch request if needed
};

export default fetchArticlesFromDb;
