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
import { ButtonProps } from "@/components/Menu/Menu Button/type/menu_button_type";
const LogOutButton = dynamic(
  () => import("../../components/buttons/logout_buttons")
);
const HomeButton = dynamic(
  () => import("../../components/buttons/home_button")
);
const MenuDesktop = dynamic(() => import("../../components/Menu/menu_desktop"));
const MenuMobile = dynamic(() => import("@/components/Menu/menu_mobile"));

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
  const [isFontStyleOpen, setIsFontStyleOpen] = useState<boolean>(false);
  const [isMediumScreen, setIsMediumScreen] = useState<boolean>(false);
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
  //
  let DRAFT_KEY: string = "";
  //
  // let theTitle = savedTitleRef.current || "";
  // let theBody = savedBodyRef.current || "";

  //
  //
  ///======================================================
  // Check if an article is already created on page load
  // Store articleID in a ref to persist across renders
  ///======================================================
  useEffect(() => {
    dbSelector();
    //
    if (window.innerWidth > 768) {
      setIsMediumScreen(true);
    }

    //--------------------------------------------------------
    // Read the sessionStorage as per the corresponded db.
    //--------------------------------------------------------
    let articleStored: string | null;

    dbNameToSearch.current =
      sessionStorage.getItem("db") || dbNameToSearch.current;
    articleStored = sessionStorage.getItem(`articleContent-${dbNameToSearch}`);
    //console.log("Article found in sessionStorage:", articleStored);

    if (!articleStored) {
      //Check localStorage for the article content
      // console.log(
      //   "No article found in sessionStorage, checking localStorage..."
      // );
      DRAFT_KEY = `draft-articleContent-${dbNameToSearch.current}`;
      articleStored = localStorage.getItem(DRAFT_KEY);
      //console.log("Article found in localStorage:", articleStored);
    }

    if (articleStored) {
      // console.log("articleStored to savedTitleRef:", articleStored);
      const jsonArticle = JSON.parse(articleStored!);
      savedTitleRef.current = jsonArticle[0]?.content || "";
      savedBodyRef.current = jsonArticle[2]?.content || "";
      // Remove the sesstion Storage after the page is mounted and if exist the article is created
      sessionStorage.removeItem(`tempTitle-${dbNameToSearch}`);
      sessionStorage.removeItem(`tempBody-${dbNameToSearch}`);
      sessionStorage.removeItem(`articleContent-${dbNameToSearch}`);
    }
    // console.log("savedTitleRef at Dashboard:", savedTitleRef.current);
    // console.log("savedBodyRef at Dashboard:", savedBodyRef.current);
    // debugger;
    //
  }, []);
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
    dbNameToSearch: dbNameToSearch.current,
    DRAFT_KEY,
    stylesDialogRef,
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
          <aside className="hidden w-[25vw] h-full gap-y-2 bg-gray-800 text-white md:flex items-center flex-col">
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
          </main>
        </section>
      </MenuContext.Provider>
    </>
  );
};

export default Dashboard;
