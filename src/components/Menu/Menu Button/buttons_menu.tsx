import React, {
  useMemo,
  useState,
  useCallback,
  // useRef,
  useContext,
  // ChangeEvent,
} from "react";
// import { useSelector } from "react-redux";
// import Image from "next/image";
// import successAlert from "../alerts/sucess";
// import errorAlert from "../alerts/error";
import { useRouter } from "next/navigation";
// import saveButtonClicked from "../../utils/buttons/save_button_clicked";
// import emailMe from "@/utils/buttons/email_me";
// import handleNoteClick from "../../utils/playbook/handle_note_click";
// import { PlaybookMeta } from "../../types/plabookMeta";
// import { RootState } from "@/store/store";
// import { custommButtonStyle } from "../Custom Dahsboard/styles/custom_button_style";
import { buttonMenuLogic } from "./utils/logic_menu_button";
import { ButtonProps } from "./type/type_menu_button";
import { menuButtonStyle } from "./style/style_menu_button";
// import uploadImage from "@/utils/dashboard/images_edit/upload_image";
// import successAlert from "@/components/alerts/sucess";
// import errorAlert from "@/components/alerts/error";
// import ImageButton from "@/components/buttons/image_button";
import ImageInput from "./image_input";
import LinkDialog from "./link_dialog";
import SectionSelector from "../sections_selector";
import MenuContext from "../../../utils/context/menu_context";
// import FontStyleUI from "@/components/Menu/Menu Button/font_style_buttons";
// import { useMenuContext } from "@/utils/context/menu_context";

const MenuButton = ({
  type,
  index,
  setIsFontStyleOpen,
}: Partial<ButtonProps>) => {
  // CONTEXT
  //=========================================================
  console.log("type at menubutton:", type);
  const {
    editorRefs,
    "data-cy": dataCity,
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
    // setIsClicked,
    // isClicked,
  } = useContext(MenuContext) as ButtonProps;
  // CONSTANTS
  //=========================================================
  // const textSmallSize = "";
  const router = useRouter();
  // States
  //=========================================================
  const [isClicked, setIsClicked] = useState(false);
  const [noteViewMode, setNoteViewMode] = useState<"view" | "edit">("view");
  //
  // Ensure safe access to editorRefs for Image and Link buttons
  let editorRef: HTMLDivElement | null = null;
  if (editorRefs && typeof index === "number") {
    const refValue = editorRefs.current ? editorRefs.current[index] : null;
    editorRef = refValue as HTMLDivElement;
  }

  // const sectionsDialogRef = useRef<HTMLDialogElement | null>(null);
  // const sectionsType = useRef<string>("");
  // console.log("dialogRef at buttons:", sectionsDialogRef);

  //
  // const italic = useSelector((state: RootState) => state.data_state?.fontStyle);
  // const bold = useSelector((state: RootState) => state.data_state?.fontWeight);

  console.log("isCreating:", isClicked);
  // sectionsType.current = type as string;
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
      // italic,
      // bold,
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
        data-cy={dataCity}
        className={`${
          isClicked
            ? " text-black bg-gradient-to-r to-orange-300 from-cyan-400 border-cyan-400"
            : "bg-gradient-to-r from-cyan-400 to-secondMenuButtonColor border border-green text-black"
        } hover:border-orange-300 font-bold mt-4 shadow-md shadow-black h-[30px] md:h-[40px] w-[9em] text-[0.60rem] md:text-lg rounded text-center flex items-center justify-center md:gap-2 gap-1`}
        onClick={() => {
          handleClick();
          if (type !== "post") {
            setTimeout(() => {
              setIsClicked(false);
            }, 2000);
          }
        }}
      >
        <div className="flex flex-row w-full h-full items-center justify-center space-x-1">
          <span className="flex text-lg">{icon}</span>
          <span className="flex text-xs">{text}</span>
        </div>
      </button>
      {/* {type === "sections" && (
        <SectionSelector
        // sectionsDialogRef={sectionsDialogRef}
        // db={dbNameToSearch as string}
        // selectedSection={selectedSection}
        // setSelectedSection={setSelectedSection}
        />
      )} */}
      {/* {type === "image" && (
        <ImageInput
          index={index!}
          setIsClicked={setIsClicked}
          // fileInputRef={fileInputRef}
          // handleFileChange={handleFileChange}
        />
      )} */}
      {/* {type === "link" && (
        <LinkDialog index={index!} setIsClicked={setIsClicked} />
      )} */}
    </>
  );
};

export default MenuButton;
