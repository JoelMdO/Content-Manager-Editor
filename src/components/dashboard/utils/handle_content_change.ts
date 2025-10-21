import removeBase64FromImgTags from "../menu/button_menu/utils/remove_img_base64";
import { cleanNestedDivs } from "./clean_content";

export const handleContentChange = (
  index: number,
  element: HTMLElement,
  language: string,
  setText: (text: string) => void,
  debouncedUpdateStore: (
    title: string,
    body: string,
    language: string,
    setText: (text: string) => void
  ) => void
) => {
  ///========================================================
  // Function to handler the content change on the editor, when
  // the user types or modifies the content.
  ///========================================================
  const newElement = element.innerHTML;
  const content = cleanNestedDivs(newElement);
  const dbName = sessionStorage.getItem("db");
  const languageKey = language === "es" ? "es" : "en";
  //
  if (index === 0) {
    // Title
    //console.log("Title content changed:", content);

    sessionStorage.setItem(`${languageKey}-tempTitle-${dbName}`, newElement);
    console.log("Title changed:", newElement);
    // //console.log(
    //   "Body content:",
    //   sessionStorage.getItem(`${languageKey}-tempBody-${dbName}`) || ""
    // );

    debouncedUpdateStore(
      newElement,
      sessionStorage.getItem(`${languageKey}-tempBody-${dbName}`) || "",
      language,
      setText
    );
  } else {
    //console.log("Body content changed:", content);

    // Article
    const htmlCleaned = removeBase64FromImgTags(content);
    sessionStorage.setItem(`${languageKey}-tempBody-${dbName}`, htmlCleaned);
    //console.log("Body content html changed:", htmlCleaned);
    // //console.log(
    //   "Title:",
    //   sessionStorage.getItem(`${languageKey}-tempTitle-${dbName}`) || ""
    // );
    debouncedUpdateStore(
      sessionStorage.getItem(`${languageKey}-tempTitle-${dbName}`) || "",
      htmlCleaned,
      language,
      setText
    );
  }
};
