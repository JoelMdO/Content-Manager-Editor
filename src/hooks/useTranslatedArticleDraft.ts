import { ButtonProps } from "@/components/Menu/Menu Button/type/type_menu_button";
import MenuContext from "@/utils/context/menu_context";
import { useContext, useEffect, useRef } from "react";

export function useTranslatedArticleDraft() {
  //CONTEXT
  const { savedTitleRef, savedBodyRef, dbNameToSearch, DRAFT_KEY } = useContext(
    MenuContext
  ) as ButtonProps;
  ///
  ///======================================================
  // For rerendering on translation, you can expose a reload function:
  ///======================================================
  useEffect(() => {
    let articleStored: string | null = sessionStorage.getItem(
      `articleContent-${dbNameToSearch}-es`
    );
    if (articleStored) {
      const jsonArticle = JSON.parse(articleStored);
      savedTitleRef.current = jsonArticle[0]?.content || "";
      savedBodyRef.current = jsonArticle[2]?.content || "";
    }
  }, [dbNameToSearch, DRAFT_KEY]);

  return { savedTitleRef, savedBodyRef };
}
