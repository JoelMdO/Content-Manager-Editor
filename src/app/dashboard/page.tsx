"use client";
import React, { useRef, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import dbSelector from "../../components/alerts/db_selector";
import { ButtonProps } from "../../components/dashboard/menu/button_menu/type/type_menu_button";
import MenuContext from "../../components/dashboard/menu/button_menu/context/menu_context";
import DraftArticle from "../../components/dashboard/draft_article/draft_article";
import AutoSaveScreen from "../../components/loaders/auto_save";
const ImageInput = dynamic(
  () => import("../../components/dashboard/menu/button_menu/image_input")
);
const LinkDialog = dynamic(
  () => import("../../components/dashboard/menu/button_menu/link_dialog")
);
const SectionSelector = dynamic(
  () => import("../../components/dashboard/menu/button_menu/sections_selector")
);
const LogOutButton = dynamic(
  () => import("../../components/buttons/logout_buttons")
);
const HomeButton = dynamic(
  () => import("../../components/buttons/home_button")
);
const MenuDesktop = dynamic(
  () => import("../../components/dashboard/menu/desktop_menu")
);
const MenuMobile = dynamic(
  () => import("../../components/dashboard/menu/mobile_menu")
);

const DashboardEditor = dynamic(
  () => import("../../components/dashboard/dashboard_editor")
);
//
const Dashboard: React.FC = () => {
  //
  const [isPlaceHolderTitle, setPlaceHolderTitle] = useState<boolean>(true);
  const [isPlaceHolderArticle, setPlaceHolderArticle] = useState<boolean>(true);
  const [selectedSection, setSelectedSection] =
    useState<string>("Select category"); // TODO check if its necesary
  const [isMediumScreen, setIsMediumScreen] = useState<boolean>(false);
  const [translationReady, setTranslationReady] = useState(false);
  const [isDraftArticleButtonClicked, setDraftArticleButtonClicked] =
    useState<boolean>(false);
  const [lastAutoSave, setLastAutoSave] = useState<Date | null>(null);
  const [isTranslating, setTranslating] = useState(false);
  const [text, setText] = useState<string>("Without Draft Articles");
  const [language, setLanguage] = useState<"en" | "es">("en");
  const [dbIsReady, setDbIsReady] = useState<boolean>(false);
  const [openDialogNoSection, setOpenDialogNoSection] =
    useState<boolean>(false);

  //
  const savedTitleRef = useRef<string>("");
  const savedBodyRef = useRef<string>("");
  const dbNameToSearch = useRef<string>("");
  const editorRefs = useRef<(HTMLDivElement | null)[]>([]);
  const pageRef = useRef(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const sectionsDialogRef = useRef<HTMLDialogElement | null>(null);
  const stylesDialogRef = useRef<HTMLDialogElement | null>(null);

  const [DRAFT_KEY, setDraftKey] = useState(`draft-articleContent-DeCav`);
  //
  //
  ///======================================================
  // Check if screen is desktop and database selector
  ///======================================================
  useEffect(() => {
    dbSelector();
    //
    if (window.innerWidth > 768) {
      setIsMediumScreen(true);
    }

    if (sessionStorage.getItem("db") !== null) {
      setDbIsReady(true);
    }
  }, []);
  //
  useEffect(() => {
    dbNameToSearch.current = sessionStorage.getItem("db") as string;
    setDraftKey(`draft-articleContent-${dbNameToSearch.current}`);
  }, [dbIsReady]);
  //
  //TODO second phase add a section selector on change of dbNameToSearch
  //--------------------------------------------------------
  // Context creation
  ///--------------------------------------------------------
  const menuContextValue: Partial<ButtonProps> = {
    setSelectedSection,
    selectedSection,
    isMediumScreen,
    setPlaceHolderArticle,
    setPlaceHolderTitle,
    isPlaceHolderTitle,
    isPlaceHolderArticle,
    savedTitleRef,
    savedBodyRef,
    editorRefs,
    fileInputRef,
    dialogRef,
    sectionsDialogRef,
    dbNameToSearch,
    setDraftKey,
    DRAFT_KEY,
    stylesDialogRef,
    translationReady,
    setTranslationReady,
    isDraftArticleButtonClicked,
    setDraftArticleButtonClicked,
    setTranslating,
    isTranslating,
    lastAutoSave,
    setLastAutoSave,
    setLanguage,
    language,
    text,
    setText,
    dbIsReady,
    openDialogNoSection,
    setOpenDialogNoSection,
  };
  //
  ///======================================================
  /// UI Editor with a menu with options to insert images,
  // links, and bold or italic font style, with an <aside>
  // for tablet and desktop and a <nav> for mobile
  ///======================================================
  return (
    <>
      <MenuContext.Provider value={menuContextValue}>
        <section
          ref={pageRef}
          className="flex flex-col md:flex-row h-screen bg-white"
        >
          {/* TABLET / DESKTOP */}
          <aside className="hidden md:flex w-[25vw] h-full gap-y-2 bg-gray-800 text-white items-center flex-col">
            <DraftArticle />
            {lastAutoSave && <AutoSaveScreen lastAutoSave={lastAutoSave} />}
            <MenuDesktop />
            <HomeButton />
            <LogOutButton />
          </aside>
          {/* MENU MOBILE */}
          <nav className="md:hidden w-full h-[12dvh] bg-gray-800">
            <div className="w-full flex flex-row justify-between mt-2 px-2">
              {/* HomeButton at the start (left) */}
              <div className="flex-shrink-0">
                <HomeButton type="mobile" />
              </div>
              <div className="flex-grow text-center flex flex-col">
                <DraftArticle />
                {lastAutoSave && <AutoSaveScreen lastAutoSave={lastAutoSave} />}
              </div>
              {/* LogOutButton at the end (right) */}
              <div className="flex-shrink-0">
                <LogOutButton />
              </div>
            </div>
            <MenuMobile />
          </nav>
          {/* Main Content */}
          <main className="flex-1 p-4 pt-2 h-[80dvh] md:h-full md:w-[75vw] overflow-y-auto">
            <DashboardEditor />
            <SectionSelector />
            <ImageInput index={1} />

            <LinkDialog index={1} />
          </main>
        </section>
      </MenuContext.Provider>
    </>
  );
};

export default Dashboard;
