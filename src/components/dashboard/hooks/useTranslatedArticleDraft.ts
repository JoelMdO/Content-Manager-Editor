<<<<<<< HEAD
import { ButtonProps } from "../menu/button_menu/type/type_menu_button";
import MenuContext from "../menu/button_menu/context/menu_context";
import { useContext, useEffect } from "react";
=======
import { set } from "lodash";
import { ButtonProps } from "../menu/button_menu/type/type_menu_button";
import { cleanHtml } from "../../../utils/clean_html";
import MenuContext from "../menu/button_menu/context/menu_context";
import { useContext, useEffect, useRef } from "react";
>>>>>>> 1295580d32457ddac461590b78b05994a943dd08
import { handleClick } from "../draft_article/utils/handle_click";

export function useTranslatedArticleDraft() {
  //CONTEXT
  const {
    savedTitleRef,
    savedBodyRef,
<<<<<<< HEAD
    translationReady,
=======
    dbNameToSearch,
    translationReady,
    DRAFT_KEY,
>>>>>>> 1295580d32457ddac461590b78b05994a943dd08
    setLanguage,
    setText,
    setDraftArticleButtonClicked,
  } = useContext(MenuContext) as ButtonProps;
  ///
  ///======================================================
  // For rerendering on translation, you can expose a reload function:
  ///======================================================
  useEffect(() => {
<<<<<<< HEAD
    if (translationReady) {
      const dbName = sessionStorage.getItem("db") as string;

      let articleStored: string | null = sessionStorage.getItem(
        `articleContent-${dbName}`
      );

      if (articleStored) {
        //
=======
    console.log("translationReady in useEffect:", translationReady);
    if (translationReady) {
      console.log("useTranslatedArticleDraft triggered");

      const dbName = sessionStorage.getItem("db") as string;
      console.log('"translationReady" is true', dbName);
      let articleStored: string | null = sessionStorage.getItem(
        `articleContent-${dbName}`
      );
      console.log("articleStored from session at translated:", articleStored);

      if (articleStored) {
        //
        console.log("Retrieved translated data");
>>>>>>> 1295580d32457ddac461590b78b05994a943dd08
        const jsonArticle = JSON.parse(articleStored);
        const newSavedTitleRef = jsonArticle.find(
          (item: any) => item.type === "es-title"
        );
<<<<<<< HEAD

        handleClick({
          newTitleRef: newSavedTitleRef.content,
          DRAFT_KEY: `draft-articleContent-${dbName}`,
=======
        // const newSavedBodyRef = jsonArticle.find(
        //   (item: any) => item.type === "es-body"
        // );
        // console.log('"newSavedTitleRef" at translated:', newSavedTitleRef);
        // console.log('"newSavedBodyRef" at translated:', newSavedBodyRef);

        handleClick({
          newTitleRef: newSavedTitleRef.content,
          DRAFT_KEY: DRAFT_KEY,
>>>>>>> 1295580d32457ddac461590b78b05994a943dd08
          savedTitleRef: savedTitleRef,
          savedBodyRef: savedBodyRef,
          tag: "translated",
          setDraftArticleButtonClicked: (clicked) => {
<<<<<<< HEAD
=======
            console.log("Toggling isDraftArticleButtonClicked");
>>>>>>> 1295580d32457ddac461590b78b05994a943dd08
            setDraftArticleButtonClicked((prev) => !prev);
          },
        });

<<<<<<< HEAD
        setText(newSavedTitleRef.content);
        setLanguage("es");
=======
        // Directly update savedBodyRef with the translated content
        // savedBodyRef.current = newSavedBodyRef.content;
        // console.log("Updated savedBodyRef.current to:", savedBodyRef.current);

        setText(newSavedTitleRef.content);
        setLanguage("es"); // Set the language to Spanish
        //);
        // Update the Editor with the translated article

        // const esBodyObj = jsonArticle.find(
        //   (item: any) => item.type === "es-body"
        // );
        // //
        // const cleanBody = cleanHtml(esBodyObj?.content || "");
        // console.log("esTitleObj at translated:", esTitleObj);
        // console.log("esBodyObj at translated:", cleanBody);
        // //todo working on check the same code as in useDraftArticle.tsx
        // //
        // savedTitleRef.current = esTitleObj?.content || "";
        // savedBodyRef.current = cleanBody;
        //setLanguage("es"); // Set the language to Spanish
>>>>>>> 1295580d32457ddac461590b78b05994a943dd08
      }
    }
  }, [translationReady]);

  return { savedTitleRef, savedBodyRef };
}
