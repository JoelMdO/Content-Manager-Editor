import MenuContext from "@/utils/context/menu_context";
import { useContext, useEffect, useRef, useState } from "react";
import { ButtonProps } from "../Menu/Menu Button/type/type_menu_button";

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
  } = useContext(MenuContext) as ButtonProps;
  const newSavedTitleRef = useRef<string>("");
  const newSavedBodyRef = useRef<string>("");
  //
  const [text, setText] = useState<string>("Without Draft Articles");
  //
  useEffect(() => {
    //
    //--------------------------------------------------------
    // Read the sessionStorage as per the corresponded db.
    //--------------------------------------------------------
    let articleStored: string | null = sessionStorage.getItem(
      `articleContent-${dbNameToSearch}`
    );
    console.log("articleStored from session at draft article:", articleStored);

    if (!articleStored) {
      console.log("DRAFT_KEY at draft article:", DRAFT_KEY);

      articleStored = localStorage.getItem(DRAFT_KEY);
      console.log(
        "articleStored from localStorage at draft article:",
        articleStored
      );
    }
    if (articleStored) {
      const jsonArticle = JSON.parse(articleStored);
      console.log("jsonArticle at draft article:", jsonArticle);

      newSavedTitleRef.current =
        jsonArticle.find((item: any) => item.type === "title")?.content || "";
      newSavedBodyRef.current =
        jsonArticle.find((item: any) => item.type === "body")?.content || "";
      console.log("savedTitleRef at draftarticle:", newSavedTitleRef.current);
      console.log("savedBodyRef at draftarticle:", newSavedBodyRef.current);
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

    console.log("text at draft article:", text);

    //
  }, [dbNameToSearch, DRAFT_KEY]);
  //
  //--------------------------------------------------------
  // Update UI
  //--------------------------------------------------------
  const handleClick = () => {
    savedTitleRef.current = newSavedTitleRef.current;
    savedBodyRef.current = newSavedBodyRef.current;
    setDraftArticleButtonClicked(true);
  };
  //
  return (
    <div className="flex flex-col mt-2 md:mt-4">
      <h1 className="text-[clamp(0.6rem,1rem,1.5rem)] text-white">
        Draft Article:
      </h1>
      <button
        type="button"
        className="w-[40vw] md:w-[22vw] g:w-[20vw] h-[3dvh] md:h-[5dvh] text-xs md:text-sm g:text-lg bg-gray-400 text-black rounded-3xl"
        onClick={handleClick}
      >
        {text}
      </button>
    </div>
  );
};
export default DraftArticle;
