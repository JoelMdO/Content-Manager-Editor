import React, { useMemo, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import Image from "next/image";
import successAlert from "../alerts/sucess";
import errorAlert from "../alerts/error";
import { useRouter } from "next/navigation";
import saveButtonClicked from "../../utils/buttons/save_button_clicked";
import emailMe from "@/utils/buttons/email_me";
import handleNoteClick from "../../utils/playbook/handle_note_click";
import { PlaybookMeta } from "../../types/plabookMeta";
import { RootState } from "@/store/store";
import { custommButtonStyle } from "../../styles/custom_buttom_style";

interface ButtonProps {
  type: string;
  onClick?: () => void;
  isCreating?: boolean;
  id?: string;
  setViewDetails?: React.Dispatch<React.SetStateAction<boolean>>;
  setEntries?: React.Dispatch<React.SetStateAction<PlaybookMeta[] | undefined>>;
  setUpdateNote?: React.Dispatch<
    React.SetStateAction<{ isUpdateNote: boolean; noteId: string | null }>
  >;
  setIsCreating?: React.Dispatch<React.SetStateAction<boolean>>;
  "data-cy"?: string;
  resetForm?: () => void;
}

const CustomDashboardButton: React.FC<ButtonProps> = ({
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

  const italic = useSelector((state: RootState) => state.data_state?.fontStyle);
  const bold = useSelector((state: RootState) => state.data_state?.fontWeight);

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
    () => custommButtonStyle(type, isCreating, isClicked),
    [type, isCreating, isClicked]
  );

  ///--------------------------------------------------------
  // Function to handle the cases of the CustomDashBoardButton
  ///--------------------------------------------------------
  const handleClick = useCallback(() => {
    onClick?.();

    switch (type) {
      case "post":
        setIsClicked(true);
        saveButtonClicked(italic, bold)
          .then((response) => {
            setIsClicked(false);
            if (response.status === 200) {
              successAlert("saved");
              if (response.body) {
                const dbName = sessionStorage.getItem("db");
                const articleContent = JSON.parse(
                  sessionStorage.getItem(`articleContent-${dbName}`) || "[]"
                );
                articleContent.push({ type: "body", content: response.body });
              }
            } else if (
              response.status === 401 ||
              response.message === "User not authenticated"
            ) {
              errorAlert("saved", "nonauth", response.message);
              router.push("/");
            } else {
              errorAlert("saved", "non200", response.message);
            }
          })
          .catch((error) => {
            setIsClicked(false);
            errorAlert("saved", "error", error);
          });
        break;
      case "logo":
        emailMe();
        break;
      case "view-note":
        const toggleMode = noteViewMode === "view" ? "edit" : "view";
        setNoteViewMode(toggleMode);
        if (noteViewMode === "view") {
          setEntries?.((prev) =>
            prev!.map((entry) =>
              entry.id === id ? { ...entry, loading: true } : entry
            )
          );
          handleNoteClick(id!).then((meta) => {
            setViewDetails?.(true);
            setEntries?.((prev) =>
              prev!.map((entry) =>
                entry.id === id ? { ...entry, loading: false } : entry
              )
            );
            if (meta) {
              setEntries?.((prev) =>
                prev!.map((entry) => (entry.id === id ? meta : entry))
              );
            }
          });
        } else {
          setUpdateNote?.({ isUpdateNote: true, noteId: id! });
        }
        break;
      case "updatePlaybook":
        setUpdateNote?.({ isUpdateNote: false, noteId: "" });
        break;
      case "new-playbook":
        resetForm?.();
        router.push("/home");
        break;
      case "new-playbook-at-readplaybook":
        setIsCreating?.(false);
        break;
    }
  }, [
    type,
    onClick,
    noteViewMode,
    italic,
    bold,
    id,
    setEntries,
    setViewDetails,
    setUpdateNote,
    resetForm,
    setIsCreating,
    router,
  ]);
  //
  ///--------------------------------------------------------
  // UI of the button
  ///--------------------------------------------------------
  return (
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
  );
};

export default CustomDashboardButton;
