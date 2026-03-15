import { useEffect, useRef } from "react";
import { useDraftStore } from "@/store/useDraftStore";
import { useEditorStore } from "@/store/useEditorStore";
import { handleClick } from "./utils/handle_click";
import draftArticleText from "../../../constants/draft_article_text.json";
import { iconsMenu } from "../../../constants/icons";
import { StorageItem } from "../../../types/storage_item";

const DraftArticle = () => {
  //
  // CHANGE LOG
  // Changed by : Copilot
  // Date       : 2026-03-11
  // Reason     : Read state from Zustand stores instead of MenuContext.
  // Impact     : MenuContext no longer needed in this file.
  //              setDraftArticleButtonClicked removed — handleClick now calls
  //              loadDraftIntoEditor() directly.
  //
  // ORIGINAL:
  // const { dbNameToSearch, DRAFT_KEY, savedTitleRef, savedBodyRef,
  //         setDraftArticleButtonClicked, setText, text, setLanguage,
  //         setArticle, setDraftKey } = useContext(MenuContext) as ButtonProps;
  const DRAFT_KEY = useDraftStore((s) => s.DRAFT_KEY);
  const dbName = useDraftStore((s) => s.dbName);
  const text = useDraftStore((s) => s.text);
  if (process.env.NODE_ENV !== "production") {
    console.log({ text });
  }

  const { savedTitleRef, savedBodyRef } = useEditorStore.getState();
  const { setText, setLanguage, setArticle, setDraftKey } =
    useDraftStore.getState();
  const newSavedTitleRef = useRef<string>("");
  // NOT USED const newSavedBodyRef = useRef<string>("");
  //
  //=========================================================
  // Read the if any draft article exists in localStorage
  //=========================================================
  const draftButtons = [
    { tag: "draft-en", icon: iconsMenu.english, label: "English" },
    { tag: "draft-es", icon: iconsMenu.spanish, label: "Spanish" },
  ];

  useEffect(() => {
    //
    const articleStored = localStorage.getItem(DRAFT_KEY);
    if (!articleStored || articleStored === "[]") {
      const dbName = sessionStorage.getItem("db") as string;
      setDraftKey(`draft-articleContent-${dbName}`);
    }
    if (articleStored) {
      const jsonArticle = JSON.parse(articleStored);

      newSavedTitleRef.current =
        jsonArticle.find((item: StorageItem) => item.type === "title")
          ?.content || "";
      //
      setText(newSavedTitleRef.current);
      //
    } else {
      setText("Without Draft Articles");
    }
    //
  }, [dbName, DRAFT_KEY, setDraftKey, setText]);
  //

  //
  return (
    <div className="flex flex-col mt-2 ml-2">
      <h1 className="text-[clamp(0.6rem,2dvh,1.5rem)] text-white">
        {draftArticleText.title}
      </h1>
      <div className="flex flex-wrap items-center w-[60vw] max-w-4xl md:w-[28vw] h-[3dvh] md:h-[5dvh]  bg-gray-400 rounded-3xl gap-y-2">
        <span className="text-[clamp(0.6rem,2dvh,1rem)] w-[16vw] md:w-[14vw] ml-1 text-black pl-1 overflow-hidden whitespace-nowrap text-ellipsis">
          {text}
        </span>
        {draftButtons.map((button) => (
          <div
            key={button.tag}
            className="flex flex-row items-center ml-1 mr-1"
          >
            <div className="flex h-[2.5dvh] md:h-[4.5dvh] bg-gray-500 w-[0.7] ml-1 mr-1"></div>
            <button
              type="button"
              data-cy={`draft-load-${button.tag}`}
              className="flex w-5 h-5 mr-2"
              //------------------------------------------
              // Purpose: handleClick function to retrieve the draft language article.
              //------------------------------------------
              onClick={() => {
                handleClick({
                  newSavedTitleRef: newSavedTitleRef,
                  DRAFT_KEY: DRAFT_KEY,
                  savedTitleRef: savedTitleRef,
                  //savedBodyRef: savedBodyRef,
                  // ORIGINAL — setDraftArticleButtonClicked removed;
                  // handleClick calls loadDraftIntoEditor() directly.
                  // setDraftArticleButtonClicked: setDraftArticleButtonClicked,
                  tag: button.tag,
                  setLanguage: setLanguage,
                  setArticle: setArticle,
                });
              }}
            >
              <span className="text-2xl flex items-center justify-center">
                {button.icon}
              </span>
            </button>
            <span className="text-[8px] md:text-sm text-cyan-950">
              {button.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
export default DraftArticle;
