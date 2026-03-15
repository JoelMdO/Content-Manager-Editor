import { handleFontChange } from "./utils/handle_font_change";
import { useState } from "react";
import { menuButtonStyle } from "./style/style_menu_button";
// import section from "../../../../../public/section.svg";
// import list from "../../../../../public/list.svg";
// import quote from "../../../../../public/quote.svg";
import {
  TableCellsSplit,
  AArrowUp,
  AArrowDown,
  Baseline,
  ListOrdered,
  List,
  Quote,
  Code,
  Table,
  Highlighter,
  TableRowsSplit,
  Italic,
  Bold,
} from "lucide-react";
import Image from "next/image";
import { useEditorStore } from "@/store/useEditorStore";

const FontStyleUI: React.FC<{
  setIsFontStyleOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  setIsMenuClicked?: React.Dispatch<React.SetStateAction<boolean>>;
  type: string;
}> = ({ setIsFontStyleOpen, setIsMenuClicked, type }) => {
  const { defaultProperties } = menuButtonStyle("styles", false);
  const [isPressed, setIsPressed] = useState<boolean>(false);

  const fontTypes = [
    { type: Bold, value: "bold" },
    { type: Italic, value: "italic" },
    { type: Baseline, value: "underline" },
    { type: AArrowUp, value: "font_h2" },
    { type: AArrowDown, value: "font_h3" },
    { type: TableRowsSplit, value: "section" },
    { type: List, value: "list" },
    { type: Quote, value: "quote" },
    { type: ListOrdered, value: "ordered_list" },
    { type: Code, value: "code_block" },
    { type: Table, value: "table" },
    { type: Highlighter, value: "highlight" },
  ];
  // CHANGE LOG // Changed by : Copilot // Date : 2026-03-15
  // Reason : Use 3-column grid layout on mobile for font style buttons.
  // CHANGE LOG
  // Changed by : Copilot
  // Date       : 2026-03-15
  // Reason     : Render lucide icons (React components) directly instead of passing them to next/image as src.
  // Impact     : Buttons now correctly show lucide icons and text. Removed dependency on image src for icons.
  return (
    <>
      <div className="flex md:top-1/2 md:left-1/2 md:transform md:translate-x-1/2 md:translate-y-1/2 flex-col justify-center items-center md:justify-normal md:items-start">
        {/* ORIGINAL — replaced by: use grid on mobile to display 3 columns */}
        {/* <div className="flex flex-row flex-wrap gap-1">
          {Array.from(fontTypes).map((font) => (
            <button
              key={font.value}
              type="button"
              data-cy={`${font.value}-button`}
              className={`${
                isPressed
                  ? " text-black bg-gradient-to-r to-orange-300 from-cyan-400 border-cyan-400"
                  : defaultProperties
              } mt-2 text-lg text-white w-10 h-9`}
              onClick={() => {
                const editor = useEditorStore.getState().bodyEditorRef.current;
                if (editor) handleFontChange(font.value, editor);
                type === "mobile" ? setIsFontStyleOpen!(false) : null;
                setIsPressed(true);
                setTimeout(() => {
                  setIsPressed(false);
                  if (type !== "desktop") {
                    setIsMenuClicked!(false);
                  }
                }, 1000);
              }}
            >
              {typeof font.type === "string" ? (
                font.type
              ) : (
                <Image
                  src={font.type}
                  alt={font.value}
                  width={25}
                  height={25}
                  className="ml-1"
                />
              )}
            </button>
          ))}
        </div> */}
        {/* UPDATED — mobile uses 3-column grid; desktop keeps original flex/wrap */}
        <div
          className={`${type === "mobile" ? "grid grid-cols-3 gap-3 w-[85%]" : "flex flex-row flex-wrap gap-1"}`}
        >
          {Array.from(fontTypes).map((font) => (
            <button
              key={font.value}
              type="button"
              data-cy={`${font.value}-button`}
              className={`${
                isPressed
                  ? " text-black bg-gradient-to-r to-orange-300 from-cyan-400 border-cyan-400"
                  : defaultProperties
              } mt-2 text-lg text-white w-10 h-9`}
              onClick={() => {
                const editor = useEditorStore.getState().bodyEditorRef.current;
                if (editor) handleFontChange(font.value, editor);
                type === "mobile" ? setIsFontStyleOpen!(false) : null;
                setIsPressed(true);
                setTimeout(() => {
                  setIsPressed(false);
                  if (type !== "desktop") {
                    setIsMenuClicked!(false);
                  }
                }, 1000);
              }}
            >
              {/* {typeof font.type === "string" ? (
                font.type
              ) : ( 
                // <Image
                //   src={font.type}
                //   alt={font.value}
                //   width={25}
                //   height={25}
                //   className="ml-1"
                // />
                    */}
              {typeof font.type === "string"
                ? font.type
                : (() => {
                    const Icon =
                      font.type as unknown as React.ComponentType<any>;
                    return (
                      <Icon
                        title={font.value}
                        aria-label={font.value}
                        className="ml-1 hover:text-amber-500"
                        size={25}
                      />
                    );
                  })()}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default FontStyleUI;
