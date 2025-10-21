import { useMemo, useState, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { playbookButtonStyle } from "./styles/style_playbook_custombutton";
import { playbookButtonLogic } from "./utils/logic_playbook_custombutton";
import { CustomDashButtonProps } from "./type/type_playbook_custombutton";

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
    [type, isCreating, noteViewMode]
  );

  ///--------------------------------------------------------
  // Function to handle the cases of the playbookCustomButton
  ///--------------------------------------------------------
  const handleClick = useCallback(() => {
    setIsClicked(true);
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
    onClick,
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
      {noteViewMode === "edit" && (
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
