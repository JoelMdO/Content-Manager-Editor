"use client";
import React, { useRef, useState, useEffect } from "react";
import { handleKeyBoardActions } from "../../utils/dashboard/handle_keyboard_actions";
import dynamic from "next/dynamic";
import { handleClear } from "../../utils/dashboard/handler_clear";
import { handleSave } from "../../utils/dashboard/handle_save";
import LogOutButton from "../../components/buttons/logout_buttons";
import { debouncedUpdateStore } from "../../utils/dashboard/debounceUpdateStore";
import { handleContentChange } from "../../utils/dashboard/handle_content_change";
import dbSelector from "../../components/alerts/db_selector";
import HomeButton from "../../components/buttons/home_button";
import SectionSelector from "@/components/sections_selector";

const ImageButton = dynamic(
  () => import("../../components/buttons/image_button"),
  { ssr: false }
);
const LinkButton = dynamic(
  () => import("../../components/buttons/link_button"),
  { ssr: false }
);
const FontStyleUI = dynamic(
  () => import("../../components/buttons/font_style_buttons"),
  { ssr: false }
);
const CustomDashboardButton = dynamic(
  () => import("../../components/buttons/customDashboard_button"),
  { ssr: false }
);
//

//
const Dashboard: React.FC = () => {
  //
  // const [theTitle, setTheTitle] = useState<string>("");
  // const [theBody, setTheBody] = useState<string>("");
  const [isPlaceHolderTitle, setPlaceHolderTitle] = useState<boolean>(true);
  const [isPlaceHolderArticle, setPlaceHolderArticle] = useState<boolean>(true);
  const [selectedSection, setSelectedSection] =
    useState<string>("Select category");
  const editorRefs = useRef<(HTMLDivElement | null)[]>([]);
  const pageRef = useRef(null);
  //
  const savedTitleRef = useRef<string>("");
  const savedBodyRef = useRef<string>("");
  const dbNameToSearch = useRef<string>("DeCav");
  const DRAFT_KEY = (db: string) => `articleContent-${db}`;

  //
  let theTitle = savedTitleRef.current;
  let theBody = savedBodyRef.current;
  //
  ///======================================================
  // Check if an article is already created on page load
  // Store articleID in a ref to persist across renders
  ///======================================================
  useEffect(() => {
    dbSelector();
    // Read the sessionStorage as per the corresponded db.
    let articleStored: string | null;

    dbNameToSearch.current =
      sessionStorage.getItem("db") || dbNameToSearch.current;
    articleStored = sessionStorage.getItem(`articleContent-${dbNameToSearch}`);
    console.log("Article found in sessionStorage:", articleStored);

    if (!articleStored) {
      //Check localStorage for the article content
      console.log(
        "No article found in sessionStorage, checking localStorage..."
      );

      articleStored = localStorage.getItem(DRAFT_KEY(dbNameToSearch.current));
      console.log("Article found in localStorage:", articleStored);
    }

    // articleStored = sessionStorage.getItem(`articleContent-${dbNameToSearch}`);

    const jsonArticle = JSON.parse(articleStored!);
    savedTitleRef.current = jsonArticle[0]?.content || "";
    savedBodyRef.current = jsonArticle[2]?.content || "";
    // Remove the sesstion Storage after the page is mounted and if exist the article is created
    sessionStorage.removeItem(`tempTitle-${dbNameToSearch}`);
    sessionStorage.removeItem(`tempBody-${dbNameToSearch}`);
    sessionStorage.removeItem(`articleContent-${dbNameToSearch}`);
  }, []);
  //
  // Save to localStorage every 10 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      const draft = sessionStorage.getItem(`articleContent-${dbNameToSearch}`);
      if (draft) {
        localStorage.setItem(DRAFT_KEY(dbNameToSearch.current), draft);
      }
    }, 600000); // 10 minutes
    return () => clearInterval(interval);
  }, []);

  // Save to localStorage on tab/browser close
  useEffect(() => {
    const handleBeforeUnload = () => {
      const draft = sessionStorage.getItem(DRAFT_KEY(dbNameToSearch.current));
      if (draft) {
        localStorage.setItem(DRAFT_KEY(dbNameToSearch.current), draft);
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);
  ///---------------------------------------------------
  //  Cleanup debounce on unmount
  ///---------------------------------------------------
  useEffect(() => {
    return () => {
      debouncedUpdateStore.cancel();
    };
  }, []);
  //
  ///========================================================
  // Update the DOM if a previous article session is saved.
  ///========================================================
  // useEffect(() => {
  //   if (savedTitleRef.current) {
  //     setTheTitle(savedTitleRef.current);
  //     setPlaceHolderTitle(false);
  //     if (savedBodyRef.current) {
  //       setTheBody(savedBodyRef.current);
  //       setPlaceHolderArticle(false);
  //     }
  //   }
  // }, []);
  //
  ///======================================================
  /// UI Editor with a menu with options to insert images,
  // links, and bold or italic font style, with an <aside>
  // for tablet and desktop and a <nav> for mobile
  ///======================================================
  return (
    <>
      <div
        ref={pageRef}
        className="flex flex-col md:flex-row h-screen bg-black"
      >
        {/* TABLET / DESKTOP */}
        <aside className="hidden w-[25%] h-full gap-y-2 bg-gray-800 text-white md:flex items-center flex-col">
          <ImageButton
            editorRefs={editorRefs}
            index={1}
            data-cy={"image-button"}
          />
          <LinkButton editorRefs={editorRefs} index={1} data-cy="link-button" />
          <SectionSelector
            db={dbNameToSearch.current}
            selectedSection={selectedSection}
            setSelectedSection={setSelectedSection}
          />
          <FontStyleUI />
          <CustomDashboardButton
            type="save"
            DRAFT_KEY={DRAFT_KEY}
            dbNameToSearch={dbNameToSearch.current}
          />
          <CustomDashboardButton
            type="clear"
            // onClick={() => handleClear(setTheTitle, setTheBody, editorRefs)}
            onClick={() => {
              handleClear(editorRefs);
              theTitle = "";
              theBody = "";
              setSelectedSection("Select category");
            }}
          />
          <CustomDashboardButton
            type="post"
            data-cy={"submit-article"}
            onClick={() => handleSave(debouncedUpdateStore)}
          />
          <HomeButton />
          <LogOutButton />
        </aside>
        {/* MENU MOBILE */}
        <nav className="md:hidden w-full h-20vh bg-gray-800 text-white flex justify-around p-2 flex-row">
          <div className="flex items-center flex-col">
            <div className="flex flex-row space-x-2">
              <ImageButton editorRefs={editorRefs} index={1} />
              <LinkButton editorRefs={editorRefs} index={1} />
            </div>
            <SectionSelector
              db={dbNameToSearch.current}
              selectedSection={selectedSection}
              setSelectedSection={setSelectedSection}
            />
            <div className="flex flex-row w-auto space-x-2">
              <CustomDashboardButton
                type="clear"
                // onClick={() => handleClear(setTheTitle, setTheBody, editorRefs)}
                onClick={() => {
                  handleClear(editorRefs);
                  theTitle = "";
                  theBody = "";
                  setSelectedSection("Select category");
                }}
              />
              <CustomDashboardButton
                type="save"
                DRAFT_KEY={DRAFT_KEY}
                dbNameToSearch={dbNameToSearch.current}
              />
            </div>
          </div>
          <FontStyleUI />
          <div className="flex flex-col justify-center gap-y-2 items-center">
            <CustomDashboardButton
              type="post"
              onClick={() => handleSave(debouncedUpdateStore)}
            />
            <LogOutButton />
            <HomeButton type="mobile" />
          </div>
        </nav>
        {/* Main Content */}
        <main className="flex-1 p-4 pt-2 h-[80dvh] md:w-[80dvh] overflow-y-auto">
          <div className="border border-gray-600 border-1px">
            {["Title", "Article"].map((placeholder, index) => (
              // <div key={index} style={{ userSelect: "text", cursor: "text" }}
              <div
                key={index}
                ref={(el) => {
                  if (el && !editorRefs.current[index]) {
                    editorRefs.current[index] = el;
                  }
                }}
                className={`${
                  placeholder === "Title"
                    ? "h-[10dvh] font-bold"
                    : "h-[70dvh] font-normal overflow-auto"
                } p-4 border rounded-g shadow-sm focus:outline-none cursor-pointer text-white`}
                contentEditable={true}
                onKeyDown={(e) => handleKeyBoardActions(e, index, editorRefs)}
                suppressContentEditableWarning={true}
                onFocus={() =>
                  index === 0
                    ? setPlaceHolderTitle(false)
                    : setPlaceHolderArticle(false)
                }
                onInput={(e) => {
                  // const content = (e.target as HTMLDivElement).innerText;
                  const content = (e.target as HTMLDivElement).innerHTML;
                  handleContentChange(index, content, debouncedUpdateStore);
                }}
              >
                {index === 0
                  ? theTitle ||
                    (isPlaceHolderTitle && (
                      <span className="text-gray-400">{`${placeholder} here...`}</span>
                    ))
                  : theBody ||
                    (isPlaceHolderArticle && (
                      <span className="text-gray-400">{`Write your ${placeholder} here...`}</span>
                    ))}
              </div>
            ))}
          </div>
        </main>
      </div>
    </>
  );
};

export default Dashboard;
