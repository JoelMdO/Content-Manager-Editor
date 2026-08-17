// CHANGE LOG
// Changed by : Joel Montes de Oca
// Date       : 2026-08-12
// Reason     : Added dialog for articles loading.
// Impact     : Update data of the dialogs.
//
import { useEditorStore } from "@/store/useEditorStore";
import fetchArticleContentFromDb from "./services/fetch_article_fromDb";
import { useLoadArticleStore } from "@/store/useLoadArticleStore";
import { text } from "@/constants/load_articles.json";
import { handleClick } from "../../draft_article/utils/handle_click";
import { useDraftStore } from "@/store/useDraftStore";
const LoadArticles = ({
  articles,
}: {
  articles: { id: string; title: string }[];
}) => {
  //
  const { setLoading } = useLoadArticleStore.getState();
  //
  return (
    <>
      <div className="flex flex-col gap-y-1 mt-3 pl-6">
        <label htmlFor="articles" className=" text-base text-white">
          {text.load_articles}:
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
              article_title: e.currentTarget.value,
            }).then((response) => {
              console.log("Fetched article content from DB:", response);
              if (response.title) {
                setLoading(false);
                console.log("Setting title and body in editor store:", {
                  title: response.title,
                  body: response.body[0].content,
                });
                useDraftStore
                  .getState()
                  .loadDraftIntoEditor(
                    response.title,
                    response.body[0].content,
                  );
              }
            });
          }}
        >
          <option value="" disabled hidden>
            {text.choose_article}
          </option>
          {articles.map((article: { id: string; title: string }) => (
            <option
              className="font-bold text-base text-black"
              key={article.id}
              value={article.title}
            >
              {article.title.replace(/<\/?p[^>]*>/gi, "").toUpperCase()}
            </option>
          ))}
        </select>
      </div>
    </>
  );
};

export default LoadArticles;
