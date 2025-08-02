import { set } from "lodash";
import { ButtonProps } from "../menu/button_menu/type/type_menu_button";
import { cleanHtml } from "../../../utils/clean_html";
import MenuContext from "../menu/button_menu/context/menu_context";
import { useContext, useEffect, useRef } from "react";

export function useTranslatedArticleDraft() {
  //CONTEXT
  const {
    savedTitleRef,
    savedBodyRef,
    dbNameToSearch,
    translationReady,
    setLanguage,
  } = useContext(MenuContext) as ButtonProps;
  ///
  ///======================================================
  // For rerendering on translation, you can expose a reload function:
  ///======================================================
  useEffect(() => {
    console.log("useTranslatedArticleDraft triggered");
    //
    const dbName =
      typeof dbNameToSearch === "string"
        ? dbNameToSearch
        : dbNameToSearch.current || "";

    let articleStored: string | null = sessionStorage.getItem(
      `articleContent-${dbName}`
    );
    console.log("articleStored from session at translated:", articleStored);

    if (articleStored) {
      //
      console.log("Retrieved translated data");

      // Update the Editor with the translated article
      const jsonArticle = JSON.parse(articleStored);
      const esTitleObj = jsonArticle.find(
        (item: any) => item.type === "es-title"
      );
      const esBodyObj = jsonArticle.find(
        (item: any) => item.type === "es-body"
      );
      //
      const cleanBody = cleanHtml(esBodyObj?.content || "");
      console.log("esTitleObj at translated:", esTitleObj);
      console.log("esBodyObj at translated:", cleanBody);
      //
      savedTitleRef.current = esTitleObj?.content || "";
      savedBodyRef.current = cleanBody;
      setLanguage("es"); // Set the language to Spanish
    }
  }, [translationReady]);

  return { savedTitleRef, savedBodyRef };
}
