import MenuContext from "@/components/dashboard/menu/button_menu/context/menu_context";
import { useContext, useEffect, useRef, useState } from "react";
import { ButtonProps } from "../menu/button_menu/type/type_menu_button";
import { handleClick } from "./utils/handle_click";
import draftArticleText from "../../../constants/draft_article_text.json";
import { iconsMenu } from "../../../constants/icons";
// import replacePlaceholderWithImage from "./menu/button_menu/utils/images_edit/replace_placeholder_with_img";

const DraftArticle = () => {
  //
  // CONTEXT
  //=========================================================
  const {
    dbNameToSearch,
    DRAFT_KEY,
    savedTitleRef,
    savedBodyRef,
    setDraftArticleButtonClicked,
    setText,
    text,
  } = useContext(MenuContext) as ButtonProps;
  const newSavedTitleRef = useRef<string>("");
  // NOT USED const newSavedBodyRef = useRef<string>("");
  //
  //=========================================================
  // Read the if any draft article exists in localStorage
  //=========================================================
  const draftButtons = [
    { tag: "draft-en", icon: iconsMenu.english },
    { tag: "draft-es", icon: iconsMenu.spanish },
  ];

  useEffect(() => {
    //
    const articleStored = localStorage.getItem(DRAFT_KEY);
    // console.log(
    //   "articleStored from localStorage at draft article:",
    //   articleStored
    // );
    //}
    if (articleStored) {
      const jsonArticle = JSON.parse(articleStored);
      // console.log("jsonArticle at draft article:", jsonArticle);

      newSavedTitleRef.current =
        jsonArticle.find((item: any) => item.type === "title")?.content || "";
      // console.log("savedTitleRef at draftarticle:", newSavedTitleRef.current);
      //  console.log("savedBodyRef at draftarticle:", newSavedBodyRef.current);
      //
      setText(newSavedTitleRef.current);
      //
      //sessionStorage.removeItem(`tempTitle-${dbNameToSearch}`);
      //sessionStorage.removeItem(`tempBody-${dbNameToSearch}`);
      //sessionStorage.removeItem(`articleContent-${dbNameToSearch}`);
    } else {
      setText("Without Draft Articles");
    }
    //
  }, [dbNameToSearch, DRAFT_KEY, savedTitleRef]);
  //

  //
  return (
    <div className="flex flex-col mt-2 md:mt-4">
      <h1 className="text-[clamp(0.6rem,1rem,1.5rem)] text-white">
        {draftArticleText.title}
      </h1>
      <div className="flex flex-row items-center w-[40vw] max-w-4xl md:w-[22vw] g:w-[20vw] h-[3dvh] md:h-[5dvh]  bg-gray-400 rounded-3xl ">
        <span className="text-[clamp(0.6rem,0.8rem,1rem)] w-[30vw] max-w-3xl md:w-[14vw] g:w-[14vw] ml-1 text-black overflow-hidden whitespace-nowrap text-ellipsis">
          {text}
        </span>
        {draftButtons.map((button) => (
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
                  newSavedTitleRef: newSavedTitleRef,
                  DRAFT_KEY: DRAFT_KEY,
                  savedTitleRef: savedTitleRef,
                  savedBodyRef: savedBodyRef,
                  setDraftArticleButtonClicked: setDraftArticleButtonClicked,
                  tag: button.tag,
                });
              }}
            >
              <span className="text-2xl flex items-center justify-center">
                {button.icon}
              </span>
            </button>
          </div>
        ))}
        {/* <div className="flex h-[2.5dvh] md:h-[4.5dvh] bg-gray-500 w-[0.7] ml-1 mr-1"></div>
        <button
          type="button"
          className="flex w-15 h-15"
          onClick={() => {
            handleClick({
              newSavedTitleRef: newSavedTitleRef,
              DRAFT_KEY: DRAFT_KEY,
              savedTitleRef: savedTitleRef,
              savedBodyRef: savedBodyRef,
              setDraftArticleButtonClicked: setDraftArticleButtonClicked,
              tag: "draft-es",
            });
          }}
        >
          <span className="text-2xl flex items-center justify-center">
            {iconsMenu.spanish}
          </span>
        </button> */}
      </div>
    </div>
  );
};
export default DraftArticle;
