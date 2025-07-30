import { iconsMenu } from "../../constants/icons";
import text from "../../constants/dasboardPage_data_text.json";
import animation from "./style/loader.module.css";

const TranslationLoader = () => {
  // Destructure text object
  const { translation, translation_text } = text.dashboard;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full mx-4">
        {/* Main text */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            {translation}
          </h2>
          <p className="text-gray-600 text-sm">{translation_text}</p>
        </div>

        {/* Animated flags container */}
        <div className="flex justify-center items-center space-x-8 h-16">
          {/* Translation icon */}
          <div className="text-2xl  animate-ping">{iconsMenu.translate}</div>

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
export default TranslationLoader;
