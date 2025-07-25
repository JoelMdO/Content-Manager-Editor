"use client";
import React, {
  useRef,
  useState,
  useEffect,
  // createContext,
  // useContext,
} from "react";
import MenuContext from "../../utils/context/menu_context";
// Remove ButtonProps import, not needed for context

import dynamic from "next/dynamic";
import dbSelector from "../../components/alerts/db_selector";
import { ButtonProps } from "@/components/Menu/Menu Button/type/type_menu_button";
import DraftArticle from "@/components/draft_article/draft_article";
// import { useGetDraftArticleHook } from "@/hooks/useDraftArticle";
const ImageInput = dynamic(
  () => import("@/components/Menu/Menu Button/image_input")
);
const LinkDialog = dynamic(
  () => import("@/components/Menu/Menu Button/link_dialog")
);
const SectionSelector = dynamic(
  () => import("../../components/Menu/sections_selector")
);
const LogOutButton = dynamic(
  () => import("../../components/buttons/logout_buttons")
);
const HomeButton = dynamic(
  () => import("../../components/buttons/home_button")
);
const MenuDesktop = dynamic(() => import("../../components/Menu/desktop_menu"));
const MenuMobile = dynamic(() => import("@/components/Menu/mobile_menu"));

const DashboardEditor = dynamic(
  () => import("../../components/dashboard_editor")
);
//
// const MenuContext = createContext<Partial<ButtonProps> | null>(null);

// Do not export useMenuContext from this file
//
const Dashboard: React.FC = () => {
  //
  const [isPlaceHolderTitle, setPlaceHolderTitle] = useState<boolean>(true);
  const [isPlaceHolderArticle, setPlaceHolderArticle] = useState<boolean>(true);
  const [selectedSection, setSelectedSection] =
    useState<string>("Select category"); // TODO check if its necesary
  // const [isFontStyleOpen, setIsFontStyleOpen] = useState<boolean>(false);
  const [isMediumScreen, setIsMediumScreen] = useState<boolean>(false);
  const [translationReady, setTranslationReady] = useState(false);
  const [isDraftArticleButtonClicked, setDraftArticleButtonClicked] =
    useState<boolean>(false);
  //
  const savedTitleRef = useRef<string>("");
  const savedBodyRef = useRef<string>("");
  const dbNameToSearch = useRef<string>("DeCav");
  const editorRefs = useRef<(HTMLDivElement | null)[]>([]);
  const pageRef = useRef(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const sectionsDialogRef = useRef<HTMLDialogElement | null>(null);
  const stylesDialogRef = useRef<HTMLDialogElement | null>(null);
  const [DRAFT_KEY, setDraftKey] = useState(`draft-articleContent-DeCav`);
  //

  //
  // let theTitle = savedTitleRef.current || "";
  // let theBody = savedBodyRef.current || "";

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
    console.log("dbNameToSearch.current:", dbNameToSearch.current);

    setDraftKey(`draft-articleContent-${dbNameToSearch.current}`);
    console.log("DRAFT_KEY: at useeffect", DRAFT_KEY);
  }, []);
  //--------------------------------------------------------
  // Read the sessionStorage as per the corresponded db.
  //--------------------------------------------------------
  // const { savedTitleRef, savedBodyRef } = useGetDraftArticleHook(
  //   dbNameToSearch.current,
  //   DRAFT_KEY
  // );
  // let articleStored: string | null;

  // dbNameToSearch.current =
  //   sessionStorage.getItem("db") || dbNameToSearch.current;
  // articleStored = sessionStorage.getItem(`articleContent-${dbNameToSearch}`);
  //console.log("Article found in sessionStorage:", articleStored);

  // if (!articleStored) {
  //Check localStorage for the article content
  // console.log(
  //   "No article found in sessionStorage, checking localStorage..."
  // );
  // DRAFT_KEY = `draft-articleContent-${dbNameToSearch.current}`;
  // articleStored = localStorage.getItem(DRAFT_KEY);
  //console.log("Article found in localStorage:", articleStored);
  //}

  // if (articleStored) {
  // console.log("articleStored to savedTitleRef:", articleStored);
  // const jsonArticle = JSON.parse(articleStored!);
  // savedTitleRef.current = jsonArticle[0]?.content || "";
  // savedBodyRef.current = jsonArticle[2]?.content || "";
  // Remove the sesstion Storage after the page is mounted and if exist the article is created
  // sessionStorage.removeItem(`tempTitle-${dbNameToSearch}`);
  // sessionStorage.removeItem(`tempBody-${dbNameToSearch}`);
  // sessionStorage.removeItem(`articleContent-${dbNameToSearch}`);
  //}
  // console.log("savedTitleRef at Dashboard:", savedTitleRef.current);
  // console.log("savedBodyRef at Dashboard:", savedBodyRef.current);
  // debugger;
  //
  //
  //
  //--------------------------------------------------------
  // Context creation
  ///--------------------------------------------------------
  const menuContextValue: Partial<ButtonProps> = {
    // setIsFontStyleOpen,
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
          className="flex flex-col md:flex-row h-screen bg-black"
        >
          {/* TABLET / DESKTOP */}
          <aside className="hidden md:flex w-[25vw] h-full gap-y-2 bg-gray-800 text-white items-center flex-col">
            <DraftArticle />
            <MenuDesktop
            // editorRefs={editorRefs}
            // theTitle={theTitle}
            // theBody={theBody}
            // setIsFontStyleOpen={setIsFontStyleOpen}
            // setSelectedSection={setSelectedSection}
            // selectedSection={selectedSection}
            // isMediumScreen={isMediumScreen}
            // dbNameToSearch={dbNameToSearch.current}
            />
            <HomeButton />
            <LogOutButton />
          </aside>
          {/* MENU MOBILE */}
          {/* {isFontStyleOpen && <FontStyleUI />} */}
          <nav className="md:hidden w-full h-[10dvh] bg-gray-800">
            <div className="w-full flex flex-row justify-between mt-2 px-2">
              {/* HomeButton at the start (left) */}
              <div className="flex-shrink-0">
                <HomeButton type="mobile" />
              </div>
              <div className="flex-grow text-center">
                <DraftArticle />
              </div>
              {/* LogOutButton at the end (right) */}
              <div className="flex-shrink-0">
                <LogOutButton />
              </div>
            </div>
            <MenuMobile
            // editorRefs={editorRefs}
            // theTitle={theTitle}
            // theBody={theBody}
            // setIsFontStyleOpen={setIsFontStyleOpen}
            // setSelectedSection={setSelectedSection}
            // isMediumScreen={isMediumScreen}
            // selectedSection={selectedSection}
            // dbNameToSearch={dbNameToSearch.current}
            />
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
