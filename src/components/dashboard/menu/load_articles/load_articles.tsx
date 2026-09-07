// CHANGE LOG
// Changed by : Joel Montes de Oca
// Date       : 2026-08-12
// Reason     : Added dialog for articles loading.
// Impact     : Update data of the dialogs.
//
import fetchArticleContentFromDb from "./services/fetch_article_fromDb";
import { useLoadArticleStore } from "@/store/useLoadArticleStore";
import text from "@/constants/load_articles.json";
import { useDraftStore } from "@/store/useDraftStore";
import { ArticleItem } from "@/types/storage_item";
const LoadArticles = ({ articles }: { articles: ArticleItem[] }) => {
  //
  const { setLoading } = useLoadArticleStore.getState();
  // const setArticleStored = useDraftStore.getState().setArticleStored;
  let articleTitle: string, articleBody: string, articleId: string;
  //
  return (
    <>
      <div className="flex flex-col gap-y-1 mt-3 pl-6">
        <label htmlFor="articles" className=" text-base text-white">
          {text.load_text.load_articles}:
        </label>
        <select
          id="articles"
          defaultValue=""
          className="flex justify-center items-center bg-transparent border border-gray-500 rounded p-2 w-80 h-50"
          onChange={(e) => {
            e.preventDefault();
            console.log("OnClick Articles");
            setLoading(true);
            fetchArticleContentFromDb({
              type: "single",
              article_title: e.currentTarget.value,
            }).then((response) => {
              console.log("Fetched article content from DB:", response);
              const article = response as ArticleItem | undefined;
              console.log("Article content type:", typeof article);
              console.log("Article from response[0]:", article);
              if (article) {
                setLoading(false);
                articleTitle = article?.title ?? "";
                articleBody = article.body ?? "";
                console.log("Setting title and body in editor store:", {
                  articleTitle,
                  articleBody,
                });
                articleId = article?.id ?? "";
                console.log("Setting title, body, and ID in editor store:", {
                  articleTitle,
                  articleBody,
                  articleId,
                });
                useDraftStore
                  .getState()
                  .loadDraftIntoEditor(articleTitle, articleBody);
                // setArticleStored(true);
              }
            });
          }}
        >
          <option value="" disabled hidden>
            {text.load_text.choose_article}
          </option>
          {articles.map((article: ArticleItem) => (
            <option
              className="font-bold text-base text-black"
              key={article.id}
              value={article.title}
            >
              {article.title?.replace(/<\/?p[^>]*>/gi, "").toLocaleUpperCase()}
            </option>
          ))}
        </select>
      </div>
    </>
  );
};

export default LoadArticles;
