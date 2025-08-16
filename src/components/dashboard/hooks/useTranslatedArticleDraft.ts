import { set } from "lodash";
import { ButtonProps } from "../menu/button_menu/type/type_menu_button";
import { cleanHtml } from "../../../utils/clean_html";
import MenuContext from "../menu/button_menu/context/menu_context";
import { useContext, useEffect, useRef } from "react";
import { handleClick } from "../draft_article/utils/handle_click";

export function useTranslatedArticleDraft() {
  //CONTEXT
  const {
    savedTitleRef,
    savedBodyRef,
    // dbNameToSearch,
    translationReady,
    DRAFT_KEY,
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

      let articleStored: string | null = sessionStorage.getItem(
        `articleContent-${dbName}`
      );

      if (articleStored) {
        //
        const jsonArticle = JSON.parse(articleStored);
        const newSavedTitleRef = jsonArticle.find(
          (item: any) => item.type === "es-title"
        );
        // const newSavedBodyRef = jsonArticle.find(
        //   (item: any) => item.type === "es-body"
        // );

        handleClick({
          newTitleRef: newSavedTitleRef.content,
          DRAFT_KEY: `draft-articleContent-${dbName}`,
          savedTitleRef: savedTitleRef,
          savedBodyRef: savedBodyRef,
          tag: "translated",
          setDraftArticleButtonClicked: (clicked) => {
            setDraftArticleButtonClicked((prev) => !prev);
          },
        });

        // Directly update savedBodyRef with the translated content
        // savedBodyRef.current = newSavedBodyRef.content;

        setText(newSavedTitleRef.content);
        setLanguage("es"); // Set the language to Spanish
        //);
        // Update the Editor with the translated article

        // const esBodyObj = jsonArticle.find(
        //   (item: any) => item.type === "es-body"
        // );
        // //
        // const cleanBody = cleanHtml(esBodyObj?.content || "");
        // //todo working on check the same code as in useDraftArticle.tsx
        // //
        // savedTitleRef.current = esTitleObj?.content || "";
        // savedBodyRef.current = cleanBody;
        //setLanguage("es"); // Set the language to Spanish
      }
    }
  }, [translationReady]);

  return { savedTitleRef, savedBodyRef };
}
