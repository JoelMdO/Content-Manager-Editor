import MenuContext from "@/components/dashboard/menu/button_menu/context/menu_context";
import { useContext } from "react";
import { ButtonProps } from "../menu/button_menu/type/type_menu_button";
import { handleClick } from "../draft_article/utils/handle_click";
import { iconsMenu } from "../../../constants/icons";

const LanguageSwitcher = () => {
  //
  // CONTEXT
  //=========================================================
  const { setLanguage, language, setArticle } = useContext(
    MenuContext
  ) as ButtonProps;
  //
  //=========================================================
  // Switch the preview article on the selected language
  //=========================================================
  const previewButtons = [
    { tag: "preview-en", icon: iconsMenu.english },
    { tag: "preview-es", icon: iconsMenu.spanish },
  ];

  //
  //
  return (
    <>
      {previewButtons.map((button) => (
        <div key={button.tag} className="flex flex-row items-center">
          <div className="flex h-[2.5dvh] md:h-[4.5dvh] bg-gray-500 w-[0.7] ml-1 mr-1"></div>
          <button
            type="button"
            className="flex w-5 h-5 mr-2"
            //------------------------------------------
            // Purpose: handleClick function to retrieve the draft language article.
            //------------------------------------------
            onClick={() => {
              handleClick({
                tag: button.tag,
                setLanguage: setLanguage,
                language: language,
                setArticle: setArticle,
              });
            }}
          >
            <span className="text-2xl flex items-center justify-center">
              {button.icon}
            </span>
          </button>
        </div>
      ))}
    </>
  );
};
export default LanguageSwitcher;
