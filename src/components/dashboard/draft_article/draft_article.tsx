import MenuContext from "@/components/dashboard/menu/button_menu/context/menu_context";
import { useContext, useEffect, useRef, useState } from "react";
import { ButtonProps } from "../menu/button_menu/type/type_menu_button";
import { handleClick } from "./utils/handle_click";
import draftArticleText from "../../../constants/draft_article_text.json";
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
      sessionStorage.removeItem(`tempTitle-${dbNameToSearch}`);
      sessionStorage.removeItem(`tempBody-${dbNameToSearch}`);
      sessionStorage.removeItem(`articleContent-${dbNameToSearch}`);
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
      <button
        type="button"
        className="w-[40vw] max-w-4xl md:w-[22vw] g:w-[20vw] h-[3dvh] md:h-[5dvh] text-[clamp(0.6rem,0.8rem,1rem)] bg-gray-400 text-black rounded-3xl overflow-hidden whitespace-nowrap text-ellipsis"
        //------------------------------------------
        // Purpose: Wrap the async handleClick function to match the MouseEventHandler signature.
        //------------------------------------------
        onClick={() => {
          handleClick({
            newSavedTitleRef: newSavedTitleRef,
            DRAFT_KEY: DRAFT_KEY,
            savedTitleRef: savedTitleRef,
            savedBodyRef: savedBodyRef,
            setDraftArticleButtonClicked: setDraftArticleButtonClicked,
          });
        }}
      >
        {text}
      </button>
    </div>
  );
};
export default DraftArticle;
