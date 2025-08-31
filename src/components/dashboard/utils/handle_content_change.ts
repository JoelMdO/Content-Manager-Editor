import removeBase64FromImgTags from "../menu/button_menu/utils/remove_img_base64";

export const handleContentChange = (
  index: number,
  content: string,
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
