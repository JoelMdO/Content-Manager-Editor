import { handleFontChange } from "./utils/handle_font_change";
import { useContext, useState } from "react";
import { menuButtonStyle } from "./style/style_menu_button";
import section from "../../../../../public/section.svg";
import list from "../../../../../public/list.svg";
import quote from "../../../../../public/quote.svg";
import Image from "next/image";
import MenuContext from "./context/menu_context";
import { ButtonProps } from "./type/type_menu_button";

const FontStyleUI: React.FC<{
  setIsFontStyleOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsMenuClicked?: React.Dispatch<React.SetStateAction<boolean>>;
  type: string;
}> = ({ setIsFontStyleOpen, setIsMenuClicked, type }) => {
  ///========================================================
  // To give to the font style as Bold or Italic
  ///========================================================
  const { defaultProperties } = menuButtonStyle("styles", false);
  const [isPressed, setIsPressed] = useState<boolean>(false);
  const { editorRefs } = useContext(MenuContext) as ButtonProps;
  const fontTypes = [
    { type: "B", value: "bold" },
    { type: "I", value: "italic" },
    { type: "U", value: "underline" },
    { type: "A++", value: "font_h2" },
    { type: "A+", value: "font_h3" },
    { type: section, value: "section" },
    { type: list, value: "list" },
    { type: quote, value: "quote" },
  ];
  //

  return (
    <>
      <div className="md:top-1/2 md:left-1/2 md:transform md:translate-x-1/2 md:translate-y-1/2 flex flex-col justify-center items-center md:justify-normal md:items-start">
        <div className="flex flex-row space-x-3">
          {Array.from(fontTypes).map((font) => (
            <button
              key={font.value}
              type="button"
              data-cy={`${font.value}-button`}
              className={`${
                isPressed
                  ? " text-black bg-gradient-to-r to-orange-300 from-cyan-400 border-cyan-400"
                  : defaultProperties
              } mt-2 text-lg text-white border-2 border-green w-10 h-9`}
              onClick={() => {
                handleFontChange(
                  font.value as SetMarkDownAttr,
                  editorRefs?.current
                ),
                  setIsFontStyleOpen(false),
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
        </div>
      </div>
    </>
  );
};

export default FontStyleUI;
