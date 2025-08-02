import { ButtonProps } from "@/components/dashboard/menu/button_menu/type/type_menu_button";
import MenuContext from "@/components/dashboard/menu/button_menu/context/menu_context";
import { useContext, useEffect, useRef } from "react";

export function useGetInitialArticleDraft() {
  //CONTEXT
  const { savedTitleRef, savedBodyRef, dbNameToSearch, DRAFT_KEY } = useContext(
    MenuContext
  ) as ButtonProps;
  ///
  ///======================================================
  // Check if an article is already created on page load
  // Store articleID in a ref to persist across renders
  ///======================================================
  useEffect(() => {
    let articleStored: string | null = sessionStorage.getItem(
      `articleContent-${dbNameToSearch}`
    );
    // console.log("articleStored from session:", articleStored);

    if (!articleStored) {
      // console.log("DRAFT_KEY:", DRAFT_KEY);

      articleStored = localStorage.getItem(DRAFT_KEY);
      // console.log("articleStored from localStorage:", articleStored);
    }
    if (articleStored) {
      const jsonArticle = JSON.parse(articleStored);
      // console.log("jsonArticle:", jsonArticle);

      savedTitleRef.current =
        jsonArticle.find((item: any) => item.type === "title")?.content || "";
      savedBodyRef.current =
        jsonArticle.find((item: any) => item.type === "body")?.content || "";
      // console.log("savedTitleRef.current:", savedTitleRef.current);
      // console.log("savedBodyRef.current:", savedBodyRef.current);

      sessionStorage.removeItem(`tempTitle-${dbNameToSearch}`);
      sessionStorage.removeItem(`tempBody-${dbNameToSearch}`);
      sessionStorage.removeItem(`articleContent-${dbNameToSearch}`);
    }
  }, [dbNameToSearch, DRAFT_KEY]);

  return { savedTitleRef, savedBodyRef };
}
