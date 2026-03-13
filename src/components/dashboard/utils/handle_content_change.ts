import removeBase64FromImgTags from "../menu/button_menu/utils/remove_img_base64";

/**
 * Called from TipTap's `onUpdate` callback — receives HTML strings directly
 * (no DOM element needed after the TipTap migration).
 */
export const handleContentChange = (
  index: number,
  html: string,
  language: string,
  setText: (text: string) => void,
  debouncedUpdateStore: (
    title: string,
    body: string,
    language: string,
    setText: (text: string) => void,
  ) => void,
) => {
  const dbName = sessionStorage.getItem("db");
  const languageKey = language === "es" ? "es" : "en";

  if (index === 0) {
    // Title
    sessionStorage.setItem(`${languageKey}-tempTitle-${dbName}`, html);
    debouncedUpdateStore(
      html,
      sessionStorage.getItem(`${languageKey}-tempBody-${dbName}`) || "",
      language,
      setText,
    );
  } else {
    // Body — strip residual base64 data-URIs before storing
    const htmlCleaned = removeBase64FromImgTags(html);

    sessionStorage.setItem(`${languageKey}-tempBody-${dbName}`, htmlCleaned);
    debouncedUpdateStore(
      sessionStorage.getItem(`${languageKey}-tempTitle-${dbName}`) || "",
      htmlCleaned,
      language,
      setText,
    );
  }
};
