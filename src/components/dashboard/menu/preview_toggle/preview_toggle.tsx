import { useContext, useEffect } from "react";
import { iconsMenu } from "../../../../constants/icons";
import { ButtonProps } from "../button_menu/type/type_menu_button";
import MenuContext from "../button_menu/context/menu_context";
import loadArticle from "../../preview/utils/load_article";

const PreviewToggle = () => {
  // Initialize theme from localStorage or system preference
  const {
    isView,
    setIsView,
    language,
    setArticle,
    setIsLoadingPreview,
    setPreviewReady,
  } = useContext(MenuContext) as ButtonProps;
  //
  const loadPreview = async () => {
    if (!isView) {
      console.log("Switching to Edit mode, disabling preview");
      setPreviewReady(false);
      return;
    }
    // If switching to preview mode, load the article
    console.log("Switching to Preview mode, loading article");
    setIsLoadingPreview(true);
    try {
      const loadedArticle = await loadArticle({ language });
      if (loadedArticle) {
        console.log("Loaded Article:", loadedArticle);

        setArticle(loadedArticle);
        setPreviewReady(true);
        setIsLoadingPreview(false);
      }
    } catch (error) {
      console.error("Error loading article:", error);
    }
  };
  //
  useEffect(() => {
    loadPreview();
  }, [isView]);
  //
  const togglePreview = () => {
    setIsView((prev) => !prev);
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
