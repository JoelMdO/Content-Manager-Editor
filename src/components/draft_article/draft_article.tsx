import MenuContext from "@/utils/context/menu_context";
import { useContext, useEffect, useRef } from "react";
import { ButtonProps } from "../Menu/Menu Button/type/type_menu_button";

const DraftArticle = () => {
  //
  // CONTEXT
  //=========================================================
  const { dbNameToSearch, DRAFT_KEY, savedTitleRef, savedBodyRef } = useContext(
    MenuContext
  ) as ButtonProps;
  const newSavedTitleRef = useRef<string>("");
  const newSavedBodyRef = useRef<string>("");
  //
  let text: string = "Without Draft Articles";
  //
  useEffect(() => {
    //
    //--------------------------------------------------------
    // Read the sessionStorage as per the corresponded db.
    //--------------------------------------------------------
    let articleStored: string | null;

    // dbNameToSearch.current =
    //   sessionStorage.getItem("db") || dbNameToSearch.current;
    articleStored = sessionStorage.getItem(`articleContent-${dbNameToSearch}`);
    console.log("Article found in sessionStorage:", articleStored);

    if (!articleStored) {
      //Check localStorage for the article content
      // console.log(
      //   "No article found in sessionStorage, checking localStorage..."
      // );
      //   DRAFT_KEY = `draft-articleContent-${dbNameToSearch.current}`;
      articleStored = localStorage.getItem(DRAFT_KEY);
      //console.log("Article found in localStorage:", articleStored);
    }

    if (articleStored) {
      // console.log("articleStored to savedTitleRef:", articleStored);
      const jsonArticle = JSON.parse(articleStored!);
      newSavedTitleRef.current = jsonArticle[0]?.content || "";
      newSavedBodyRef.current = jsonArticle[2]?.content || "";
      // Remove the sesstion Storage after the page is mounted and if exist the article is created
      sessionStorage.removeItem(`tempTitle-${dbNameToSearch}`);
      sessionStorage.removeItem(`tempBody-${dbNameToSearch}`);
      sessionStorage.removeItem(`articleContent-${dbNameToSearch}`);
      text = savedTitleRef.current;
    }
    console.log("savedTitleRef at Dashboard:", savedTitleRef.current);
    console.log("savedBodyRef at Dashboard:", savedBodyRef.current);
    console.log("text at Dashboard:", text);

    //debugger;
    //
  }, []);
  //
  //--------------------------------------------------------
  // Update UI
  //--------------------------------------------------------
  const handleClick = () => {
    savedTitleRef.current = newSavedTitleRef.current;
    savedBodyRef.current = newSavedBodyRef.current;
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
