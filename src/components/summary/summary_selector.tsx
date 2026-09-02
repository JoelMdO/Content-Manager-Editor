import { useDraftStore } from "@/store/useDraftStore";
import { buttonMenuLogic } from "../dashboard/menu/button_menu/utils/logic_menu_button";
import { useCallback, useEffect, useState } from "react";
import { useUIStore } from "@/store/useUIStore";
import { iconsMenu } from "../../constants/icons";
import { StorageArticle } from "@/types/storage_item";
import errorAlert from "../alerts/error";

const SummarySelector = () => {
  //
  //   setIsClicked,
  const summaryDialogRef = useUIStore((s) => s.summaryDialogRef);
  const summarySelectorRef = useUIStore((s) => s.summarySelectorRef);
  const setIsSummary = useUIStore((s) => s.setIsSummary);
  const setSummaryContent = useUIStore((s) => s.setSummaryContent);
  const setLanguage = useDraftStore((s) => s.setLanguage);
  const dbNameToSearch = useDraftStore((s) => s.dbName);
  const [selectedOption, setSelectedOption] = useState("");
  //
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const dialog = summarySelectorRef!.current;
      if (!dialog) return;
      if (event.target === dialog) {
        dialog.close();
      }
    }
    // Close dialog on Escape key
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        summarySelectorRef!.current?.close();
      }
    };
    // Tap on mobile
    function handleClickOrTapOutside(event: MouseEvent | TouchEvent) {
      const dialog = summarySelectorRef?.current;
      if (!dialog) return;
      // If the user taps/clicks the backdrop (outside the dialog content)
      if (event.target === dialog) {
        dialog.close();
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
  }, [summarySelectorRef]);
  //
  const handleClick = useCallback(() => {
    buttonMenuLogic({
      type: "summary",
      summaryDialogRef,
      setIsSummary,
      setSummaryContent,
      setLanguage,
      dbNameToSearch,
    });
  }, [
    summaryDialogRef,
    setSummaryContent,
    setIsSummary,
    setLanguage,
    dbNameToSearch,
  ]);
  //
  const loadSummary = (language: "en" | "es") => {
    const type = language === "en" ? "summary" : "es_summary";
    const db = sessionStorage.getItem("db") as string;
    const raw = localStorage.getItem(`draft-articleContent-${db}`);
    const items = Object.values(JSON.parse(raw || "{}")) as StorageArticle[];
    console.log("Loaded summary with content:", items);
    if (items) {
      const storedSummary = items.find(
        (item: StorageArticle) => item.type === type,
      )?.content;
      console.log("Stored summary found:", storedSummary);
      if (storedSummary === undefined || storedSummary === "") {
        setIsSummary(false);
        summaryDialogRef?.current?.close();
        errorAlert(
          "saved-locally",
          "summaryNotFound",
          "Summary not found locally.",
        );
      } else {
        setLanguage(language);
        setSummaryContent(storedSummary);
        summaryDialogRef?.current?.showModal();
      }
    }
  };
  //
  return (
    <>
      <dialog
        ref={summarySelectorRef}
        className="w-[60%] min-h-screen z-50 bg-transparent"
      >
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center self-center w-[70%] bg-blue/80 rounded shadow-lg">
          <div className="flex flex-row items-center justify-center gap-2 mb-4 bg-slate-400 rounded-lg p-2">
            <span className="text-base text-black  w-[55%]">
              Summary Selector
            </span>
            <select
              id="summary-options"
              className=" flex items-center justify-center border-green bg-green/30 w-[50%] h-[5dvh] break-words"
              aria-label="Select summary options"
              value={selectedOption}
              onChange={(e) => {
                e.preventDefault();
                const value = e.currentTarget.value;
                setSelectedOption(value);
                if (value === "en_summary" || value === "es_summary") {
                  // Handle the "Edit" option
                  if (summaryDialogRef?.current) {
                    loadSummary(value === "en_summary" ? "en" : "es");
                  }
                  console.log("Edit option selected");
                } else if (value === "New Summary") {
                  // Handle the "New Summary" option
                  console.log("New Summary option selected");
                  handleClick();
                }

                summarySelectorRef?.current?.close();
                setSelectedOption(""); // Reset the selected option after handling
              }}
            >
              <option value="" disabled hidden>
                Select
              </option>
              <option value="en_summary">
                Edit Summary {iconsMenu.english}
              </option>
              <option value="es_summary">
                Edit Summary {iconsMenu.spanish}
              </option>
              <option value="New Summary">New Summary</option>
            </select>
            <div className="flex flex-col items-center justify-center">
              <span className="text-red">X</span>
              <button
                className="text-black"
                onClick={() => {
                  summarySelectorRef?.current?.close();
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
};
export default SummarySelector;
