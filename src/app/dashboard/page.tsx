'use client'
import React, { useRef, useState, useEffect, useCallback } from "react";
import { handleKeyBoardActions } from "../../services/handle_keys";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../services/store";
import { createArticleID } from "@/utils/create_id";
import dynamic from "next/dynamic";
import { debounce } from "lodash";
import LogOutButton from "@/components/logout_buttons";
import deleteImageFromIndexDB from "@/services/delete_img_from_indexdb";

const ImageButton = dynamic(() => import("../../components/image_button"), { ssr: false });
const LinkButton = dynamic(() => import("../../components/link_button"), { ssr: false });
const FontStyleUI = dynamic(() => import("../../components/font_style_ui"), { ssr: false });
const CustomButton = dynamic(() => import("../../components/custom_buttons"), { ssr: false });

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
  console.log('page'); 
  const pageRef = useRef(null);
  // Check if an article is already created on page load
  // Store articleID in a ref to persist across renders
  const articleIDRef = useRef<string>("");
  const previousArticleID = useSelector((state: any) => state.data_state?.id);
  // Create article ID only once when component mounts
  useEffect(() => {
    if (!articleIDRef.current) {
      articleIDRef.current = createArticleID(dispatch, previousArticleID)!;
      console.log('articleID', articleIDRef.current);
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
  // Update the store with the Title and Body of the article
  // Debounced store update function
  const debouncedUpdateStore = useCallback(
    debounce((newTitle: string, newBody: string) => {
      if (!articleIDRef.current) return;
      console.log('debounce Called');
      let title = newTitle.split(" ").slice(0, 2).join("-");
      let id = `${title}-${articleIDRef.current}`;
      // Remove previous body content before adding the new one
      let articleContent = JSON.parse(sessionStorage.getItem("articleContent") || "[]");
      if (newTitle !== "") {
        console.log('newTitle at debounce', newTitle);
        console.log('id at debounce', id);
        // Ensure only the latest title and id
        articleContent = articleContent.filter((item: { type: string}) => item.type !== "title" && item.type !== "id"); 
        // Add text to articleContent
        articleContent.push({
            type: "title",
            content: title,
        });
        articleContent.push({
          type: "id",
          content: id,
      });
      }


      if (newBody !== "") {
        console.log('newBody at debounce', newBody);
        // Ensure only the latest body
        articleContent = articleContent.filter((item: { type: string }) => item.type !== "body");
        // Add text to articleContent
        articleContent.push({
          type: "body",
          content: newBody,
        });
      sessionStorage.setItem("articleContent", JSON.stringify(articleContent));
      const storedContent = JSON.parse(sessionStorage.getItem("articleContent") || "[]");
      console.log("Updated articleContent:", storedContent);
      }
    }, 500), // Wait 500ms after last change before updating store
    []
  );

  // Handle content changes
  const handleContentChange = (index: number, content: string) => {
    console.log('handleContentChange Called');
    //
    if (index === 0) { // Title
      setIsTitle(false);
      setTheTitle(content);
      sessionStorage.setItem("tempTitle", content);
      // Get the last title content
      debouncedUpdateStore(content, theBody);
    } else { // Article
      setIsArticle(false);
      setTheBody(content);
      sessionStorage.setItem("tempBody", content);
      // Get the last body content
      debouncedUpdateStore(theTitle, content); 
      }
  };
  //
  // Call debounce flush() on button click
  const handleSave = () => {
    console.log('Button clicked, flushing debounce');
    debouncedUpdateStore.flush(); // Immediately executes pending updates
  };
  //
  const handleClear = () => {
    // Clear title and body state
    setTheTitle(""); 
    setTheBody("");
    // Remove the sesstion Storage after the page is mounted and if exist the article is created
    sessionStorage.removeItem("tempTitle");
    sessionStorage.removeItem("tempBody");
    // Clear the content inside the contentEditable divs
    editorRefs.current.forEach((ref) => {
    if (ref) {
      ref.innerText = "";
    }
    //Delete image from indexdb
    deleteImageFromIndexDB(undefined, "clear-all").then((response: any) => {
      if (response.status === 200) {
      console.log(response.message);
      }else{
        console.log("no image", response.message)
      }
    });
  });
  }
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
      <aside className="hidden w-1/4 h-100vh bg-gray-800 text-white md:flex items-center flex-col">
        <ImageButton editorRefs={editorRefs} index={1}/>
        <LinkButton editorRefs={editorRefs} index={1} />
        <FontStyleUI/>
        <CustomButton type='post' onClick={handleSave}/>
        <CustomButton type='clear' onClick={handleClear}/>
        <LogOutButton />
      </aside>
      {/* Menu Mobile*/}
      <nav className="md:hidden w-full h-20vh bg-gray-800 text-white flex justify-around p-2 flex-row">
        <div className="flex items-center flex-col">
          <div className="flex flex-row space-x-2">
        <ImageButton editorRefs={editorRefs} index={1}/>
        <LinkButton editorRefs={editorRefs} index={1} /></div>
        <CustomButton type='clear' onClick={handleClear}/></div>
        <FontStyleUI/>
        <CustomButton type='post' onClick={handleSave}/>
        <LogOutButton />
      </nav>
      {/* Main Content */}
      <main className="flex-1 p-4">
      {["Title", "Article"].map((placeholder, index) => (
        <div key={index} style={{ userSelect: "text", cursor: "text" }}
                ref={(el) => {
                  if (el && !editorRefs.current[index]) {
                    // Assign only if not already set
                    // as due to API call on LinkButton needs to be hold
                    editorRefs.current[index] = el; 
                }
                }}
                className={`${placeholder === "Title" ? "h-[10%]": "h-[85%]"} ${placeholder === "Title" ? "font-bold": "font-normal"} p-4 border rounded-g shadow-sm focus:outline-none cursor-pointer text-white`}
                contentEditable={true}
                onKeyDown={(e) => handleKeyBoardActions(e, index, editorRefs)}
                suppressContentEditableWarning={true}
                  onFocus={() => index === 0 ? setPlaceHolderTitle(false) : setPlaceHolderArticle(false)}
                  onInput={(e) => {
                    const content = (e.target as HTMLDivElement).innerText;
                    handleContentChange(index, content);
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