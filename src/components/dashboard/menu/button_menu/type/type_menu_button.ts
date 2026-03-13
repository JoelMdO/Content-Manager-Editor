import { ProcessedArticle } from "../../../preview/types/previewed_article";
import { ChangeEvent } from "react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

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
  // setSelectedSection: React.Dispatch<React.SetStateAction<string>>;
  setSelectedSection: (v: string) => void;
  handleClear: () => void;
  savedTitleRef: React.RefObject<string | null>;
  savedBodyRef: React.RefObject<string | null>;
  setIsFontStyleOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isMediumScreen: boolean;
  setIsClicked: React.Dispatch<React.SetStateAction<boolean>>;
  isClicked: boolean;
  router: AppRouterInstance;
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
  //setTranslationReady: React.Dispatch<React.SetStateAction<boolean>>;
  setTranslationReady: (v: boolean) => void;
  //isDraftArticleButtonClicked: boolean;
  //setDraftArticleButtonClicked: React.Dispatch<React.SetStateAction<boolean>>;
  isTranslating: boolean;
  //setTranslating: React.Dispatch<React.SetStateAction<boolean>>;
  setTranslating: (v: boolean) => void;
  setLastAutoSave: React.Dispatch<React.SetStateAction<Date | null>>;
  lastAutoSave: Date | null;
  language: "en" | "es";
  //setLanguage: React.Dispatch<React.SetStateAction<"en" | "es">>;
  setLanguage: (v: "en" | "es") => void;
  setIsMenuClicked: React.Dispatch<React.SetStateAction<boolean>>;
  tag: string;
  text: string;
  setText: React.Dispatch<React.SetStateAction<string>>;
  dbIsReady: boolean;
  setOpenDialogNoSection: React.Dispatch<React.SetStateAction<boolean>>;
  openDialogNoSection: boolean;
  dbName: string | null | undefined;
  currentTitle: string;
  currentBody: string;
  summaryDialogRef: React.RefObject<HTMLDialogElement | null>;
  //setIsSummary: React.Dispatch<React.SetStateAction<boolean>>;
  setIsSummary: (v: boolean) => void;
  isSummary: boolean;
  //setSummaryContent: React.Dispatch<React.SetStateAction<string>>;
  setSummaryContent: (v: string) => void;
  summaryContent: string;
  setIsView: React.Dispatch<React.SetStateAction<boolean>>;
  isView: boolean;
  setArticle: React.Dispatch<React.SetStateAction<ProcessedArticle | null>>;
  article: ProcessedArticle | null;
  setPreviewReady: React.Dispatch<React.SetStateAction<boolean>>;
  previewReady: boolean;
  isLoadingPreview: boolean;
  setIsLoadingPreview: React.Dispatch<React.SetStateAction<boolean>>;
  isMarkdownText: boolean;
  setIsMarkdownText: React.Dispatch<React.SetStateAction<boolean>>;
}

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
  "summary",
];
