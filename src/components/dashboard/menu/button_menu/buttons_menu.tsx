import React, { useMemo, useState, useCallback, useContext } from "react";
import { useRouter } from "next/navigation";
import { buttonMenuLogic } from "./utils/logic_menu_button";
import { ButtonProps } from "./type/type_menu_button";
import { menuButtonStyle } from "./style/style_menu_button";
import MenuContext from "./context/menu_context";

const MenuButton = ({
  type,
  index,
  setIsFontStyleOpen,
  setIsMenuClicked,
  tag,
}: Partial<ButtonProps>) => {
  // CONTEXT
  //=========================================================
  const {
    editorRefs,
    id,
    fileInputRef,
    dialogRef,
    dbNameToSearch,
    DRAFT_KEY,
    savedBodyRef,
    savedTitleRef,
    setSelectedSection,
    sectionsDialogRef,
    stylesDialogRef,
    setTranslating,
    setTranslationReady,
  } = useContext(MenuContext) as ButtonProps;
  // CONSTANTS
  //=========================================================
  const router = useRouter();
  // States
  //=========================================================
  const [isClicked, setIsClicked] = useState(false);
  //
  // Ensure safe access to editorRefs for Image and Link buttons
  let editorRef: HTMLDivElement | null = null;
  if (editorRefs && typeof index === "number") {
    const refValue = editorRefs.current ? editorRefs.current[index] : null;
    editorRef = refValue as HTMLDivElement;
  }

  const { text, icon } = useMemo(
    () => menuButtonStyle(type!, isClicked),
    [type, isClicked]
  );

  ///--------------------------------------------------------
  // Function to handle the cases of the MenuButtons
  ///--------------------------------------------------------
  const handleClick = useCallback(() => {
    buttonMenuLogic({
      fileInputRef,
      setIsClicked,
      dialogRef,
      sectionsDialogRef,
      router,
      dbNameToSearch,
      DRAFT_KEY,
      savedTitleRef,
      savedBodyRef,
      setSelectedSection,
      editorRefs,
      type,
      stylesDialogRef,
      setIsFontStyleOpen,
      setTranslating,
      setTranslationReady,
    });
  }, [type, setIsClicked, id, editorRefs]);
  //
  ///--------------------------------------------------------
  // UI of the button
  ///--------------------------------------------------------
  return (
    <>
      <button
        type="button"
        data-cy={`${type}-button`}
        className={`${
          isClicked
            ? " text-black bg-gradient-to-r to-orange-300 from-cyan-400 border-cyan-400"
            : "bg-gradient-to-r from-cyan-400 to-secondMenuButtonColor border border-green text-black"
        } hover:border-orange-300 font-bold mt-4 shadow-md shadow-black h-[30px] md:h-[40px] w-[9em] text-[0.60rem] md:text-lg rounded text-center flex items-center justify-center md:gap-2 gap-1`}
        onClick={() => {
          handleClick();
          if (type !== "post" && type !== "styles" && type !== "translate") {
            setTimeout(() => {
              setIsClicked(false);
              if (tag !== "desktop") {
                setIsMenuClicked!(false);
              }
            }, 2000);
          } else if (type === "translate") {
            setIsClicked(false);
            if (tag !== "desktop") {
              setIsMenuClicked!(false);
            }
          }
        }}
      >
        <div className="flex flex-row w-full h-full items-center justify-center space-x-1">
          <span className="flex text-lg">{icon}</span>
          <span className="flex text-xs">{text}</span>
        </div>
      </button>
    </>
  );
};

export default MenuButton;
