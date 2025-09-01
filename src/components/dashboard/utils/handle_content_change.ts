import removeBase64FromImgTags from "../menu/button_menu/utils/remove_img_base64";

export const handleContentChange = (
  index: number,
  content: string,
<<<<<<< HEAD
  language: string,
  setText: (text: string) => void,
  debouncedUpdateStore: (
    title: string,
    body: string,
    language: string,
    setText: (text: string) => void
  ) => void
=======
  debouncedUpdateStore: (title: string, body: string) => void
>>>>>>> 1295580d32457ddac461590b78b05994a943dd08
) => {
  ///========================================================
  // Function to handler the content change on the editor, when
  // the user types or modifies the content.
  ///========================================================
  const dbName = sessionStorage.getItem("db");
<<<<<<< HEAD
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
=======
  //
  if (index === 0) {
    // Title
    sessionStorage.setItem(`tempTitle-${dbName}`, content);
    debouncedUpdateStore(
      content,
      sessionStorage.getItem(`tempBody-${dbName}`) || ""
>>>>>>> 1295580d32457ddac461590b78b05994a943dd08
    );
  } else {
    // Article
    const htmlCleaned = removeBase64FromImgTags(content);
<<<<<<< HEAD
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
=======
    sessionStorage.setItem(`tempBody-${dbName}`, htmlCleaned);
    debouncedUpdateStore(
      sessionStorage.getItem(`tempTitle-${dbName}`) || "",
      htmlCleaned
>>>>>>> 1295580d32457ddac461590b78b05994a943dd08
    );
  }
};
