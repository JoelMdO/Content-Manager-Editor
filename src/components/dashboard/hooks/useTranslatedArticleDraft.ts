import { ButtonProps } from "../menu/button_menu/type/type_menu_button";
import MenuContext from "../menu/button_menu/context/menu_context";
import { useContext, useEffect } from "react";
import { handleClick } from "../draft_article/utils/handle_click";
import { StorageItem } from "@/types/storage_item";

export function useTranslatedArticleDraft() {
  //CONTEXT
  const {
    savedTitleRef,
    savedBodyRef,
    translationReady,
    setLanguage,
    setText,
    setDraftArticleButtonClicked,
  } = useContext(MenuContext) as ButtonProps;
  ///
  ///======================================================
  // For rerendering on translation, you can expose a reload function:
  ///======================================================
  useEffect(() => {
    if (translationReady) {
      const dbName = sessionStorage.getItem("db") as string;

      const articleStored: string | null = sessionStorage.getItem(
        `articleContent-${dbName}`
      );

      if (articleStored) {
        //
        const jsonArticle = JSON.parse(articleStored);
        const newSavedTitleRef = jsonArticle.find(
          (item: StorageItem) => item.type === "es-title"
        );

        handleClick({
          newTitleRef: newSavedTitleRef.content,
          DRAFT_KEY: `draft-articleContent-${dbName}`,
          savedTitleRef: savedTitleRef,
          savedBodyRef: savedBodyRef,
          tag: "translated",
          setDraftArticleButtonClicked: () => {
            setDraftArticleButtonClicked((prev) => !prev);
          },
        });

        setText(newSavedTitleRef.content);
        setLanguage("es");
      }
    }
  }, [
    translationReady,
    setLanguage,
    setText,
    savedTitleRef,
    savedBodyRef,
    setDraftArticleButtonClicked,
  ]);

  return { savedTitleRef, savedBodyRef };
}
