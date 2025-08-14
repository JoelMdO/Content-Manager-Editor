import { useContext, useEffect, useState } from "react";
import { sections, SectionsType } from "../../../../constants/sections";
import { ButtonProps } from "./type/type_menu_button";
import MenuContext from "./context/menu_context";

const SectionSelector = () => {
  //
  //CONTEXT
  //===================================================
  const { selectedSection, setSelectedSection, sectionsDialogRef, dbIsReady } =
    useContext(MenuContext) as ButtonProps;
  // let { dbNameToSearch } = useContext(MenuContext) as ButtonProps;

  // console.log(
  //   "db at sections selector:",
  //   dbNameToSearch,
  //   "sections:",
  //   selectedSection,
  //   "sectionsDialogRef:",
  //   sectionsDialogRef
  // );

  //
  //------------------------------------------
  // Purpose: Safely get db value from dbNameToSearch, handling both string and RefObject<string>.
  //------------------------------------------
  // let db = (dbNameToSearch.current) || "DeCav";
  // let dbName = (dbNameToSearch as string) || "DeCav";
  let dbName = "DeCav";
  if (typeof window !== "undefined" && typeof sessionStorage !== "undefined") {
    dbName = sessionStorage.getItem("db") || "DeCav";
  }
  const typedSections = sections as SectionsType;
  if (Object.prototype.hasOwnProperty.call(typedSections, dbName!)) {
    dbName = dbName;
  }
  const [isClicked, setIsClicked] = useState(false);
  //console.log("sections", sectionsDialogRef);
  //console.log("dbName at sections searcher:", dbName);

  //
  ///--------------------------------------------------------
  // Close dialog on outside click or Escape key//
  ///--------------------------------------------------------
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const dialog = sectionsDialogRef!.current;
      if (!dialog) return;
      if (event.target === dialog) {
        dialog.close();
        // console.log("Dialog closed");
        setSelectedSection!("Select category");
      }
    }
    // Close dialog on Escape key
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        sectionsDialogRef!.current?.close();
        setSelectedSection!("Select category");
      }
    };
    // Tap on mobile
    function handleClickOrTapOutside(event: MouseEvent | TouchEvent) {
      const dialog = sectionsDialogRef?.current;
      if (!dialog) return;
      // If the user taps/clicks the backdrop (outside the dialog content)
      if (event.target === dialog) {
        dialog.close();
        setSelectedSection && setSelectedSection("Select category");
      }
    }
    //
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("touchstart", handleClickOrTapOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("touchstart", handleClickOrTapOutside);
    };
  }, []);
  //
  //
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    // console.log("doing handleChange");
    // console.log("dbName sections selector:", dbName);
    setSelectedSection!(e.target.value);
    let articleContent: { type: string; content: string }[] = [];
    //
    articleContent = JSON.parse(
      sessionStorage.getItem(`articleContent-${dbName}`) || "[]"
    );
    // console.log("Selected section:", e.target.value);
    // console.log("articleContent before:", articleContent);

    //
    articleContent.push({ type: "section", content: e.target.value });
    sessionStorage.setItem(
      `articleContent-${dbName}`,
      JSON.stringify(articleContent)
    );
    // console.log("articleContent after:", articleContent);

    // Clear the section selector dialog
    sectionsDialogRef?.current?.close();
  };
  //
  //
  return (
    <>
      <dialog
        ref={sectionsDialogRef}
        className="z-50 bg-white/50 border border-gold md:w-[40vw] lg:w-[20vw] w-[55vw] h-[30dvh] rounded shadow-lg absolute xs:left-[18dvh] xs:top-[25dvh] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      >
        <div className="w-full h-auto flex flex-col items-center">
          <span className="text-white text-center font-medium text-sm md:text-base g:text-lg mt-2">{`Select a section for ${dbName}`}</span>
          <select
            className={`h-[40px] w-[30vw] md:w-[20vw] lg:w-[15vw] shadow-md shadow-black bg-blue hover:bg-green text-white text-xs md:text-base g:text-lg font-bold rounded text-center flex items-center justify-center md:gap-2 gap-1 mt-8`}
            id="section-selector"
            aria-label="Select article category"
            onChange={handleChange}
            value={selectedSection}
          >
            <option>{selectedSection}</option>
            {/*GUARD TO AVOID CALL MAP IF NO SECTIONS OR NOT AN ARRAY*/}
            {Array.isArray(typedSections[dbName as string]) &&
              typedSections[dbName as string].map(
                (section: string, index: number) => (
                  <option key={index} value={section}>
                    {section}
                  </option>
                )
              )}
          </select>
        </div>
        <div className="flex w-[90%] h-auto justify-end mt-8 mr-4">
          <button
            type="button"
            className={`w-[20vw] md:w-[10vw] rounded-md ${
              isClicked ? "bg-amber-500" : "bg-blue/40"
            } text-white  shadow-md shadow-black text-center`}
            onClick={() => {
              setIsClicked(true);
              setTimeout(() => {
                sectionsDialogRef!.current?.close();
              }, 200);
            }}
          >
            CLOSE
          </button>
        </div>
      </dialog>
    </>
  );
};

export default SectionSelector;
