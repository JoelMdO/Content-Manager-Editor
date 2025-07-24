import { ChangeEvent } from "react";
import { PlaybookMeta } from "../../../../types/plabookMeta";

export interface ButtonProps {
  type: string;
  onClick: () => void;
  isCreating: boolean;
  id: string;
  setViewDetails: React.Dispatch<React.SetStateAction<boolean>>;
  setEntries: React.Dispatch<React.SetStateAction<PlaybookMeta[] | undefined>>;
  setUpdateNote: React.Dispatch<
    React.SetStateAction<{ isUpdateNote: boolean; noteId: string | null }>
  >;
  setIsCreating: React.Dispatch<React.SetStateAction<boolean>>;
  "data-cy": string;
  resetForm: () => void;
  DRAFT_KEY: string;
  dbNameToSearch: string | React.RefObject<string>;
  editorRefs: React.RefObject<(HTMLDivElement | null)[]>;
  index: number;
  // editorRef: React.RefObject<HTMLDivElement>;
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
  // italic: string[];
  // bold: string[];
  router: any;
  noteViewMode: string;
  setNoteViewMode: React.Dispatch<React.SetStateAction<string>>;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  dialogRef: React.RefObject<HTMLDialogElement | null>;
  sectionsDialogRef: React.RefObject<HTMLDialogElement | null>;
  stylesDialogRef: React.RefObject<HTMLDialogElement | null>;
  setPlaceHolderTitle: React.Dispatch<React.SetStateAction<boolean>>;
  setPlaceHolderArticle: React.Dispatch<React.SetStateAction<boolean>>;
  isPlaceHolderTitle: boolean;
  isPlaceHolderArticle: boolean;
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
];
