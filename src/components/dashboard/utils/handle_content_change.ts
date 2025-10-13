import removeBase64FromImgTags from "../menu/button_menu/utils/remove_img_base64";
import TextEditor from "./text_editor";

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
  ///--------------------------------------------------------
  // Ensure the content is wrapped in a <div> to maintain structure
  ///--------------------------------------------------------
  const newElement = new TextEditor(element);
  newElement.initializeStructure();
  const content = newElement.getContent();
  console.log("Cleaned content:", content);
  ///========================================================
  // Function to handler the content change on the editor, when
  // the user types or modifies the content.
  ///========================================================
  const dbName = sessionStorage.getItem("db");
  const languageKey = language === "es" ? "es" : "en";
  //
  if (index === 0) {
    // Title
    sessionStorage.setItem(`${languageKey}-tempTitle-${dbName}`, content);
    console.log("Title changed:", content);
    console.log(
      "Body content:",
      sessionStorage.getItem(`${languageKey}-tempBody-${dbName}`) || ""
    );

    debouncedUpdateStore(
      content,
      sessionStorage.getItem(`${languageKey}-tempBody-${dbName}`) || "",
      language,
      setText
    );
  } else {
    // Article
    const htmlCleaned = removeBase64FromImgTags(content);
    sessionStorage.setItem(`${languageKey}-tempBody-${dbName}`, htmlCleaned);
    console.log("Body content changed:", htmlCleaned);
    console.log(
      "Title:",
      sessionStorage.getItem(`${languageKey}-tempTitle-${dbName}`) || ""
    );
    debouncedUpdateStore(
      sessionStorage.getItem(`${languageKey}-tempTitle-${dbName}`) || "",
      htmlCleaned,
      language,
      setText
    );
  }
};
