import { ChangeEvent } from "react";
import { PlaybookMeta } from "../../../../types/plabookMeta";

export interface ButtonProps {
  type: string;
  onClick: () => void;
  id: string;
  "data-cy": string;
  DRAFT_KEY: string;
  setDraftKey: React.Dispatch<React.SetStateAction<string>>;
  dbNameToSearch: string | React.RefObject<string>;
  editorRefs: React.RefObject<(HTMLDivElement | null)[]>;
  index: number;
  editorRef: HTMLDivElement;
  db: string;
  selectedSection: string;
  setSelectedSection: React.Dispatch<React.SetStateAction<string>>;
  handleClear: (editorRefs: React.RefObject<(HTMLDivElement | null)[]>) => void;
  savedTitleRef: React.RefObject<string>;
  savedBodyRef: React.RefObject<string>;
  setIsFontStyleOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isMediumScreen: boolean;
  setIsClicked: React.Dispatch<React.SetStateAction<boolean>>;
  isClicked: boolean;
  router: any;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  dialogRef: React.RefObject<HTMLDialogElement | null>;
  sectionsDialogRef: React.RefObject<HTMLDialogElement | null>;
  stylesDialogRef: React.RefObject<HTMLDialogElement | null>;
  setPlaceHolderTitle: React.Dispatch<React.SetStateAction<boolean>>;
  setPlaceHolderArticle: React.Dispatch<React.SetStateAction<boolean>>;
  isPlaceHolderTitle: boolean;
  isPlaceHolderArticle: boolean;
  translationReady: boolean;
  setTranslationReady: React.Dispatch<React.SetStateAction<boolean>>;
  isDraftArticleButtonClicked: boolean;
  setDraftArticleButtonClicked: React.Dispatch<React.SetStateAction<boolean>>;
}

export const iconsMenu = {
  save: "💾",
  link: "🔗",
  image: "🖼️",
  post: "📤",
  articles: "📰",
  font: "🎨",
  sections: "▼",
  styles: "🪄",
  menu: "🧰",
  clear: "🌪",
  translate: "🌐",
};
export const menuButtonTypes = [
  "save",
  "post",
  "image",
  "link",
  "articles",
  "font",
  "sections",
  "styles",
  "clear",
  "translate",
];
