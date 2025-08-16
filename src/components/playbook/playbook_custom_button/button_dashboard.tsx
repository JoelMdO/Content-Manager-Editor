import React, { useMemo, useState, useCallback } from "react";
// import { useSelector } from "react-redux";
import Image from "next/image";
// import successAlert from "../alerts/sucess";
// import errorAlert from "../alerts/error";
import { useRouter } from "next/navigation";
// import postButtonClicked from "../../utils/buttons/save_button_clicked";
// import emailMe from "@/utils/buttons/email_me";
// import handleNoteClick from "../../utils/playbook/handle_note_click";
// import { PlaybookMeta } from "../../../types/plabookMeta";
// import { RootState } from "@/store/store";
import { playbookButtonStyle } from "./styles/style_playbook_custombutton";
import { playbookButtonLogic } from "./utils/logic_playbook_custombutton";
import { CustomDashButtonProps } from "./type/type_playbook_custombutton";

// interface ButtonProps {
//   type: string;
//   onClick?: () => void;
//   isCreating?: boolean;
//   id?: string;
//   setViewDetails?: React.Dispatch<React.SetStateAction<boolean>>;
//   setEntries?: React.Dispatch<React.SetStateAction<PlaybookMeta[] | undefined>>;
//   setUpdateNote?: React.Dispatch<
//     React.SetStateAction<{ isUpdateNote: boolean; noteId: string | null }>
//   >;
//   setIsCreating?: React.Dispatch<React.SetStateAction<boolean>>;
//   "data-cy"?: string;
//   resetForm?: () => void;
//   DRAFT_KEY?: (db: string) => string;
//   dbNameToSearch?: string; // Optional prop for dbNameToSearch
// }

const PlaybookCustomButton: React.FC<Partial<CustomDashButtonProps>> = ({
  type,
  onClick,
  isCreating,
  id,
  setViewDetails,
  setEntries,
  setUpdateNote,
  setIsCreating,
  "data-cy": dataCity,
  resetForm,
}) => {
  const textSmallSize = "text-[0.60rem]";
  const router = useRouter();

  const [isClicked, setIsClicked] = useState(false);
  const [noteViewMode, setNoteViewMode] = useState<"view" | "edit">("view");

  // const italic = useSelector((state: RootState) => state.data_state?.fontStyle);
  // const bold = useSelector((state: RootState) => state.data_state?.fontWeight);

  const {
    text,
    isNew,
    color,
    hover_color,
    otherFeatures,
    textColor,
    icon,
    position,
    shadow,
    height,
    width,
  } = useMemo(
    () => playbookButtonStyle(type!, isCreating, noteViewMode),
    [type, isCreating, isClicked, noteViewMode]
  );

  ///--------------------------------------------------------
  // Function to handle the cases of the playbookCustomButton
  ///--------------------------------------------------------
  const handleClick = useCallback(() => {
    console.log("Playbook Button Clicked");

    playbookButtonLogic({
      type,
      router,
      noteViewMode,
      setNoteViewMode,
      setEntries,
      setViewDetails,
      setUpdateNote,
      id,
      resetForm,
      setIsCreating,
      onClick,
    });
  }, [
    type,
    router,
    noteViewMode,
    setNoteViewMode,
    setEntries,
    setViewDetails,
    setUpdateNote,
    id,
    resetForm,
    setIsCreating,
  ]);
  //
  ///--------------------------------------------------------
  // UI of the button
  ///--------------------------------------------------------
  return (
    <>
      <button
        type="button"
        data-cy={dataCity}
        className={`${height} ${width} ${textColor} ${otherFeatures} ${shadow} ${position} ${textSmallSize} md:text-lg rounded text-center flex items-center justify-center md:gap-2 gap-1 ${
          isClicked ? "bg-cream text-black" : color
        } hover:${hover_color}`}
        onClick={handleClick}
      >
        {!isNew && (
          <Image
            src={icon}
            style={{ display: isClicked ? "none" : "block" }}
            className={`md:w-6 md:h-6 w-3 h-3 cursor-pointer ${textColor}`}
            width={12}
            height={12}
            alt={`${text}-icon`}
          />
        )}
        {isClicked ? "Posting" : text}
      </button>
      {noteViewMode === "view" && (
        <button
          className="flex mt-2 justify-end cursor-pointer"
          type="button"
          onClick={() => setViewDetails!(false)}
        >
          <p className="text-sm text-gray-500">Close</p>
        </button>
      )}
    </>
  );
};

export default PlaybookCustomButton;
