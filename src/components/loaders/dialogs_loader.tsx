import { iconsMenu } from "../../constants/icons";
import text from "../../constants/dasboardPage_data_text.json";
import animation from "./style/loader.module.css";
import { useTranslationStore } from "@/store/useTranslationStore";
import { useUIStore } from "@/store/useUIStore";
import { useLoadArticleStore } from "@/store/useLoadArticleStore";
import { translateController } from "../dashboard/menu/button_menu/utils/translate_button_clicked";
// CHANGE LOG
// Changed by : Joel Montes de Oca
// Date       : 2026-08-12
// Reason     : Added dialog for articles loading.
// Impact     : Update data of the dialogs.
//
const DialogsLoader = ({ type }: { type: string }) => {
  // Destructure text object
  const {
    translation,
    translation_text,
    summary,
    summary_text,
    preview,
    preview_text,
    loading_article,
  } = text.dashboard;
  //
  let title: string = "";
  let content: string = "";
  let icon: string = "";
  //
  const setTranslating = useTranslationStore((s) => s.setTranslating);
  const setIsSummary = useUIStore((s) => s.setIsSummary);
  const setLoading = useLoadArticleStore((s) => s.setLoading);
  //
  ///--------------------------------------------------------
  // Determine content based on type
  ///--------------------------------------------------------
  switch (type) {
    case "translation":
      title = translation;
      content = translation_text;
      icon = iconsMenu.translate;
      break;
    case "preview":
      title = preview;
      content = preview_text;
      icon = iconsMenu.preview;
      break;
    case "load_html":
      title = "Loading article...";
      content = "Please wait while we load your article.";
      icon = iconsMenu.preview;
      break;
    case "loading_article":
      title = loading_article;
      content = "Please wait while we load your article.";
      icon = iconsMenu.preview;
      break;
    default:
      title = summary;
      content = summary_text;
      icon = iconsMenu.summary;
      break;
  }
  //
  const closeDialogs = ({ type }: { type: string }) => {
    switch (type) {
      case "translation":
        translateController.abort();
        setTranslating(false);
        break;
      case "loading_article":
        setLoading(false);
        break;
      default:
        setIsSummary(false);
        break;
    }
  };
  //
  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100"
      data-cy="translation-loader"
    >
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full mx-4">
        {/* Main text */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">{title}</h2>
          <p className="text-gray-600 text-sm">{content}</p>
        </div>

        {/* Animated flags container */}
        <div className="flex justify-center items-center space-x-8 h-16">
          {/* Translation icon */}
          <div className="text-2xl  animate-ping">{icon}</div>

          {/* English flag */}
          <div
            className={`text-3xl transform transition-all duration-1000 ease-in-out ${animation.flag}`}
          >
            {iconsMenu.english}
          </div>

          {/* Mexico flag */}
          <div
            className={`text-3xl transform transition-all duration-1000 ease-in-out ${animation.flag_mex}`}
          >
            {iconsMenu.spanish}
          </div>
          <button
            className="mt-4 px-4 py-2 bg-blue-500 text-red rounded hover:bg-blue-600 transition-colors duration-300"
            onClick={() => {
              closeDialogs({ type });
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
export default DialogsLoader;
