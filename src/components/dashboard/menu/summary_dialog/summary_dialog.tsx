import successAlert from "../../../alerts/sucess";
import { useContext, useState } from "react";
import { ButtonProps } from "../button_menu/type/type_menu_button";
import MenuContext from "../button_menu/context/menu_context";
import { iconsMenu } from "../../../../constants/icons";
import { handleClick } from "../../draft_article/utils/handle_click";
import { debounce } from "lodash";
import updateStorage from "./utils/update_storage";

const SummaryDialog = () => {
  ///========================================================2

  // To load links and store them in IndexedDB for later save on db.
  ///========================================================
  //
  const {
    summaryContent,
    setSummaryContent,
    summaryDialogRef,
    setLanguage,
    language,
  } = useContext(MenuContext) as ButtonProps;
  const summaryButtons = [
    { label: "summary-en", icon: iconsMenu.english },
    { label: "summary-es", icon: iconsMenu.spanish },
  ];
  const [saveText, setSaveText] = useState("Save");

  //
  ///--------------------------------------------------------
  // Change on editing summary content
  ///--------------------------------------------------------
  const handleChange = ({
    e,
  }: {
    e: React.ChangeEvent<HTMLTextAreaElement>;
  }) => {
    setSummaryContent!(e.target.value);
  };
  ///--------------------------------------------------------
  // Cleanup function when dialog closes
  ///--------------------------------------------------------
  const handleClose = () => {
    // Reset states when dialog closes
    setSaveText("Save");
    summaryDialogRef?.current?.close();
    if (summaryContent === "") {
      setSummaryContent("");
    }
  };
  ///--------------------------------------------------------
  // Debounce function to create the summary
  ///--------------------------------------------------------
  const debouncedCreateSummary = debounce(async () => {
    if (!summaryContent) return;
    const summary = language === "en" ? "summary" : "es-summary";
    const db = sessionStorage.getItem("db") || "DeCav";
    try {
      ///--------------------------------------------------------
      // Save the summary to the article content in sessionStorage
      ///--------------------------------------------------------
      updateStorage(
        sessionStorage, // pass sessionStorage or localStorage
        `articleContent-${db}`,
        summary,
        summaryContent
      );
      ///--------------------------------------------------------
      // Update the article content in localStorage
      ///--------------------------------------------------------
      updateStorage(
        localStorage, // pass sessionStorage or localStorage
        `draft-articleContent-${db}`,
        summary,
        summaryContent
      );
      successAlert("summary", "summarySaved");
    } catch {
      // console.error("Error creating summary:", error);
    }
  }, 500);

  ///--------------------------------------------------------
  // Save the summary content
  ///--------------------------------------------------------
  const handleSave = async () => {
    setSaveText("Saving...");
    await debouncedCreateSummary();
    successAlert("summary");
    setSaveText("Save");
    // Don't close automatically after save
  };
  ///--------------------------------------------------------
  //
  return (
    <dialog
      ref={summaryDialogRef}
      className="modal bg-blue w-[70vw] md:w-[50vw] g:w-[30vw] h-[40dvh] rounded shadow-lg z-50 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      data-cy="dialog-summary"
    >
      <form
        method="dialog"
        className="modal-box flex flex-col items-center w-full h-full mt-2"
      >
        <textarea
          className="mt-2 border-green w-[90%] h-[30dvh] break-words"
          value={summaryContent}
          data-cy="dialog-input-link"
          onChange={(e) => handleChange({ e })}
        />
        <div className="mt-4 mb-2 flex flex-row items-center justify-evenly w-full h-[10dvh]">
          {/* Save button */}
          <button
            className="border-green text-white border-b-2"
            type="button"
            onClick={async () => {
              await handleSave();
            }}
          >
            {saveText}
          </button>
          {/* Close button */}
          <button
            className="border-green text-white border-b-2"
            type="button"
            onClick={() => {
              handleClose();
            }}
          >
            Close
          </button>
          {/* Language buttons */}
          {summaryButtons.map((button) => (
            <button
              key={button.label}
              className="w-5 h-5"
              type="button"
              onClick={() => {
                handleClick({
                  setSummaryContent,
                  setLanguage,
                  tag: button.label,
                });
              }}
            >
              {button.icon}
            </button>
          ))}
        </div>
      </form>
    </dialog>
  );
};
export default SummaryDialog;
