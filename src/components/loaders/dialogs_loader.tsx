import { iconsMenu } from "../../constants/icons";
import text from "../../constants/dasboardPage_data_text.json";
import animation from "./style/loader.module.css";
import { subtle } from "crypto";

const DialogsLoader = ({ type }: { type: string }) => {
  // Destructure text object
  const { translation, translation_text, summary, summary_text } =
    text.dashboard;
  //
  let title: string = "";
  let content: string = "";
  let icon: string = "";
  ///--------------------------------------------------------
  // Determine content based on type
  ///--------------------------------------------------------
  switch (type) {
    case "translation":
      title = translation;
      content = translation_text;
      icon = iconsMenu.translate;
      break;
    default:
      title = summary;
      content = summary_text;
      icon = iconsMenu.summary;
      break;
  }
  //if
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
        </div>
      </div>
    </div>
  );
};
export default DialogsLoader;
