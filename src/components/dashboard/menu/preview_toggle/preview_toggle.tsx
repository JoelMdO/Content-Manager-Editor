import { useContext } from "react";
import { iconsMenu } from "../../../../constants/icons";
import { ButtonProps } from "../button_menu/type/type_menu_button";
import MenuContext from "../button_menu/context/menu_context";
import loadMarkdownArticle from "../../preview/utils/load_markdown_article";
import loadHTMLArticle from "../../preview/utils/load_html_article";

const PreviewToggle = () => {
  // Initialize theme from localStorage or system preference
  const {
    isView,
    setIsView,
    language,
    setArticle,
    setIsLoadingPreview,
    setPreviewReady,
    setIsMarkdownText,
  } = useContext(MenuContext) as ButtonProps;
  //
  // Add a ref to track if this is the initial render

  const loadEditMode = async () => {
    console.log("Switching to Edit mode");
    setIsMarkdownText(true);
    const loadedArticle = await loadHTMLArticle({ language });
    if (loadedArticle) {
      setArticle(loadedArticle);
      setPreviewReady(false);
    }
  };

  const loadPreviewMode = async () => {
    console.log("Switching to Preview mode");
    setIsLoadingPreview(true);
    try {
      const loadedArticle = await loadMarkdownArticle({ language });
      if (loadedArticle) {
        console.log("Loaded Article:", loadedArticle);
        setArticle(loadedArticle);
        setPreviewReady(true);
      }
    } catch (error) {
      console.error("Error loading article:", error);
    } finally {
      setIsLoadingPreview(false);
    }
  };
  //
  const togglePreview = () => {
    const newToggleValue = !isView;
    console.warn("Toggling preview, new value:", newToggleValue);
    setIsView(newToggleValue);

    if (newToggleValue) {
      loadPreviewMode();
    } else {
      loadEditMode();
    }
  };

  return (
    <div>
      <button onClick={togglePreview} type="button" className="cursor-pointer">
        <div
          className={`flex justify-center items-center  h-[20px] md:h-[40px] w-[8em] text-[0.60rem] md:text-base text-center shadow-sm hover:scale-105 transition cursor-pointer shadow-gray-700 dark:shadow-white rounded-3xl bg-gradient-to-r from-blue-800 to-indigo-900`}
        >
          <div
            className={`flex flex-row ml-1 mr-1 rounded-4xl bg-transparent  align-middle justify-center items-center h-[20px] w-[20vw] transform transition-all duration-1000 [cubic-bezier(0.68,-0.6,0.32,1.6)]
            ${
              isView
                ? "translate-x-6 flip-x-180 ease-in"
                : "translate-x-0 rotate-0 ease-in-out"
            } `}
          >
            {/**SUN */}
            {isView ? `${iconsMenu.edit} Edit` : `${iconsMenu.view} Preview`}
          </div>
        </div>
      </button>
    </div>
  );
};

export default PreviewToggle;
