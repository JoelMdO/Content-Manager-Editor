//=========================================================
// HANDLE CLICK, purpose:
// Update UI with the draft article content
//=========================================================
import { StorageItemOrNull } from "../../../../types/storage_item";
import {
  defaultDispatcher,
  defaultHandlerContext,
  DispatchProps,
} from "./handlers";

type HandleClickProps = {
  tag: string;
  newSavedTitleRef?: React.RefObject<string | null>;
  DRAFT_KEY?: string;
  savedTitleRef?: React.RefObject<string | null>;
  newTitleRef?: string;
  setLanguage?: (language: "en" | "es") => void;
  language?: string;
  setSummaryContent?: (summaryContent: string) => void;
  setArticle?: (article: StorageItemOrNull | null) => void;
};

export const handleClick = async (props: HandleClickProps) => {
  const db = sessionStorage.getItem("dbName") || "DeCav";
  const ctx = defaultHandlerContext(db);
  console.log(
    "[handleClick] dispatching tag:",
    props.tag,
    "with context:",
    ctx,
  );
  try {
    await defaultDispatcher.dispatch(props.tag, props as DispatchProps, ctx);
  } catch (e) {
    console.error("[handleClick] dispatch failed", e);
  }
};
