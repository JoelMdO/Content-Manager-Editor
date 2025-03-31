'use client'
import React, { useRef, useState, useEffect, useCallback } from "react";
import { handleKeyBoardActions } from "../../utils/editor/handle_keys";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../services/store";
import { createArticleID } from "@/utils/create_id";
import dynamic from "next/dynamic";
import { handleClear } from "@/utils/dashboard/handler_clear";
import { handleSave } from "@/utils/dashboard/handle_save"; 
import LogOutButton from "@/components/buttons/logout_buttons";
import { debouncedUpdateStore } from "@/utils/dashboard/debounceUpdateStore";
import { handleContentChange } from "@/utils/dashboard/handle_content_change";

const ImageButton = dynamic(() => import("../../components/buttons/image_button"), { ssr: false });
const LinkButton = dynamic(() => import("../../components/buttons/link_button"), { ssr: false });
const FontStyleUI = dynamic(() => import("../../components/buttons/font_style_buttons"), { ssr: false });
const CustomButton = dynamic(() => import("../../components/buttons/custom_buttons"), { ssr: false });

const ArticlePage: React.FC = () => {
  //
  const [isTitle, setIsTitle] = useState(true);
  const [isArticle, setIsArticle] = useState(true);
  const [theTitle, setTheTitle] = useState<string>("");
  const [theBody, setTheBody] = useState<string>("");
  const [isPlaceHolderTitle, setPlaceHolderTitle] = useState<boolean>(true);
  const [isPlaceHolderArticle, setPlaceHolderArticle] = useState<boolean>(true);
  const editorRefs = useRef<(HTMLDivElement| null)[]>([]);
  const dispatch = useDispatch<AppDispatch>();
  const pageRef = useRef(null);
  //
  ///======================================================
  // Check if an article is already created on page load
  // Store articleID in a ref to persist across renders
  ///======================================================
  const articleIDRef = useRef<string>("");
  const previousArticleID = useSelector((state: any) => state.data_state?.id);
  // Create article ID only once when component mounts
  useEffect(() => {
    if (!articleIDRef.current) {
      articleIDRef.current = createArticleID(dispatch, previousArticleID)!;
      }
    // Check if the article has already been created
    const savedTitle = sessionStorage.getItem("tempTitle");
    const savedBody = sessionStorage.getItem("tempBody");
  
    if (savedTitle) {
      setTheTitle(savedTitle);
      setIsTitle(false);
    }
    if (savedBody) {
      setTheBody(savedBody);
      setIsArticle(false);
    }
    // Remove the sesstion Storage after the page is mounted and if exist the article is created
    sessionStorage.removeItem("tempTitle");
    sessionStorage.removeItem("tempBody");
  }, [dispatch, previousArticleID]);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedUpdateStore.cancel();
    };
  }, [debouncedUpdateStore]);
  //
  return (
    <>
    <div ref={pageRef} className="flex flex-col md:flex-row h-screen bg-black">
      {/* Left Menu on Tablet / Desktop*/}
      <aside className="hidden w-[25%] h-full bg-gray-800 text-white md:flex items-center flex-col">
        <ImageButton editorRefs={editorRefs} index={1}/>
        <LinkButton editorRefs={editorRefs} index={1} />
        <FontStyleUI/>
        <CustomButton type='post' onClick={() => handleSave(debouncedUpdateStore)}/>
        <CustomButton type='clear' onClick={()=> handleClear(setTheTitle, setTheBody, editorRefs)}/>
        <LogOutButton />
      </aside>
      {/* Menu Mobile*/}
      <nav className="md:hidden w-full h-20vh bg-gray-800 text-white flex justify-around p-2 flex-row fixed">
        <div className="flex items-center flex-col">
          <div className="flex flex-row space-x-2">
        <ImageButton editorRefs={editorRefs} index={1}/>
        <LinkButton editorRefs={editorRefs} index={1} /></div>
        <CustomButton type='clear' onClick={()=> handleClear(setTheTitle, setTheBody, editorRefs)}/></div>
        <FontStyleUI/>
        <CustomButton type='post' onClick={()=> handleClear(setTheTitle, setTheBody, editorRefs)}/>
        <LogOutButton />
      </nav>
      {/* Main Content */}
      <main className="flex-1 p-4 pt-[20vh] md:pt-2 md:w-[75%] overflow-y-auto min-h-screen">
      {["Title", "Article"].map((placeholder, index) => (
        <div key={index} style={{ userSelect: "text", cursor: "text" }}
                ref={(el) => {
                  if (el && !editorRefs.current[index]) {
                    // Assign only if not already set
                    // as due to API call on LinkButton needs to be hold
                    editorRefs.current[index] = el; 
                }
                }}
                className={`${placeholder === "Title" ? "h-[10%]": "h-[100vh]"} ${placeholder === "Title" ? "font-bold": "font-normal"} p-4 border rounded-g shadow-sm focus:outline-none cursor-pointer text-white`}
                contentEditable={true}
                onKeyDown={(e) => handleKeyBoardActions(e, index, editorRefs)}
                suppressContentEditableWarning={true}
                  onFocus={() => index === 0 ? setPlaceHolderTitle(false) : setPlaceHolderArticle(false)}
                  onInput={(e) => {
                    const content = (e.target as HTMLDivElement).innerText;
                    handleContentChange(index, content, setIsTitle, setTheTitle, setIsArticle, setTheBody, debouncedUpdateStore);
                  }}
                >
                  {(index === 0 ? isPlaceHolderTitle : isPlaceHolderArticle ) && 
                  (index === 0 ? isTitle : isArticle ) && (
                    <span className="text-gray-400">
                      {index === 0 ? `${placeholder} here...` : `Write your ${placeholder} here...`}
                    </span>
                  )}
        </div>
    ))}
      </main>
    </div>
    </>
  );
};

export default ArticlePage;